import { supabase } from "./supabase";
import type { Article, Author, Category } from "./types";

// ---------------------------------------------------------------------------
// Couche de donnees : lit Supabase (remplace l'ancienne API WordPress).
// Les signatures des fonctions sont identiques a l'ancienne version pour ne
// rien changer dans les pages/composants.
// ---------------------------------------------------------------------------

// Etiquettes transversales (pas de vraies categories de sport).
// Sert a les exclure de la navigation.
export const NON_SPORT_SLUGS = new Set([
  "a-la-une",
  "actualites",
  "non-classe",
  "uncategorized",
]);

const PLACEHOLDER_IMAGE = "https://picsum.photos/800/450";
const PLACEHOLDER_AVATAR = "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g";
const DEFAULT_COLOR = "#6B7280";

// --- Types bruts renvoyes par Supabase ---
interface DbCategory {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
}

interface DbProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string | null;
}

interface DbArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  featured: boolean;
  tags: string[] | null;
  views: number;
  published_at: string | null;
  created_at: string;
  category: DbCategory | null;
  author: DbProfile | null;
}

// Selection commune : article + categorie + auteur joints
const ARTICLE_SELECT =
  "id, title, slug, excerpt, content, cover_image_url, featured, tags, views, published_at, created_at, category:categories(*), author:profiles(*)";

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, "").trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

function transformCategory(cat: DbCategory | null): Category {
  return {
    id: cat?.id ?? "0",
    name: cat?.name ?? "Non classe",
    slug: cat?.slug ?? "non-classe",
    color: cat?.color || DEFAULT_COLOR,
    description: cat?.description ?? "",
  };
}

function transformArticle(row: DbArticle): Article {
  const author: Author = {
    id: row.author?.id ?? "0",
    name: row.author?.name ?? "Redaction",
    avatar: row.author?.avatar_url || PLACEHOLDER_AVATAR,
    role: "Auteur",
  };

  const content = row.content ?? "";

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content,
    coverImage: row.cover_image_url || PLACEHOLDER_IMAGE,
    category: transformCategory(row.category),
    author,
    publishedAt: row.published_at ?? row.created_at,
    readingTime: Math.max(1, Math.round(countWords(content) / 200)),
    views: row.views ?? 0,
    featured: row.featured ?? false,
    tags: row.tags ?? [],
  };
}

// Recupere les articles pagines (les plus recents d'abord)
export async function getArticles(
  page: number = 1,
  perPage: number = 12,
): Promise<{ articles: Article[]; totalPages: number }> {
  try {
    const from = (page - 1) * perPage;
    const { data, count, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT, { count: "exact" })
      .order("published_at", { ascending: false })
      .range(from, from + perPage - 1);
    if (error) throw error;
    return {
      articles: (data as unknown as DbArticle[]).map(transformArticle),
      totalPages: Math.ceil((count ?? 0) / perPage),
    };
  } catch (error) {
    console.error("Erreur getArticles :", error);
    return { articles: [], totalPages: 0 };
  }
}

// Recupere un article par son slug, null si introuvable
export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return transformArticle(data as unknown as DbArticle);
  } catch (error) {
    console.error("Erreur getArticleBySlug :", error);
    return null;
  }
}

