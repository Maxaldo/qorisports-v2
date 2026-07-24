"use client";

import { useEffect } from "react";
import { incrementAdClicks, incrementAdImpressions, type Ad } from "@/lib/api";

// Banniere publicitaire affichee dans les pages article (slot "article").
// Compte une impression a l'affichage et un clic au clic.
export function ArticleAd({ ad }: { ad: Ad | null }) {
  useEffect(() => {
    if (ad) incrementAdImpressions(ad.id);
  }, [ad]);

  if (!ad) return null;

  return (
    <div className="my-10">
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-text-secondary dark:text-gray-500">
        Publicité
      </p>
      <a
        href={ad.link_url || "#"}
        target={ad.link_url ? "_blank" : undefined}
        rel="noopener noreferrer sponsored"
        onClick={() => incrementAdClicks(ad.id)}
        className="mx-auto flex max-w-lg justify-center overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image_url}
          alt={ad.name}
          className="max-h-56 w-auto object-contain"
        />
      </a>
    </div>
  );
}
