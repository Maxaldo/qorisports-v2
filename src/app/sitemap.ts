import type { MetadataRoute } from "next";
import { categories } from "@/data/mock-articles";
import { getArticles } from "@/lib/api";

const BASE_URL = "https://qorisports.com";

// Sitemap XML genere automatiquement pour le SEO.
export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries = getArticles().map((article) => ({
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