// Recupere les articles d'une categorie via son slug
export async function getArticlesByCategory(
  categorySlug: string,
  page: number = 1,
  perPage: number = 12,
): Promise<{
  articles: Article[];
  totalPages: number;
  category: Category | null;
}> {
  try {
    const { data: cat, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (catError) throw catError;
    if (!cat) return { articles: [], totalPages: 0, category: null };

    const from = (page - 1) * perPage;
    const { data, count, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT, { count: "exact" })
      .eq("category_id", cat.id)
      .order("published_at", { ascending: false })
      .range(from, from + perPage - 1);
    if (error) throw error;

    return {
      articles: (data as unknown as DbArticle[]).map(transformArticle),
      totalPages: Math.ceil((count ?? 0) / perPage),
      category: transformCategory(cat as DbCategory),
    };
  } catch (error) {
    console.error("Erreur getArticlesByCategory :", error);
    return { articles: [], totalPages: 0, category: null };
  }
}

// Recupere les articles "A la une" (featured)
export async function getFeaturedArticles(
  count: number = 5,
): Promise<Article[]> {
  try {
    // Ordre manuel (featured_order) si la colonne existe, sinon par date.
    let { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("featured", true)
      .order("featured_order", { ascending: true, nullsFirst: false })
      .order("published_at", { ascending: false })
      .limit(count);
    if (error) {
      ({ data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("featured", true)
        .order("published_at", { ascending: false })
        .limit(count));
    }
    if (error) throw error;
    const articles = (data as unknown as DbArticle[]).map(transformArticle);
    if (articles.length > 0) return articles;
    // Fallback : derniers articles si rien n'est mis a la une
    return getLatestArticles(count);
  } catch (error) {
    console.error("Erreur getFeaturedArticles :", error);
    return [];
  }
}

// Recupere les categories navigables : au moins un article publie, sans les
// etiquettes transversales (Non classe, A la une, Actualites...).
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*, articles(count)");
    if (error) throw error;
    type CatWithCount = DbCategory & { articles: { count: number }[] };
    return (data as unknown as CatWithCount[])
      .map((cat) => ({
        ...transformCategory(cat),
        count: cat.articles?.[0]?.count ?? 0,
      }))
      .filter((cat) => (cat.count ?? 0) > 0 && !NON_SPORT_SLUGS.has(cat.slug))
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  } catch (error) {
    console.error("Erreur getCategories :", error);
    return [];
  }
}

// Recupere les N derniers articles
export async function getLatestArticles(
  count: number = 12,
): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .order("published_at", { ascending: false })
      .limit(count);
    if (error) throw error;
    return (data as unknown as DbArticle[]).map(transformArticle);
  } catch (error) {
    console.error("Erreur getLatestArticles :", error);
    return [];
  }
}

// Recherche simple sur titre + extrait (utilisee par la modale de recherche,
// cote client)
export async function searchArticles(
  query: string,
  limit: number = 10,
): Promise<Article[]> {
  try {
    const q = query.replaceAll(",", " ").trim();
    if (!q) return [];
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as unknown as DbArticle[]).map(transformArticle);
  } catch (error) {
    console.error("Erreur searchArticles :", error);
    return [];
  }
}

// --- Publicites ---
export interface Ad {
  id: string;
  name: string;
  image_url: string;
  link_url: string;
}

// Recupere la banniere active pour un emplacement donne (null si aucune).
// La RLS ne laisse passer que les pubs actives et dans leur periode.
export async function getActiveAd(
  slot: "sidebar" | "article" | "home_bottom" = "sidebar",
): Promise<Ad | null> {
  try {
    const { data, error } = await supabase
      .from("ads")
      .select("id, name, image_url, link_url")
      .eq("slot", slot)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as Ad) ?? null;
  } catch {
    // table absente ou erreur : le site affiche le placeholder
    return null;
  }
}

// Compte un clic sur une pub (RPC anonyme, non bloquant)
export async function incrementAdClicks(adId: string): Promise<void> {
  try {
    await supabase.rpc("increment_ad_clicks", { ad_id: adId });
  } catch {
    // non bloquant
  }
}

// Compte un affichage (impression) d'une pub (RPC anonyme, non bloquant)
export async function incrementAdImpressions(adId: string): Promise<void> {
  try {
    await supabase.rpc("increment_ad_impressions", { ad_id: adId });
  } catch {
    // non bloquant
  }
}

// Incremente le compteur de vues d'un article (RPC anonyme, non bloquant)
export async function incrementViews(slug: string): Promise<void> {
  try {
    await supabase.rpc("increment_views", { article_slug: slug });
  } catch {
    // non bloquant
  }
}

// Formate une date ISO en francais lisible (ex: "22 mars 2026")
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Formate un nombre de vues (ex: 1200 -> "1.2k", 847 -> "847")
export function formatViews(views: number): string {
  if (views >= 1000) {
    const k = views / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(views);
}
