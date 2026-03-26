"use client";

import { useEffect, useState } from "react";

// Hook de gestion du theme clair/sombre via la classe "dark" sur <html>.
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Lecture de la preference stockee au montage.
  useEffect(() => {
    const stored = localStorage.getItem("qorisports-theme") as
      | "light"
      | "dark"
      | null;
    const initial = stored ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("qorisports-theme", next);
  }

  return { theme, toggleTheme };
}
