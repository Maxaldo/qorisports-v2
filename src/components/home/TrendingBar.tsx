import Link from "next/link";
import type { Article } from "@/lib/types";

interface TrendingBarProps {
  articles: Article[];
}

// Barre de tendances avec defilement horizontal continu (marquee CSS).
export function TrendingBar({ articles }: TrendingBarProps) {
  const items = articles.slice(0, 5);

  return (
    <div className="flex items-stretch bg-accent text-white overflow-hidden">
      <div className="shrink-0 flex items-center bg-black/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider">
        Tendances
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-marquee items-center whitespace-nowrap py-2.5">
          {[...items, ...items].map((article, i) => (
            <span key={`${article.id}-${i}`} className="inline-flex items-center">
              {i > 0 && (
                <span className="mx-4 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
              )}
              <Link
                href={`/article/${article.slug}`}
                className="text-sm transition-opacity hover:opacity-80"
              >
                {article.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
