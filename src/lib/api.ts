import { mockArticles } from "@/data/mock-articles";
import type { Article } from "@/lib/types";

// Trie les articles du plus recent au plus ancien.
export function getArticles(): Article[] {
  return [...mockArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

// Retourne uniquement les articles mis en avant.
export function getFeaturedArticles(): Article[] {
  return getArticles().filter((a) => a.featured);
}

// Retourne les articles d'une categorie donnee, tries par date.
export function getArticlesByCategory(slug: string): Article[] {
  return getArticles().filter((a) => a.category.slug === slug);
}

// Retourne un article unique selon son slug.
export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((article) => article.slug === slug);
}

// Formate une date ISO en francais lisible (ex: "22 mars 2026").
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Formate un nombre de vues (ex: 1200 -> "1.2k", 847 -> "847").
export function formatViews(views: number): string {
  if (views >= 1000) {
    const k = views / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(views);
}
