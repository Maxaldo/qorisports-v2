# Brancher QorisLive sur les articles de QoriSports

> À coller dans l'assistant de code **du projet QorisLive**.

---

## Ce qu'on branche

QorisLive doit afficher les articles de football béninois publiés sur
qorisports.com : championnat professionnel, clubs, fédération, et sélections
nationales (Guépards toutes catégories).

Ces articles vivent dans le Supabase de QoriSports. **Une vue dédiée a déjà été
créée pour QorisLive** — il n'y a ni filtre ni jointure à écrire de ton côté.

---

## La source : la vue `articles_qorislive`

Tu interroges **uniquement** cette vue. Ne requête **jamais** la table
`articles` directement : elle contient tout le contenu de QoriSports
(basketball, handball, athlétisme, compétitions étrangères…) et des brouillons.

La vue applique déjà, côté serveur :

- uniquement les articles marqués pour QorisLive
- uniquement `status = 'published'`
- uniquement `published_at <= now()` (pas les publications programmées)

Elle contient environ 29 articles aujourd'hui, et se remplit automatiquement à
mesure que la rédaction publie.

### Colonnes disponibles

| Colonne | Type | Remarque |
|---|---|---|
| `id` | uuid | identifiant stable, à utiliser comme clé |
| `title` | text | |
| `excerpt` | text | résumé court, peut être `null` |
| `chapo` | text | chapeau éditorial, peut être `null` |
| `image_url` | text | image de couverture, **pleine résolution**, peut être `null` |
| `slug` | text | |
| `url` | text | URL complète de l'article sur qorisports.com, déjà construite |
| `category` | text | nom de la catégorie, ex. « Football » |
| `author` | text | nom de l'auteur, peut être `null` |
| `published_at` | timestamptz | |
| `views` | integer | |

**Traite `excerpt`, `chapo`, `image_url` et `author` comme pouvant être `null`.**
Prévois une image de remplacement quand `image_url` est vide.

---

## Requêtes

Première page :

```js
const { data, error } = await supabase
  .from('articles_qorislive')
  .select('*')
  .order('published_at', { ascending: false })
  .limit(20);
```

Page suivante — passe la date du dernier article reçu :

```js
const { data, error } = await supabase
  .from('articles_qorislive')
  .select('*')
  .order('published_at', { ascending: false })
  .lt('published_at', dernierPublishedAt)
  .limit(20);
```

Un seul article :

```js
const { data } = await supabase
  .from('articles_qorislive')
  .select('*')
  .eq('id', articleId)
  .maybeSingle();
```

---

## Sécurité — point non négociable

- Utilise **la clé `anon`** de Supabase. Elle est conçue pour être publique et
  peut vivre dans une application distribuée.
- **N'utilise jamais la clé `service_role`** dans l'application mobile. Elle
  contourne toutes les règles de sécurité, et une clé embarquée dans un APK est
  extractible en quelques minutes. Si le projet a un backend, elle ne doit
  exister que là.
- L'URL du projet et la clé anon vont dans les **variables d'environnement**,
  jamais en dur dans le code.

---

## Images

`image_url` pointe vers le stockage Supabase, en pleine résolution — souvent
1600 px de large. Ne les affiche pas telles quelles dans une liste : c'est le
principal risque de lenteur et de consommation de données, sur un marché où la
connexion mobile coûte cher.

Redimensionne côté application (ou via ton backend s'il en existe un), et mets
en cache localement.

---

## Ce que je veux avant que tu codes

1. Sur quelle technologie est bâti QorisLive (React Native, Expo, Flutter,
   autre) et le client Supabase est-il déjà installé ?
2. Existe-t-il un backend, ou l'application parle-t-elle directement à Supabase ?
3. Où placer ce module d'accès aux données pour respecter la structure actuelle
   du projet ?

Réponds à ces trois questions **avant** d'écrire du code, puis propose ton plan.
