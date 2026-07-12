"use client";

import { useEffect } from "react";
import { incrementViews } from "@/lib/api";

// Compte une vue quand un lecteur ouvre l'article (une fois par affichage).
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    incrementViews(slug);
  }, [slug]);

  return null;
}
