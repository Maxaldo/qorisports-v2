// Migre les images DANS le corps des articles : chaque image hébergée sur
// qorisports.com (WordPress) est téléchargée, uploadée dans le bucket "media"
// de Supabase, et l'URL est remplacée dans le contenu de l'article.
// Relançable sans risque. Usage : npm run migrate:images
import * as fs from "fs";
import * as path from "path";

// --- Lecture .env.local (gere encodages Windows) ---
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
if (!URL_BASE || !SERVICE) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
  process.exit(1);
}
const H = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" };

async function rest(pathname, options = {}) {
  const res = await fetch(`${URL_BASE}${pathname}`, {
    ...options,
    headers: { ...H, ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${pathname} → ${res.status} : ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

// Sanitize un morceau d'URL pour en faire un nom de fichier storage
function safeName(url) {
  const file = url.split("/").pop().split("?")[0];
  return decodeURIComponent(file).replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
}

// Cache : une même image WordPress utilisée dans plusieurs articles n'est
// téléchargée qu'une fois
const migrated = new Map();

async function migrateOne(wpUrl) {
  if (migrated.has(wpUrl)) return migrated.get(wpUrl);
  const img = await fetch(wpUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!img.ok) throw new Error(`téléchargement ${img.status}`);
  const bytes = Buffer.from(await img.arrayBuffer());
  const contentType = img.headers.get("content-type") || "image/jpeg";
  const key = `contenu/${safeName(wpUrl)}`;
  const up = await fetch(`${URL_BASE}/storage/v1/object/media/${key}`, {
    method: "POST",
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: bytes,
  });
  if (!up.ok) throw new Error(`upload ${up.status}`);
  const newUrl = `${URL_BASE}/storage/v1/object/public/media/${key}`;
  migrated.set(wpUrl, newUrl);
  return newUrl;
}

// Toutes les URLs qorisports.com/wp-content trouvées dans un texte
function findWpUrls(text) {
  const re = /https?:\/\/(?:www\.)?qorisports\.com\/wp-content\/uploads\/[^\s"'<>)]+/g;
  return [...new Set(text.match(re) || [])];
}

const articles = await rest(`/rest/v1/articles?select=id,slug,title,content,cover_image_url&order=published_at`);
console.log(`${articles.length} articles à examiner\n`);

let changed = 0, images = 0, errors = 0;
for (const [i, a] of articles.entries()) {
  const urls = findWpUrls((a.content || "") + " " + (a.cover_image_url || ""));
  if (urls.length === 0) continue;

  let content = a.content || "";
  let cover = a.cover_image_url || "";
  let articleOk = true;

  for (const url of urls) {
    try {
      const newUrl = await migrateOne(url);
      content = content.replaceAll(url, newUrl);
      cover = cover.replaceAll(url, newUrl);
      images++;
    } catch (e) {
      articleOk = false;
      errors++;
      console.log(`   ⚠️ image inaccessible (${e.message}) : ${url.slice(-60)}`);
    }
  }

  await rest(`/rest/v1/articles?id=eq.${a.id}`, {
    method: "PATCH",
    body: JSON.stringify({ content, cover_image_url: cover }),
  });
  changed++;
  console.log(`${articleOk ? "✅" : "🟡"} [${i + 1}/${articles.length}] ${a.title.slice(0, 60)} (${urls.length} image(s))`);
}

console.log(`\n🎉 Terminé : ${changed} articles mis à jour, ${images} images migrées, ${errors} images inaccessibles.`);
console.log(errors === 0
  ? "Plus aucune dépendance à WordPress : tu peux résilier l'hébergement quand tu veux."
  : "Relance la commande pour retenter les images en échec avant de couper WordPress.");
