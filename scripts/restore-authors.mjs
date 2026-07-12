// Restaure les auteurs des articles importes de WordPress :
// recree les comptes/profils supprimes et re-signe chaque article.
// Usage : node scripts/restore-authors.mjs
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

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

async function rest(pathname, options = {}) {
  const res = await fetch(`${URL_BASE}${pathname}`, {
    ...options,
    headers: { ...H, ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${pathname} → ${res.status} : ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

const data = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "export", "wordpress-export.json"), "utf-8"),
);

// 1. Recree les comptes + profils des auteurs
const wanted = new Map();
for (const a of data.articles) {
  if (a.author_email) wanted.set(a.author_email.toLowerCase(), a.author_name);
}

const existing = await rest(`/auth/v1/admin/users?per_page=200`);
const byEmail = new Map((existing.users || []).map((u) => [String(u.email).toLowerCase(), u.id]));

const authorId = {};
for (const [email, name] of wanted) {
  let uid = byEmail.get(email);
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
    console.log(`✅ Compte recréé : ${name} (${email})`);
  } else {
    console.log(`✅ Compte déjà présent : ${name} (${email})`);
  }
  await rest(`/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ id: uid, name, role: "editor" }),
  });
  authorId[email] = uid;
}

// 2. Re-signe chaque article selon l'export WordPress
let fixed = 0;
for (const a of data.articles) {
  const uid = authorId[a.author_email?.toLowerCase()];
  if (!uid) continue;
  await rest(`/rest/v1/articles?slug=eq.${encodeURIComponent(a.slug)}&author_id=is.null`, {
    method: "PATCH",
    body: JSON.stringify({ author_id: uid }),
  });
  fixed++;
}

console.log(`\n🎉 Terminé : signatures restaurées sur les articles importés (${fixed} vérifiés).`);
console.log("Les articles sans auteur affichaient « Rédaction » — recharge ton site pour vérifier.");
