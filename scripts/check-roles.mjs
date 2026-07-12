// Teste la matrice des droits COTE CONNECTE : se connecte avec un compte
// redacteur (editor) et verifie que tout ce qui lui est interdit est bloque
// par la base elle-meme.
// Usage : node scripts/check-roles.mjs email-du-redacteur mot-de-passe
import * as fs from "fs";
import * as path from "path";

const [, , EMAIL, PASSWORD] = process.argv;
if (!EMAIL || !PASSWORD) {
  console.error('Usage : node scripts/check-roles.mjs "email@redacteur.com" "motdepasse"');
  console.error("(utilise un compte de test avec le rôle editor)");
  process.exit(1);
}

const buf = fs.readFileSync(path.join(process.cwd(), ".env.local"));
let rawEnv = buf.includes(0) ? buf.toString("utf16le") : buf.toString("utf-8");
rawEnv = rawEnv.replace(/^﻿/, "");
const env = {};
for (const line of rawEnv.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 1. Connexion
const login = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: ANON, "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
});
if (!login.ok) {
  console.error(`❌ Connexion impossible pour ${EMAIL} : ${(await login.text()).slice(0, 150)}`);
  process.exit(1);
}
const session = await login.json();
const TOKEN = session.access_token;
const UID = session.user.id;
const H = { apikey: ANON, Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
console.log(`Connecté en tant que ${EMAIL}\n`);

let failures = 0;
function verdict(name, blocked, detail = "") {
  if (blocked) console.log(`✅ ${name} : bien bloqué ${detail}`);
  else {
    failures++;
    console.log(`🚨 ${name} : PAS BLOQUÉ — FAILLE ${detail}`);
  }
}

const slug = `test-securite-${Date.now()}`;

// 2. Sanite : creer SON brouillon doit MARCHER
let articleId = null;
{
  const res = await fetch(`${URL_BASE}/rest/v1/articles`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ title: "Test sécurité rôles", slug, status: "draft", author_id: UID }),
  });
  if (res.ok) {
    articleId = (await res.json())[0]?.id;
    console.log("✅ Créer son propre brouillon : fonctionne (normal)");
  } else {
    failures++;
    console.log(`🚨 Créer son brouillon : CASSÉ (${res.status}) — le rédacteur ne peut plus travailler !`);
  }
}

// 3. Publier directement son article (doit echouer)
if (articleId) {
  const res = await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ status: "published" }),
  });
  const body = res.ok ? await res.json() : [];
  const published = res.ok && body[0]?.status === "published";
  verdict("Publier soi-même sans validation", !published, `(code ${res.status})`);
}

// 4. Soumettre pour validation doit MARCHER
if (articleId) {
  const res = await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ status: "pending" }),
  });
  const ok = res.ok && (await res.json())[0]?.status === "pending";
  if (ok) console.log("✅ Soumettre pour validation : fonctionne (normal)");
  else {
    failures++;
    console.log(`🚨 Soumettre pour validation : CASSÉ (${res.status})`);
  }
}

// 5. Modifier l'article d'un autre (doit toucher 0 ligne)
// Version SANS RISQUE : on cible UN article precis et on reecrit son titre
// A L'IDENTIQUE — meme si la modification passe, rien n'est change.
{
  const pick = await fetch(
    `${URL_BASE}/rest/v1/articles?author_id=neq.${UID}&select=id,title&limit=1`,
    { headers: H },
  );
  const target = pick.ok ? (await pick.json())[0] : null;
  if (!target) {
    console.log("ℹ️ Modifier l'article d'un autre : aucun article d'autrui visible (encore mieux)");
  } else {
    const res = await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${target.id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=representation" },
      body: JSON.stringify({ title: target.title }),
    });
    const body = res.ok ? await res.json() : [];
    verdict("Modifier l'article d'un autre", !res.ok || body.length === 0, `(code ${res.status})`);
  }
}

// 6. Gonfler les vues de son article (le trigger doit annuler)
if (articleId) {
  await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify({ views: 999999 }),
  });
  const check = await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}&select=views`, { headers: H });
  const views = (await check.json())[0]?.views ?? 0;
  verdict("Gonfler le compteur de vues", views < 999999, `(vues = ${views})`);
}

// 7. Creer une categorie (doit echouer)
{
  const res = await fetch(`${URL_BASE}/rest/v1/categories`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ name: "HACK", slug: `hack-${Date.now()}` }),
  });
  verdict("Créer une catégorie", !res.ok, `(code ${res.status})`);
}

// 8. Creer une publicite (doit echouer)
{
  const res = await fetch(`${URL_BASE}/rest/v1/ads`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ name: "HACK", image_url: "x" }),
  });
  verdict("Créer une publicité", !res.ok, `(code ${res.status})`);
}

// 9. Lire la liste des abonnes newsletter (doit renvoyer 0)
{
  const res = await fetch(`${URL_BASE}/rest/v1/subscribers?select=email&limit=5`, { headers: H });
  const body = res.ok ? await res.json() : [];
  verdict("Lire les emails des abonnés newsletter", !res.ok || body.length === 0, `(${body.length ?? 0} visible(s))`);
}

// 10. Modifier le classement (doit echouer ou toucher 0 ligne)
{
  const res = await fetch(`${URL_BASE}/rest/v1/standings?limit=1`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ points: 999 }),
  });
  const body = res.ok ? await res.json() : [];
  verdict("Modifier le classement", !res.ok || body.length === 0, `(code ${res.status})`);
}

// Nettoyage : supprime l'article de test
if (articleId) {
  // repasse en draft pour pouvoir le supprimer, puis supprime
  await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify({ status: "draft" }),
  });
  await fetch(`${URL_BASE}/rest/v1/articles?id=eq.${articleId}`, { method: "DELETE", headers: H });
  console.log("\n(Article de test nettoyé)");
}

console.log(
  failures === 0
    ? "\n🛡️ Résultat : la matrice des droits est appliquée par la base. Rédacteur bien limité."
    : `\n⚠️ Résultat : ${failures} faille(s). Copie ce rapport à Claude pour le correctif SQL.`,
);
