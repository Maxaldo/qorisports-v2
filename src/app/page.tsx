import { categories } from "@/data/mock-articles";
import {
  getArticles,
  getArticlesByCategory,
  getFeaturedArticles,
} from "@/lib/api";
import { CategorySection } from "@/components/home/CategorySection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestNews } from "@/components/home/LatestNews";
import { Sidebar } from "@/components/home/Sidebar";
import { TrendingBar } from "@/components/home/TrendingBar";

export default function Home() {
  const featured = getFeaturedArticles();
  const latest = getArticles();
  const trending = latest.slice(0, 5);

  const footballCat = categories.find((c) => c.slug === "football")!;
  const basketballCat = categories.find((c) => c.slug === "basketball")!;
  const footballArticles = getArticlesByCategory("football");
  const basketballArticles = getArticlesByCategory("basketball");

  return (
    <div className="bg-surface">
      <HeroSlider articles={featured} />
      <TrendingBar articles={trending} />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <LatestNews articles={latest} />

            <CategorySection
              categoryName={footballCat.name}
              categoryColor={footballCat.color}
              articles={footballArticles}
            />

            <CategorySection
              categoryName={basketballCat.name}
              categoryColor={basketballCat.color}
              articles={basketballArticles}
            />
          </div>

          <aside className="lg:col-span-4">
            <Sidebar articles={latest} categories={categories} />
          </aside>
        </div>
      </div>
    </div>
  );
}
