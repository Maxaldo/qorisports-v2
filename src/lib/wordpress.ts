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
};

const DEFAULT_COLOR = "#6B7280";
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
    "&#8217;": "\u2019",
    "&#8216;": "\u2018",
    "&#8220;": "\u201C",
    "&#8221;": "\u201D",
    "&#8211;": "\u2013",
    "&#8212;": "\u2014",
    "&nbsp;": " ",
    "&#8230;": "\u2026",
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

  const res = await fetch(url.toString(), fetchOptions);
  if (!res.ok) {
    throw new Error(
      `Erreur API WordPress : ${res.status} ${res.statusText}`,
    );
  }

  return res;
}

// Transforme un post WordPress brut en Article
export function transformPost(wpPost: any): Article {
  const wpCategory = wpPost._embedded?.["wp:term"]?.[0]?.[0];
  const wpAuthor = wpPost._embedded?.author?.[0];
  const wpTags: any[] = wpPost._embedded?.["wp:term"]?.[1] || [];
  const allTerms: any[] = wpPost._embedded?.["wp:term"]?.[0] || [];

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
    (term: any) => term.name === "A LA UNE" || term.slug === "a-la-une",
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
    views: 0,
    featured: isFeatured,
    tags: wpTags.map((tag: any) => tag.name),
  };
}

// Transforme une categorie WordPress brute en Category
export function transformCategory(wpCat: any): Category {
  return {
    id: wpCat.id.toString(),
    name: wpCat.name || "",
    slug: wpCat.slug || "",
    color: getCategoryColor(wpCat.name || ""),
    description: wpCat.description || "",
    count: wpCat.count ?? 0,
  };
}
