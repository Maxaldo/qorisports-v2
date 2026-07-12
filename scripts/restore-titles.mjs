// Repare les titres ecrases par le test de securite : restaure le titre
// d'origine de chaque article importe de WordPress (correspondance par slug).
// Usage : node scripts/restore-titles.mjs
import * as fs from "fs";
import * as path from "path";

const buf = fs.readFileSync(path.join(process.cwd(), ".env.local"));
let rawEnv = buf.includes(0) ? buf.toString("utf16le") : buf.toString("utf-8");
rawEnv = rawEnv.replace(/^﻿/, "");
const env = {};
for (const line of rawEnv.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };

const data = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "export", "wordpress-export.json"), "utf-8"),
);

let fixed = 0;
for (const a of data.articles) {
  const res = await fetch(
    `${URL_BASE}/rest/v1/articles?slug=eq.${encodeURIComponent(a.slug)}&title=eq.PIRATE`,
    {
      method: "PATCH",
      headers: { ...H, Prefer: "return=representation" },
      body: JSON.stringify({ title: a.title }),
    },
  );
  if (res.ok) {
    const rows = await res.json();
    if (rows.length > 0) {
      fixed++;
      console.log(`✅ Restauré : ${a.title.slice(0, 70)}`);
    }
  } else {
    console.log(`❌ ${a.slug} : ${res.status}`);
  }
}

// Articles restants avec titre PIRATE (crees apres l'import : a corriger a la main)
const left = await fetch(`${URL_BASE}/rest/v1/articles?title=eq.PIRATE&select=slug,status`, { headers: H });
const rows = await left.json();

console.log(`\n🎉 ${fixed} titres restaurés depuis l'export WordPress.`);
if (rows.length > 0) {
  console.log(`⚠️ ${rows.length} article(s) restant(s) avec le titre PIRATE (créés après l'import, à renommer à la main dans le dashboard) :`);
  for (const r of rows) console.log(`   - ${r.slug} (${r.status})`);
} else {
  console.log("Aucun article restant avec le titre PIRATE. Tout est réparé.");
}
