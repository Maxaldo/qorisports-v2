"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/api";
import { fetchAPI, transformPost } from "@/lib/wordpress";
import { Badge } from "@/components/ui/Badge";
import type { Article } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal de recherche plein ecran avec appel API WordPress et debounce 300ms.
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetchAPI("/posts", {
          _embed: "true",
          search: query,
          per_page: "10",
        });
        const data = await res.json();
        setResults(data.map(transformPost));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-20 w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article..."
                autoFocus
                className="w-full rounded-xl bg-white py-4 pl-12 pr-12 text-lg text-text-primary shadow-xl outline-none placeholder:text-text-secondary dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary dark:text-gray-400 dark:hover:text-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {query.trim() && (
              <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900">
                {loading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                ) : results.length > 0 ? (
                  <ul>
                    {results.map((article) => (
                      <li
                        key={article.id}
                        className="border-b border-gray-100 last:border-b-0 dark:border-gray-800"
                      >
                        <Link
                          href={`/article/${article.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-4 transition-colors hover:bg-surface dark:hover:bg-gray-800"
                        >
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            width={64}
                            height={64}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-text-primary line-clamp-1 dark:text-gray-100">
                              {article.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                label={article.category.name}
                                color={article.category.color}
                              />
                              <span className="text-xs text-text-secondary dark:text-gray-400">
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-6 text-center text-sm text-text-secondary dark:text-gray-400">
                    Aucun article trouve
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
