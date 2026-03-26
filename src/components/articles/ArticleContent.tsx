"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ArticleContentProps {
  html: string;
}

// Contenu de l'article avec basculement vers le mode lecture confortable.
export function ArticleContent({ html }: ArticleContentProps) {
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("qori-reading-mode") === "true") {
      setReadingMode(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setReadingMode((prev) => {
      const next = !prev;
      localStorage.setItem("qori-reading-mode", String(next));
      return next;
    });
  }, []);

  return (
    <>
      {/* Bouton mode lecture */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <BookOpen className="h-4 w-4" />
          {readingMode ? "Mode normal" : "Mode lecture"}
        </button>
      </div>

      {/* Contenu avec transition entre les deux modes */}
      <div
        className={`mt-6 rounded-xl transition-all duration-500 ${
          readingMode
            ? "mx-auto max-w-2xl bg-[#FDF6E3] p-6 md:p-10 dark:bg-[#1A1A2E]"
            : ""
        }`}
      >
        <div
          className={`prose max-w-none transition-all duration-300 ${
            readingMode
              ? "prose-xl font-serif !leading-loose prose-p:!leading-loose"
              : "prose-lg prose-p:leading-relaxed"
          } prose-p:text-text-secondary dark:prose-invert`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Bouton flottant pour quitter le mode lecture */}
      <AnimatePresence>
        {readingMode && (
          <motion.button
            type="button"
            onClick={toggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-accent/90"
          >
            <X className="h-4 w-4" />
            Quitter la lecture
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
