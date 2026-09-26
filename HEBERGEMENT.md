# Héberger Qorisports ailleurs — mode d'emploi

Le site n'a **aucune dépendance à Vercel**. Il peut tourner sur n'importe quel
hébergeur supportant Node.js 20+.

---

## Variables d'environnement (indispensables partout)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Adresse de la base Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `REVALIDATE_SECRET` | Secret partagé avec le dashboard |

⚠️ Les variables `NEXT_PUBLIC_*` sont lues **à la compilation** : elles doivent
être présentes au moment du `npm run build`, pas seulement au démarrage.

---

## Option A — Hébergeur Node (Hostinger Apps web, Render, Railway…)

1. Connecter le dépôt GitHub
2. Commande de build : `npm run build`
3. Commande de démarrage : `node .next/standalone/server.js`
4. Renseigner les variables ci-dessus
5. Port : `3000`

Grâce à `output: "standalone"` dans `next.config.ts`, la compilation produit un
dossier autonome contenant tout le nécessaire.

---

## Option B — VPS avec Docker

```bash
docker build -t qorisports \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx" .

docker run -d -p 3000:3000 --env-file .env.local --name qorisports qorisports
```

Pour le déploiement automatique à chaque `git push`, installer **Coolify** sur
le VPS : il détecte le Dockerfile et redéploie tout seul.

---

## Option C — Hébergement mutualisé (site 100 % statique)

Pour un hébergement sans Node (cPanel classique, Namecheap Stellar…), le site
peut être généré en fichiers HTML purs.

Modifications nécessaires dans `next.config.ts` :

```ts
output: "export",
```

Et il faut alors :

- retirer les `export const revalidate` des pages
- supprimer ou remplacer les routes `src/app/api/*` (pas de serveur)
- recréer les redirections dans un fichier `.htaccess`

Conséquence : un article publié apparaît après recompilation (~3 min) au lieu
d'être instantané. En contrepartie : aucune limite de ressources, site très
rapide, hébergement possible partout.

---

## Bascule du domaine (identique pour toutes les options)

1. Déployer et **tester** sur l'adresse temporaire du nouvel hébergeur
2. Vérifier : articles, images, recherche, publicités, dashboard
3. Chez Obambu (Gestion DNS / cPanel Zone Editor) : modifier l'enregistrement
   `A` de `qorisports.com` vers la nouvelle adresse IP
4. Attendre la propagation (jusqu'à 4 h)
5. Garder l'ancien hébergement actif quelques jours en filet de sécurité

Le référencement n'est **pas affecté** : le domaine et les URLs ne changent pas.
