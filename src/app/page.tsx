import type { Metadata } from "next";
import {
  getActiveAd,
  getArticlesByCategory,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/api";
import {
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
  // Titre complet sur l'accueil (c'est la page que Google affiche pour la marque)
  title: {
    absolute: "Qorisports — Actualité sportive béninoise et africaine",
  },
  description:
    "Qorisports : toute l'actualite sportive beninoise et africaine en direct.",
  // Canonical explicite : sans cela Next genere "/index" sur la racine.
  alternates: {
    canonical: "https://www.qorisports.com/",
  },
};

// 30 min : le dashboard declenche deja une revalidation immediate a chaque
// publication (/api/revalidate), inutile de regenerer toutes les minutes.
export const revalidate = 1800;

// Categories mises en avant sur l'accueil, par ordre d'affichage.
const HOME_CATEGORY_SLUGS = [
  "football",
  "basketball",
  "handball",
  "volleyball",
  "athletisme",
  "autres",
];

export default async function Home() {
  const [featured, latest, ad, adBottom] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(20),
    getActiveAd("sidebar"),
    getActiveAd("home_bottom"),
  ]);

  const trending = latest.slice(0, 5);

  const homeSections = await Promise.all(
    HOME_CATEGORY_SLUGS.map((slug) => getArticlesByCategory(slug, 1, 4)),
  );

  const [standings, upcomingMatches, recentResults] = await Promise.all([
    getStandings(),
    getUpcomingFixtures(),
    getRecentResults(),
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
              standings={standings}
              upcomingMatches={upcomingMatches}
              recentResults={recentResults}
              ad={ad}
              adBottom={adBottom}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
