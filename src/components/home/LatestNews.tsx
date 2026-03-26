"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatDate } from "@/lib/api";
import type { Article } from "@/lib/types";

interface LatestNewsProps {
  articles: Article[];
}

// Article principal en grand format.
function MainArticle({ article }: { article: Article }) {
  return (
    <article>
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className="absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-bold uppercase text-white"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </span>
        </div>
      </Link>

      <Link href={`/article/${article.slug}`}>
        <h3 className="mt-4 text-xl font-display font-bold leading-tight text-text-primary transition-colors hover:text-accent md:text-2xl">
          {article.title}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-text-secondary line-clamp-2">
        {article.excerpt}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
        <span className="font-medium">{article.author.name}</span>
        <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
        <span>{formatDate(article.publishedAt)}</span>
      </div>
    </article>
  );
}

// Article compact avec image carree.
function CompactArticle({ article }: { article: Article }) {
  return (
    <article className="flex gap-4">
      <Link
        href={`/article/${article.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-col justify-center">
        <span
          className="mb-1 text-[10px] font-bold uppercase"
          style={{ color: article.category.color }}
        >
          {article.category.name}
        </span>
        <Link href={`/article/${article.slug}`}>
          <h4 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 transition-colors hover:text-accent">
            {article.title}
          </h4>
        </Link>
        <span className="mt-1 text-xs text-text-secondary">
          {formatDate(article.publishedAt)}
        </span>
      </div>
    </article>
  );
}

export function LatestNews({ articles }: LatestNewsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 5);

  if (!mainArticle) return null;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-7 w-1 rounded-full bg-accent" />
        <h2 className="text-xl font-display font-bold text-text-primary md:text-2xl">
          Dernieres Actualites
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MainArticle article={mainArticle} />
        </div>

        <div className="flex flex-col gap-5">
          {secondaryArticles.map((article) => (
            <CompactArticle key={article.id} article={article} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
