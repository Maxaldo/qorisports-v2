"use client";

import { useEffect, useState } from "react";

// Barre de progression de lecture fixee en haut de page.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = document.getElementById("article-body");
      if (!el) return;

      const { top, height } = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - viewportH;

      if (total <= 0) {
        setProgress(100);
        return;
      }

      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full">
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
