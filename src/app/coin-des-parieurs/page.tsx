import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getArticlesByCategory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Coin des Parieurs",
  description:
    "Analyses, pronostics et conseils pour parier malin sur le sport beninois et africain.",
};

export const revalidate = 60;

// Donnees mock des pronostics du jour.
const pronostics = [
  {
    id: 1,
    league: "Ligue 1 Benin",
    match: "Dadje FC vs Coton FC",
    prediction: "Victoire Dadje FC",
    odds: "1.85",
    analysis:
      "Dadje FC reste sur une serie de 5 victoires a domicile. Coton FC a perdu ses 2 derniers deplacements.",
  },
  {
    id: 2,
    league: "CAN 2025",
    match: "Benin vs Cameroun",
    prediction: "Plus de 2.5 buts",
    odds: "2.10",
    analysis:
      "Les deux equipes ont inscrit au moins 2 buts lors de leurs 3 derniers matchs respectifs.",
  },
  {
    id: 3,
    league: "Premier League",
    match: "Arsenal vs Chelsea",
    prediction: "Match nul",
    odds: "3.40",
    analysis:
      "Les 4 derniers duels directs se sont soldes par des scores serres. Chelsea reste solide en deplacement.",
  },
];

export default async function CoinDesParieursPage() {
  const { articles } = await getArticlesByCategory("coin-des-parieurs");

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-[#CA8A04] to-[#EAB308] px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          Coin des Parieurs
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Analyses, pronostics et conseils pour parier malin
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10">
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Pronostics du jour
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pronostics.map((p) => (
              <div
                key={p.id}
                className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
                  {p.league}
                </span>

                <h3 className="mt-2 text-lg font-bold text-text-primary dark:text-gray-100">
                  {p.match}
                </h3>

                <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {p.prediction}
                </span>

                <p className="mt-3 text-3xl font-extrabold text-[#CA8A04]">
                  {p.odds}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-gray-400">
                  {p.analysis}
                </p>
              </div>
            ))}
          </div>
        </section>

        {articles.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
              Articles
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="large"
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-text-secondary dark:text-gray-400">
            Les paris sportifs comportent des risques. Jouez de maniere
            responsable. Interdits aux mineurs.
          </p>
        </div>
      </div>
    </div>
  );
}
