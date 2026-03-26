"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { Article, Category } from "@/lib/types";

interface SidebarProps {
  articles: Article[];
  categories: Category[];
}

function countByCategory(articles: Article[], slug: string): number {
  return articles.filter((a) => a.category.slug === slug).length;
}

// Sidebar avec apparition progressive de chaque widget au scroll.
export function Sidebar({ articles, categories }: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const popular = articles.slice(0, 5);

  return (
    <div ref={ref} className="sticky top-24 space-y-6">
      {/* Widget articles populaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0 }}
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
      </motion.div>

      {/* Widget categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900"
      >
        <h3 className="mb-4 rounded bg-surface px-3 py-2 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
          Categories
        </h3>

        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categorie/${cat.slug}`}
                className="flex items-center justify-between text-sm text-text-primary transition-colors hover:text-accent dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary dark:bg-gray-800 dark:text-gray-400">
                  {countByCategory(articles, cat.slug)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Widget publicite (placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-surface dark:border-gray-700 dark:bg-gray-900"
      >
        <span className="text-sm font-medium uppercase tracking-wider text-text-secondary dark:text-gray-400">
          Publicite
        </span>
      </motion.div>
    </div>
  );
}
