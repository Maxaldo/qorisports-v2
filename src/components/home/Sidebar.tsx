import Link from "next/link";
import type { Article, Category } from "@/lib/types";

interface SidebarProps {
  articles: Article[];
  categories: Category[];
}

// Compte le nombre d'articles par categorie.
function countByCategory(articles: Article[], slug: string): number {
  return articles.filter((a) => a.category.slug === slug).length;
}

export function Sidebar({ articles, categories }: SidebarProps) {
  const popular = articles.slice(0, 5);

  return (
    <div className="sticky top-24 space-y-6">
      {/* Widget articles populaires */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-4 rounded bg-surface px-3 py-2 text-sm font-display font-bold uppercase tracking-wide text-text-primary">
          Articles populaires
        </h3>

        <div className="space-y-4">
          {popular.map((article, i) => (
            <div key={article.id} className="flex items-start gap-3">
              <span className="shrink-0 text-2xl font-bold leading-none text-gray-200">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <Link href={`/article/${article.slug}`}>
                  <h4 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 transition-colors hover:text-accent">
                    {article.title}
                  </h4>
                </Link>
                <span
                  className="mt-1 inline-block text-[10px] font-bold uppercase"
                  style={{ color: article.category.color }}
                >
                  {article.category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget categories */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-4 rounded bg-surface px-3 py-2 text-sm font-display font-bold uppercase tracking-wide text-text-primary">
          Categories
        </h3>

        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categorie/${cat.slug}`}
                className="flex items-center justify-between text-sm text-text-primary transition-colors hover:text-accent"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                  {countByCategory(articles, cat.slug)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Widget publicite (placeholder) */}
      <div className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-surface">
        <span className="text-sm font-medium uppercase tracking-wider text-text-secondary">
          Publicite
        </span>
      </div>
    </div>
  );
}
