import type { Article, Author, Category } from "./types";

const WORDPRESS_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://qorisports.com"}/wp-json/wp/v2`;

const CATEGORY_COLORS: Record<string, string> = {
  Football: "#16A34A",
  Basketball: "#EA580C",
  Handball: "#2563EB",
  "Athlétisme": "#DC2626",
  Athletisme: "#DC2626",
  Autres: "#7C3AED",
  "Coin des Parieurs": "#CA8A04",
  "A LA UNE": "#3B82F6",
  "Actualités": "#0EA5E9",
  Actualites: "#0EA5E9",
  "CAN 2025": "#16A34A",
  "CNOS BEN": "#7C3AED",
  Boxe: "#B91C1C",
  Cyclisme: "#0D9488",
};

const DEFAULT_COLOR = "#6B7280";

// --- Types bruts (sous-ensemble des champs WordPress utilises ici) ---
interface WpRendered {
  rendered?: string;
}
interface WpTerm {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
}
interface WpAuthor {
  id?: number;
  name?: string;
  avatar_urls?: Record<string, string>;
}
interface WpMedia {
  source_url?: string;
}
interface WpPost {
  id: number;
  date: string;
  slug: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  meta?: { post_views_count?: unknown; views?: unknown };
  "post-views-counter"?: unknown;
  post_views?: unknown;
  views?: unknown;
  _embedded?: {
    author?: WpAuthor[];
    "wp:term"?: WpTerm[][];
    "wp:featuredmedia"?: WpMedia[];
  };
}
interface WpCategory {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  count?: number;
}

// Etiquettes transversales (pas de vraies categories de sport).
// Sert a choisir le bon badge et a les exclure de la navigation.
export const NON_SPORT_SLUGS = new Set([
  "a-la-une",
  "actualites",
  "non-classe",
  "uncategorized",
]);

// Choisit la categorie a afficher : on privilegie une vraie discipline
// sportive plutot qu'une etiquette transversale (A la une, Actualites...).
function pickPrimaryCategory(terms: WpTerm[]): WpTerm | undefined {
  if (!terms || terms.length === 0) return undefined;
  return terms.find((t) => t.slug && !NON_SPORT_SLUGS.has(t.slug)) ?? terms[0];
}

// Lit le nombre de vues si une extension WordPress l'expose dans l'API REST
// (ex: plugin "Post Views Counter" avec l'option REST activee). Couvre les
// emplacements les plus courants ; renvoie 0 si aucune donnee n'est disponible.
function extractViews(wpPost: WpPost): number {
  const raw =
    wpPost["post-views-counter"] ??
    wpPost.post_views ??
    wpPost.views ??
    wpPost.meta?.post_views_count ??
    wpPost.meta?.views ??
    0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

const PLACEHOLDER_IMAGE = "https://picsum.photos/800/450";
const PLACEHOLDER_AVATAR =
  "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g";

// Nettoie les entites HTML et supprime les balises
export function decodeHtml(html: string): string {
  let text = html.replace(/<[^>]*>/g, "");
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#8217;": "’",
    "&#8216;": "‘",
    "&#8220;": "“",
    "&#8221;": "”",
    "&#8211;": "–",
    "&#8212;": "—",
    "&nbsp;": " ",
    "&#8230;": "…",
  };
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replaceAll(entity, char);
  }
  return text.trim();
}

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] || DEFAULT_COLOR;
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, "").trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

// Effectue un appel GET vers l'API REST WordPress
export async function fetchAPI(
  endpoint: string,
  params?: Record<string, string>,
  fetchOptions?: RequestInit,
): Promise<Response> {
  const url = new URL(`${WORDPRESS_API_URL}${endpoint}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  // On envoie un User-Agent de navigateur + en-tetes classiques : certains
  // hebergeurs WordPress (pare-feu/securite) bloquent les requetes serveur
  // sans User-Agent (ex: depuis Vercel), ce qui faisait echouer les appels.
  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "application/json",
      ...(fetchOptions?.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    throw new Error(
      `Erreur API WordPress : ${res.status} ${res.statusText}`,
    );
  }

  return res;
}

// Transforme un post WordPress brut en Article
export function transformPost(wpPost: WpPost): Article {
  const wpAuthor = wpPost._embedded?.author?.[0];
  const wpTags: WpTerm[] = wpPost._embedded?.["wp:term"]?.[1] || [];
  const allTerms: WpTerm[] = wpPost._embedded?.["wp:term"]?.[0] || [];
  const wpCategory = pickPrimaryCategory(allTerms);

  const category: Category = {
    id: wpCategory?.id?.toString() || "0",
    name: wpCategory?.name || "Non classe",
    slug: wpCategory?.slug || "non-classe",
    color: getCategoryColor(wpCategory?.name || ""),
    description: wpCategory?.description || "",
  };

  const author: Author = {
    id: wpAuthor?.id?.toString() || "0",
    name: wpAuthor?.name || "Redaction",
    avatar: wpAuthor?.avatar_urls?.["96"] || PLACEHOLDER_AVATAR,
    role: "Auteur",
  };

  const content: string = wpPost.content?.rendered || "";
  const readingTime = Math.max(1, Math.round(countWords(content) / 200));

  const isFeatured = allTerms.some(
    (term) => term.name === "A LA UNE" || term.slug === "a-la-une",
  );

  return {
    id: wpPost.id.toString(),
    title: decodeHtml(wpPost.title?.rendered || ""),
    slug: wpPost.slug,
    excerpt: decodeHtml(wpPost.excerpt?.rendered || ""),
    content,
    coverImage:
      wpPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      PLACEHOLDER_IMAGE,
    category,
    author,
    publishedAt: wpPost.date,
    readingTime,
    views: extractViews(wpPost),
    featured: isFeatured,
    tags: wpTags.map((tag) => tag.name ?? "").filter(Boolean),
  };
}

// Transforme une categorie WordPress brute en Category
export function transformCategory(wpCat: WpCategory): Category {
  return {
    id: wpCat.id.toString(),
    name: wpCat.name || "",
    slug: wpCat.slug || "",
    color: getCategoryColor(wpCat.name || ""),
    description: wpCat.description || "",
    count: wpCat.count ?? 0,
  };
}
