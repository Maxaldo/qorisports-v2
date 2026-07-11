import type { Metadata } from "next";
import {
  getActiveAd,
  getArticlesByCategory,
  getCategories,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/api";
import {
  getLastUpdate,
  getRecentResults,
  getStandings,
  getUpcomingFixtures,
} from "@/lib/data";
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

// Categories mises en avant sur l'accueil, par ordre d'affichage.
const HOME_CATEGORY_SLUGS = ["actualites", "can-2025", "football", "autres"];

export default async function Home() {
  const [featured, latest, categories, ad] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(20),
    getCategories(),
    getActiveAd("sidebar"),
  ]);

  const trending = latest.slice(0, 5);

  const homeSections = await Promise.all(
    HOME_CATEGORY_SLUGS.map((slug) => getArticlesByCategory(slug, 1, 4)),
  );

  const [standings, upcomingMatches, recentResults, lastUpdate] =
    await Promise.all([
      getStandings(),
      getUpcomingFixtures(),
      getRecentResults(),
      getLastUpdate(),
    ]);

  return (
    <div className="bg-surface dark:bg-gray-950">
      {featured.length > 0 && <HeroSlider articles={featured} />}
      {trending.length > 0 && <TrendingBar articles={trending} />}

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <LatestNews articles={latest} />

            {homeSections.map((section) =>
              section.category && section.articles.length > 0 ? (
                <CategorySection
                  key={section.category.id}
                  categoryName={section.category.name}
                  categoryColor={section.category.color}
                  categorySlug={section.category.slug}
                  articles={section.articles}
                />
              ) : null,
            )}
          </div>

          <aside className="lg:col-span-4">
            <Sidebar
              articles={latest}
              categories={categories}
              standings={standings}
              upcomingMatches={upcomingMatches}
              recentResults={recentResults}
              lastUpdate={lastUpdate}
              ad={ad}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
