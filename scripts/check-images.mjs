// Verifie que plus aucune image ne depend de WordPress.
// Usage : npm run check:images
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
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const res = await fetch(
  `${URL_BASE}/rest/v1/articles?select=slug,title,content,cover_image_url`,
  { headers: H },
);
const articles = await res.json();

let coversSupabase = 0, coversWordpress = 0, coversAutre = 0;
const wpDependants = [];

for (const a of articles) {
  const cover = a.cover_image_url || "";
  if (cover.includes(URL_BASE)) coversSupabase++;
  else if (cover.includes("qorisports.com")) coversWordpress++;
  else coversAutre++;

  const wpInContent = ((a.content || "").match(/qorisports\.com\/wp-content/g) || []).length;
  if (wpInContent > 0 || cover.includes("qorisports.com")) {
    wpDependants.push(`   - ${a.title.slice(0, 60)} (${wpInContent} image(s) dans le texte)`);
  }
}

console.log(`Articles analysés : ${articles.length}\n`);
console.log(`Couvertures hébergées chez Supabase : ${coversSupabase}`);
console.log(`Couvertures encore chez WordPress   : ${coversWordpress}`);
if (coversAutre) console.log(`Couvertures autres (placeholder...)  : ${coversAutre}`);

// Verification que les images Supabase repondent vraiment (echantillon)
const sample = articles
  .map((a) => a.cover_image_url)
  .filter((u) => u && u.includes(URL_BASE))
  .slice(0, 5);
let okCount = 0;
for (const u of sample) {
  const r = await fetch(u, { method: "HEAD" });
  if (r.ok) okCount++;
}
console.log(`Test d'affichage sur ${sample.length} images Supabase : ${okCount}/${sample.length} répondent`);

if (wpDependants.length === 0) {
  console.log("\n🎉 Aucune dépendance à WordPress : toutes les images t'appartiennent.");
} else {
  console.log(`\n⚠️ ${wpDependants.length} article(s) dépendent encore de WordPress :`);
  console.log(wpDependants.join("\n"));
  console.log("→ relance : npm run migrate:images");
}
