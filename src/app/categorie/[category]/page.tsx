import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory, getCategories } from "@/lib/api";
import { CategoryArticlesGrid } from "@/components/articles/CategoryArticlesGrid";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const { category } = await getArticlesByCategory(slug, 1, 1);
  if (!category) return { title: "Categorie non trouvee" };
  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const { articles, category } = await getArticlesByCategory(slug);
  if (!category) notFound();

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <div
        className="border-b border-gray-200 dark:border-gray-800"
        style={{ backgroundColor: `${category.color}0d` }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <span
            className="mb-3 inline-block h-1.5 w-12 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="text-3xl font-display font-bold text-text-primary md:text-4xl dark:text-gray-100">
            {category.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary dark:text-gray-400">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10">
        {articles.length > 0 ? (
          <CategoryArticlesGrid articles={articles} />
        ) : (
          <p className="py-20 text-center text-text-secondary dark:text-gray-400">
            Aucun article dans cette categorie pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
