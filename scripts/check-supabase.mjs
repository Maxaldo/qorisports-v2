// Verifie que le schema Supabase correspond a ce que le front attend.
// Usage : npm run check:supabase
import * as fs from "fs";
import * as path from "path";

// --- Lecture de .env.local ---
const envPath = path.join(process.cwd(), ".env.local");
const buf = fs.readFileSync(envPath);
// Gere les encodages Windows : UTF-16 (octets nuls) et BOM UTF-8
let raw = buf.includes(0) ? buf.toString("utf16le") : buf.toString("utf-8");
raw = raw.replace(/^﻿/, "");
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL_BASE || !KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou ANON_KEY manquant dans .env.local");
  process.exit(1);
}

const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// Colonnes attendues par le front (src/lib/api.ts)
const EXPECTED = {
  articles:
    "id,title,slug,excerpt,content,cover_image_url,featured,tags,views,published_at,created_at,category_id,author_id,status",
  categories: "id,name,slug,color,description",
  profiles: "id,name,avatar_url,role",
  matches:
    "id,home_team,away_team,home_logo,away_logo,match_date,match_time,venue,league,status,home_score,away_score,matchday",
  standings:
    "id,league,season,position,team,played,wins,draws,losses,goals_for,goals_against,points",
};

let ok = true;

async function checkTable(table, columns) {
  const url = `${URL_BASE}/rest/v1/${table}?select=${columns}&limit=1`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    const body = await res.text();
    if (res.ok) {
      const rows = JSON.parse(body);
      console.log(`✅ ${table} : OK (${rows.length ? "contient des données" : "vide pour l'instant"})`);
    } else {
      ok = false;
      console.log(`❌ ${table} : ERREUR ${res.status} → ${body.slice(0, 200)}`);
    }
  } catch (e) {
    ok = false;
    console.log(`❌ ${table} : injoignable → ${e.message}`);
  }
}

async function checkJoin() {
  const url = `${URL_BASE}/rest/v1/articles?select=id,category:categories(*),author:profiles(*)&limit=1`;
  const res = await fetch(url, { headers: HEADERS });
  const body = await res.text();
  if (res.ok) console.log("✅ jointures articles→categories/profiles : OK");
  else {
    ok = false;
    console.log(`❌ jointures : ERREUR ${res.status} → ${body.slice(0, 200)}`);
  }
}

async function checkRpc() {
  const res = await fetch(`${URL_BASE}/rest/v1/rpc/increment_views`, {
    method: "POST",
    headers: { ...HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ article_slug: "__test_inexistant__" }),
  });
  if (res.ok || res.status === 204) console.log("✅ fonction increment_views : OK");
  else {
    ok = false;
    console.log(`❌ increment_views : ERREUR ${res.status} → ${(await res.text()).slice(0, 200)}`);
  }
}

console.log(`Vérification du schéma sur ${URL_BASE}\n`);
for (const [table, cols] of Object.entries(EXPECTED)) {
  await checkTable(table, cols);
}
await checkJoin();
await checkRpc();

console.log(
  ok
    ? "\n🎉 Tout correspond ! Le front peut lire cette base."
    : "\n⚠️ Des différences existent — copie ce résultat à Claude pour qu'il adapte le front.",
);
