"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Article } from "@/lib/types";

const PER_PAGE = 6;

interface CategoryArticlesGridProps {
  articles: Article[];
}

// Grille d'articles paginee pour la page categorie.
export function CategoryArticlesGrid({ articles }: CategoryArticlesGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const paged = articles.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paged.map((article) => (
          <ArticleCard key={article.id} article={article} variant="large" />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}
