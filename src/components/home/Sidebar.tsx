"use client";

import { motion, useInView } from "framer-motion";
import { Eye, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { formatViews } from "@/lib/api";
import { standings } from "@/data/mock-standings";
import { StandingsTable } from "@/components/standings/StandingsTable";
import type { Article, Category } from "@/lib/types";

interface SidebarProps {
  articles: Article[];
  categories: Category[];
}

// Sidebar avec apparition progressive de chaque widget au scroll.
export function Sidebar({ articles, categories }: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Trie les articles par nombre de vues decroissant.
  const popular = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 5),
    [articles],
  );

  return (
    <div ref={ref} className="sticky top-24 space-y-6">
      {/* Widget classement Ligue 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0 }}
        className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900"
      >
        <h3 className="flex items-center gap-2 rounded-t bg-surface px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
          <Trophy className="h-4 w-4 text-amber-500" />
          Classement Ligue 1
        </h3>

        <StandingsTable standings={standings} compact />

        <div className="px-4 py-3">
          <Link
            href="/classement"
            className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Voir le classement complet &gt;
          </Link>
        </div>
      </motion.div>

      {/* Widget articles populaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900"
      >
        <h3 className="mb-4 rounded bg-surface px-3 py-2 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
          Articles populaires
        </h3>

        <div className="space-y-4">
          {popular.map((article, i) => (
            <div key={article.id} className="flex items-start gap-3">
              <span className="shrink-0 text-2xl font-bold leading-none text-gray-200 dark:text-gray-700">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <Link href={`/article/${article.slug}`}>
                  <h4 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 transition-colors hover:text-accent dark:text-gray-100">
                    {article.title}
                  </h4>
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-secondary dark:text-gray-500">
                    <Eye className="h-3 w-3" />
                    {formatViews(article.views)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Widget categories (max 8, triees par nombre d'articles) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900"
      >
        <h3 className="mb-3 rounded bg-surface px-3 py-2 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
          Categories
        </h3>

        <ul className="space-y-1">
          {categories.slice(0, 8).map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categorie/${cat.slug}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-primary transition-colors hover:bg-surface hover:text-accent dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="line-clamp-1">{cat.name}</span>
                </span>
                {(cat.count ?? 0) > 0 && (
                  <span className="ml-2 shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {cat.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Widget publicite (placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-surface dark:border-gray-700 dark:bg-gray-900"
      >
        <span className="text-sm font-medium uppercase tracking-wider text-text-secondary dark:text-gray-400">
          Publicite
        </span>
      </motion.div>
    </div>
  );
}
