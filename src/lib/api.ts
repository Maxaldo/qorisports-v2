import { mockArticles } from "@/data/mock-articles";
import type { Article } from "@/lib/types";

// Trie les articles du plus recent au plus ancien.
export function getArticles(): Article[] {
  return [...mockArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

// Retourne un article unique selon son slug.
export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((article) => article.slug === slug);
}
