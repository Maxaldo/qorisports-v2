import { fetchAPI, transformPost, transformCategory } from "./wordpress";
import type { Article, Category } from "./types";

const REVALIDATE: RequestInit = {
  next: { revalidate: 60 },
} as RequestInit;

// Recupere les articles pagines
export async function getArticles(
  page: number = 1,
  perPage: number = 12,
): Promise<{ articles: Article[]; totalPages: number }> {
  try {
    const res = await fetchAPI(
      "/posts",
      { _embed: "true", per_page: String(perPage), page: String(page) },
      REVALIDATE,
    );
    const totalPages = parseInt(
      res.headers.get("X-WP-TotalPages") || "1",
      10,
    );
    const data = await res.json();
    return { articles: data.map(transformPost), totalPages };
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
    const res = await fetchAPI(
      "/posts",
      { _embed: "true", slug },
      REVALIDATE,
    );
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return transformPost(data[0]);
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
    const catRes = await fetchAPI(
      "/categories",
      { slug: categorySlug },
      REVALIDATE,
    );
    const catData = await catRes.json();
    if (!catData || catData.length === 0) {
      return { articles: [], totalPages: 0, category: null };
    }

    const wpCategory = catData[0];
    const category = transformCategory(wpCategory);

    const res = await fetchAPI(
      "/posts",
      {
        _embed: "true",
        categories: String(wpCategory.id),
        per_page: String(perPage),
        page: String(page),
      },
      REVALIDATE,
    );
    const totalPages = parseInt(
      res.headers.get("X-WP-TotalPages") || "1",
      10,
    );
    const data = await res.json();
    return { articles: data.map(transformPost), totalPages, category };
  } catch (error) {
    console.error("Erreur getArticlesByCategory :", error);
    return { articles: [], totalPages: 0, category: null };
  }
}

// Recupere les articles de la categorie "A LA UNE"
export async function getFeaturedArticles(
  count: number = 5,
): Promise<Article[]> {
  try {
    const catRes = await fetchAPI(
      "/categories",
      { slug: "a-la-une" },
      REVALIDATE,
    );
    const catData = await catRes.json();

    if (!catData || catData.length === 0) {
      const { articles } = await getArticles(1, count);
      return articles;
    }

    const res = await fetchAPI(
      "/posts",
      {
        _embed: "true",
        categories: String(catData[0].id),
        per_page: String(count),
      },
      REVALIDATE,
    );
    const data = await res.json();
    return data.map(transformPost);
  } catch (error) {
    console.error("Erreur getFeaturedArticles :", error);
    return [];
  }
}

// Recupere les categories avec au moins un article, sans "Uncategorized" / "Non classe"
const EXCLUDED_CATEGORY_SLUGS = ["uncategorized", "non-classe"];

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchAPI(
      "/categories",
      { per_page: "50", orderby: "count", order: "desc" },
      REVALIDATE,
    );
    const data = await res.json();
    return data
      .filter(
        (cat: any) =>
          cat.count > 0 && !EXCLUDED_CATEGORY_SLUGS.includes(cat.slug),
      )
      .map(transformCategory);
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
    const res = await fetchAPI(
      "/posts",
      { _embed: "true", per_page: String(count) },
      REVALIDATE,
    );
    const data = await res.json();
    return data.map(transformPost);
  } catch (error) {
    console.error("Erreur getLatestArticles :", error);
    return [];
  }
}

// Recupere les articles par tag
export async function getArticlesByTag(
  tagSlug: string,
  page: number = 1,
): Promise<{ articles: Article[]; totalPages: number }> {
  try {
    const tagRes = await fetchAPI(
      "/tags",
      { slug: tagSlug },
      REVALIDATE,
    );
    const tagData = await tagRes.json();
    if (!tagData || tagData.length === 0) {
      return { articles: [], totalPages: 0 };
    }

    const res = await fetchAPI(
      "/posts",
      {
        _embed: "true",
        tags: String(tagData[0].id),
        per_page: "12",
        page: String(page),
      },
      REVALIDATE,
    );
    const totalPages = parseInt(
      res.headers.get("X-WP-TotalPages") || "1",
      10,
    );
    const data = await res.json();
    return { articles: data.map(transformPost), totalPages };
  } catch (error) {
    console.error("Erreur getArticlesByTag :", error);
    return { articles: [], totalPages: 0 };
  }
}

// Recherche d'articles par mot-cle
export async function searchArticles(
  query: string,
): Promise<Article[]> {
  try {
    if (!query.trim()) return [];
    const res = await fetchAPI(
      "/posts",
      { _embed: "true", search: query, per_page: "10" },
      REVALIDATE,
    );
    const data = await res.json();
    return data.map(transformPost);
  } catch (error) {
    console.error("Erreur searchArticles :", error);
    return [];
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
