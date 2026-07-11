// Test de securite : simule ce qu'un attaquant pourrait tenter avec la cle
// publique (anon). TOUT doit etre refuse, sauf la lecture des contenus publies.
// Usage : npm run check:security
import * as fs from "fs";
import * as path from "path";

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
  console.error("❌ Impossible de lire les clés Supabase dans .env.local");
  console.error("Variables trouvées :", Object.keys(env).join(", ") || "(aucune)");
  process.exit(1);
}
const HEADERS = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

let failures = 0;

function verdict(name, blocked, detail = "") {
  if (blocked) console.log(`✅ ${name} : bien bloqué ${detail}`);
  else {
    failures++;
    console.log(`🚨 ${name} : PAS BLOQUÉ — FAILLE À CORRIGER ${detail}`);
  }
}

// 1. Tentative d'ecriture d'un article (doit echouer)
{
  const res = await fetch(`${URL_BASE}/rest/v1/articles`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ title: "HACK TEST", slug: "hack-test-" + Date.now() }),
  });
  verdict("Créer un article sans être connecté", !res.ok, `(code ${res.status})`);
}

// 2. Tentative de modification (doit echouer ou toucher 0 ligne)
{
  const res = await fetch(
    `${URL_BASE}/rest/v1/articles?slug=neq.zzz&limit=1`,
    {
      method: "PATCH",
      headers: { ...HEADERS, Prefer: "return=representation" },
      body: JSON.stringify({ title: "PIRATÉ" }),
    },
  );
  const body = res.ok ? await res.json() : [];
  verdict(
    "Modifier un article sans être connecté",
    !res.ok || body.length === 0,
    `(code ${res.status})`,
  );
}

// 3. Tentative de suppression (doit echouer ou toucher 0 ligne)
{
  const res = await fetch(`${URL_BASE}/rest/v1/articles?title=eq.HACK%20TEST`, {
    method: "DELETE",
    headers: { ...HEADERS, Prefer: "return=representation" },
  });
  const body = res.ok ? await res.json() : [];
  verdict(
    "Supprimer des articles sans être connecté",
    !res.ok || body.length === 0,
    `(code ${res.status})`,
  );
}

// 4. Lecture des brouillons (doit renvoyer 0 resultat)
{
  const res = await fetch(
    `${URL_BASE}/rest/v1/articles?status=eq.draft&select=id`,
    { headers: HEADERS },
  );
  const body = res.ok ? await res.json() : [];
  verdict("Lire les brouillons non publiés", body.length === 0, `(${body.length} visible(s))`);
}

// 5. Tentative de creation de categorie (doit echouer)
{
  const res = await fetch(`${URL_BASE}/rest/v1/categories`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ name: "HACK", slug: "hack-" + Date.now() }),
  });
  verdict("Créer une catégorie sans être connecté", !res.ok, `(code ${res.status})`);
}

// 6. Upload anonyme dans le storage (doit echouer)
{
  const res = await fetch(`${URL_BASE}/storage/v1/object/media/hack-test.txt`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: "hack",
  });
  verdict("Uploader un fichier sans être connecté", !res.ok, `(code ${res.status})`);
}

// 7. Tentative d'inscription publique (doit etre desactivee)
{
  const res = await fetch(`${URL_BASE}/auth/v1/signup`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email: `hacker${Date.now()}@test-securite.com`,
      password: "MotDePasseTest123!",
    }),
  });
  const body = await res.text();
  const blocked = !res.ok || /not allowed|disabled/i.test(body);
  verdict("S'inscrire soi-même comme utilisateur", blocked, `(code ${res.status})`);
  if (!blocked)
    console.log(
      "   → Correctif : Supabase > Authentication > Sign In / Up > désactiver « Allow new users to sign up »",
    );
}

// 8. La lecture publique des articles publies doit MARCHER (sinon le site est cassé)
{
  const res = await fetch(
    `${URL_BASE}/rest/v1/articles?select=id&limit=1`,
    { headers: HEADERS },
  );
  if (res.ok) console.log("✅ Lecture publique des articles publiés : fonctionne (normal)");
  else {
    failures++;
    console.log(`🚨 Lecture publique : cassée (code ${res.status}) — le site ne peut plus lire !`);
  }
}

console.log(
  failures === 0
    ? "\n🛡️ Résultat : aucune faille détectée. Ta base refuse toutes les écritures anonymes."
    : `\n⚠️ Résultat : ${failures} problème(s). Copie ce rapport à Claude pour obtenir le correctif SQL.`,
);
