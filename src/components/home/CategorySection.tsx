"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatDate } from "@/lib/api";
import type { Article } from "@/lib/types";

interface CategorySectionProps {
  categoryName: string;
  categoryColor: string;
  articles: Article[];
}

export function CategorySection({
  categoryName,
  categoryColor,
  articles,
}: CategorySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const categorySlug = mainArticle.category.slug;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="border-b border-gray-200 pb-10 dark:border-gray-800"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-7 w-1 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <h2 className="text-xl font-display font-bold text-text-primary md:text-2xl dark:text-gray-100">
            {categoryName}
          </h2>
        </div>

        <Link
          href={`/categorie/${categorySlug}`}
          className="text-sm font-medium transition-colors hover:text-accent"
          style={{ color: categoryColor }}
        >
          Voir tout &gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="group">
          <Link href={`/article/${mainArticle.slug}`} className="block">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={mainArticle.coverImage}
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          <Link href={`/article/${mainArticle.slug}`}>
            <h3 className="mt-3 text-lg font-display font-bold leading-tight text-text-primary transition-colors hover:text-accent dark:text-gray-100">
              {mainArticle.title}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-text-secondary line-clamp-2 dark:text-gray-400">
            {mainArticle.excerpt}
          </p>
        </article>

        {secondaryArticles.length > 0 && (
          <div className="flex flex-col gap-5">
            {secondaryArticles.map((article) => (
              <article key={article.id} className="flex gap-4">
                <Link
                  href={`/article/${article.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-col justify-center">
                  <Link href={`/article/${article.slug}`}>
                    <h4 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 transition-colors hover:text-accent dark:text-gray-100">
                      {article.title}
                    </h4>
                  </Link>
                  <span className="mt-1 text-xs text-text-secondary dark:text-gray-400">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
