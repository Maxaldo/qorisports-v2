import type { MetadataRoute } from "next";
import { getArticles, getCategories } from "@/lib/api";

const BASE_URL = "https://www.qorisports.com";

// Regenere au plus une fois par jour : Google explore le sitemap tres souvent,
// sans cela chaque passage declenche une ecriture ISR.
export const revalidate = 86400;

// Sitemap XML genere dynamiquement depuis Supabase.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ articles }, categories] = await Promise.all([
    getArticles(1, 1000),
    getCategories(),
  ]);

  const articleEntries = articles.map((article) => ({
    url: `${BASE_URL}/article/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryEntries = categories.map((cat) => ({
    url: `${BASE_URL}/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
