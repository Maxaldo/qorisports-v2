import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/mock-articles";
import { getArticlesByCategory } from "@/lib/api";
import { CategoryArticlesGrid } from "@/components/articles/CategoryArticlesGrid";

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Categorie non trouvee" };
  return {
    title: `${category.name} — Qorisports`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <div className="bg-surface pb-16">
      {/* Header avec fond colore en leger */}
      <div
        className="border-b"
        style={{ backgroundColor: `${category.color}0d` }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <span
            className="mb-3 inline-block h-1.5 w-12 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="text-3xl font-display font-bold text-text-primary md:text-4xl">
            {category.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary">
            {category.description}
          </p>
        </div>
      </div>

      {/* Grille d'articles paginee */}
      <div className="mx-auto max-w-7xl px-4 pt-10">
        {articles.length > 0 ? (
          <CategoryArticlesGrid articles={articles} />
        ) : (
          <p className="py-20 text-center text-text-secondary">
            Aucun article dans cette categorie pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
