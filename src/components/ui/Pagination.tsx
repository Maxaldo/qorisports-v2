"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ChevronLeft className="h-4 w-4" />
        Precedent
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-accent text-white"
              : "text-text-secondary hover:bg-surface dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Suivant
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
