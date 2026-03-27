import type { Metadata } from "next";
import {
  getArticlesByCategory,
  getCategories,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/api";
import { CategorySection } from "@/components/home/CategorySection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestNews } from "@/components/home/LatestNews";
import { Sidebar } from "@/components/home/Sidebar";
import { TrendingBar } from "@/components/home/TrendingBar";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Qorisports : toute l'actualite sportive beninoise et africaine en direct.",
};

export const revalidate = 60;

export default async function Home() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(20),
    getCategories(),
  ]);

  const trending = latest.slice(0, 5);

  const [footballResult, basketballResult] = await Promise.all([
    getArticlesByCategory("football"),
    getArticlesByCategory("basketball"),
  ]);

  const footballCat = categories.find((c) => c.slug === "football");
  const basketballCat = categories.find((c) => c.slug === "basketball");

  return (
    <div className="bg-surface dark:bg-gray-950">
      {featured.length > 0 && <HeroSlider articles={featured} />}
      {trending.length > 0 && <TrendingBar articles={trending} />}

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <LatestNews articles={latest} />

            {footballCat && footballResult.articles.length > 0 && (
              <CategorySection
                categoryName={footballCat.name}
                categoryColor={footballCat.color}
                articles={footballResult.articles}
              />
            )}

            {basketballCat && basketballResult.articles.length > 0 && (
              <CategorySection
                categoryName={basketballCat.name}
                categoryColor={basketballCat.color}
                articles={basketballResult.articles}
              />
            )}
          </div>

          <aside className="lg:col-span-4">
            <Sidebar articles={latest} categories={categories} />
          </aside>
        </div>
      </div>
    </div>
  );
}
