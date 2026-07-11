// Importe le contenu WordPress (export/wordpress-export.json) dans Supabase :
// categories, auteurs (comptes + profils), articles + upload des images de
// couverture dans le bucket "media". Relançable sans risque (upsert par slug).
// Usage : npm run import:wordpress
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

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
const H = {
  apikey: SERVICE,
  Authorization: `Bearer ${SERVICE}`,
  "Content-Type": "application/json",
};

async function rest(pathname, options = {}) {
  const res = await fetch(`${URL_BASE}${pathname}`, {
    ...options,
    headers: { ...H, ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw new Error(`${pathname} → ${res.status} : ${text.slice(0, 300)}`);
  return body;
}

const data = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "export", "wordpress-export.json"), "utf-8"),
);
console.log(`Import : ${data.categories.length} catégories, ${data.articles.length} articles\n`);

// ---------------------------------------------------------------------------
// 1. Catégories (upsert par slug)
// ---------------------------------------------------------------------------
await rest(`/rest/v1/categories?on_conflict=slug`, {
  method: "POST",
  headers: { Prefer: "resolution=merge-duplicates" },
  body: JSON.stringify(data.categories),
});
const cats = await rest(`/rest/v1/categories?select=id,slug`);
const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
console.log(`✅ Catégories : ${cats.length} en base`);

// ---------------------------------------------------------------------------
// 2. Auteurs : compte Supabase Auth + profil pour chaque auteur WordPress
// ---------------------------------------------------------------------------
const wantedAuthors = new Map();
for (const a of data.articles) {
  if (a.author_email) wantedAuthors.set(a.author_email.toLowerCase(), a.author_name);
}

const existing = await rest(`/auth/v1/admin/users?per_page=200`);
const usersByEmail = new Map(
  (existing.users || []).map((u) => [String(u.email).toLowerCase(), u.id]),
);

const authorId = {}; // email -> profile id
for (const [email, name] of wantedAuthors) {
  let uid = usersByEmail.get(email);
  if (!uid) {
    const created = await rest(`/auth/v1/admin/users`, {
      method: "POST",
      body: JSON.stringify({
        email,
        email_confirm: true,
        password: crypto.randomBytes(16).toString("hex"),
        user_metadata: { name },
      }),
    });
    uid = created.id;
    console.log(`✅ Compte créé pour ${name} (${email}) — mot de passe à définir via « Mot de passe oublié »`);
  } else {
    console.log(`✅ Compte existant pour ${name} (${email})`);
  }
  await rest(`/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ id: uid, name, role: "editor" }),
  });
  authorId[email] = uid;
}
// Auteur de secours : premier profil admin, sinon premier profil
const profiles = await rest(`/rest/v1/profiles?select=id,role&order=created_at`);
const fallbackAuthor =
  profiles.find((p) => p.role === "admin")?.id ?? profiles[0]?.id ?? null;

// ---------------------------------------------------------------------------
// 3. Articles : image -> storage, puis upsert par slug
// ---------------------------------------------------------------------------
let ok = 0, skipped = 0, failed = 0;
for (const [i, a] of data.articles.entries()) {
  const label = `[${i + 1}/${data.articles.length}] ${a.title.slice(0, 60)}`;
  try {
    const already = await rest(`/rest/v1/articles?slug=eq.${encodeURIComponent(a.slug)}&select=id`);
    if (already.length > 0) {
      skipped++;
      console.log(`⏭️  ${label} (déjà importé)`);
      continue;
    }

    // Telecharge la couverture depuis WordPress puis upload dans "media"
    let coverUrl = "";
    if (a.cover_image_url) {
      try {
        const img = await fetch(a.cover_image_url, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (img.ok) {
          const bytes = Buffer.from(await img.arrayBuffer());
          const contentType = img.headers.get("content-type") || "image/jpeg";
          const ext = (contentType.split("/")[1] || "jpg").replace("jpeg", "jpg");
          const key = `covers/${a.slug}.${ext}`;
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
          if (up.ok) coverUrl = `${URL_BASE}/storage/v1/object/public/media/${key}`;
        }
      } catch {
        // image inaccessible : on garde l'URL WordPress d'origine
      }
      if (!coverUrl) coverUrl = a.cover_image_url;
    }

    await rest(`/rest/v1/articles?on_conflict=slug`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content || "",
        cover_image_url: coverUrl,
        category_id: catId[a.category_slug] ?? null,
        author_id: authorId[a.author_email?.toLowerCase()] ?? fallbackAuthor,
        status: "published",
        featured: !!a.featured,
        tags: a.tags || [],
        views: a.views || 0,
        published_at: a.published_at ? a.published_at.replace(" ", "T") : null,
      }),
    });
    ok++;
    console.log(`✅ ${label}`);
  } catch (e) {
    failed++;
    console.log(`❌ ${label} → ${e.message}`);
  }
}

console.log(`\n🎉 Terminé : ${ok} importés, ${skipped} déjà présents, ${failed} échecs.`);
if (failed > 0) console.log("Relance la commande : seuls les échecs seront retentés.");
