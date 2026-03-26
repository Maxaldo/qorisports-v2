"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/api";
import type { Article } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface ArticleCardProps {
  article: Article;
  variant?: "large" | "compact" | "horizontal";
  index?: number;
}

// Carte d'article avec animation d'entree au scroll.
export function ArticleCard({ article, variant = "large", index = 0 }: ArticleCardProps) {
  const card =
    variant === "compact" ? (
      <CompactCard article={article} />
    ) : variant === "horizontal" ? (
      <HorizontalCard article={article} />
    ) : (
      <LargeCard article={article} />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {card}
    </motion.div>
  );
}

function LargeCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-900"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge label={article.category.name} color={article.category.color} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-display font-bold leading-tight text-text-primary transition-colors group-hover:text-accent dark:text-gray-100">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2 dark:text-gray-400">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary dark:text-gray-400">
          <span className="font-medium">{article.author.name}</span>
          <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function CompactCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={article.coverImage}
          alt={article.title}
          width={80}
          height={80}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center">
        <h4 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 transition-colors group-hover:text-accent dark:text-gray-100">
          {article.title}
        </h4>
        <span className="mt-1 text-xs text-text-secondary dark:text-gray-400">
          {formatDate(article.publishedAt)}
        </span>
      </div>
    </Link>
  );
}

function HorizontalCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-900"
    >
      <div className="relative w-1/3 shrink-0 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex w-2/3 flex-col justify-center p-4">
        <Badge label={article.category.name} color={article.category.color} />
        <h3 className="mt-2 text-base font-display font-bold leading-tight text-text-primary transition-colors group-hover:text-accent md:text-lg dark:text-gray-100">
          {article.title}
        </h3>
        <p className="mt-1.5 text-sm text-text-secondary line-clamp-2 dark:text-gray-400">
          {article.excerpt}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary dark:text-gray-400">
          <span className="font-medium">{article.author.name}</span>
          <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
