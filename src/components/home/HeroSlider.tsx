"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/api";
import type { Article } from "@/lib/types";

interface HeroSliderProps {
  articles: Article[];
}

export function HeroSlider({ articles }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  // Defilement automatique toutes les 5 secondes.
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const article = articles[current];
  if (!article) return null;

  return (
    <section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={article.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="mx-auto w-full max-w-7xl">
              <span
                className="mb-4 inline-block rounded px-3 py-1 text-xs font-bold uppercase text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>

              <Link href={`/article/${article.slug}`}>
                <h2 className="text-2xl font-display font-bold leading-tight text-white md:text-4xl lg:text-5xl max-w-3xl">
                  {article.title}
                </h2>
              </Link>

              <p className="mt-3 max-w-2xl text-sm text-white/80 line-clamp-2 md:text-base">
                {article.excerpt}
              </p>

              <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                <span>{article.author.name}</span>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Slide precedent"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="Slide suivant"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {articles.map((_, i) => (
          <button
            type="button"
            key={articles[i].id}
            onClick={() => setCurrent(i)}
            aria-label={`Aller au slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
