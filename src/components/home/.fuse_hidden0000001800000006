"use client";

import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Eye,
  Megaphone,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  formatViews,
  getBadgeLabel,
  incrementAdClicks,
  incrementAdImpressions,
  type Ad,
} from "@/lib/api";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { UpcomingMatches } from "@/components/matches/UpcomingMatches";
import { RecentResults } from "@/components/matches/RecentResults";
import type { Article, Match } from "@/lib/types";
import type { Standing } from "@/data/mock-standings";

interface SidebarProps {
  articles: Article[];
  standings: Standing[];
  upcomingMatches: Match[];
  recentResults: Match[];
  ad?: Ad | null;
  // Seconde banniere, affichee en bas de la sidebar (slot "home_bottom").
  adBottom?: Ad | null;
}

// Contenu d'un bloc publicitaire (banniere cliquable ou placeholder).
function AdContent({ ad }: { ad?: Ad | null }) {
  if (!ad) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-xs font-medium uppercase tracking-wider text-text-secondary dark:text-gray-500">
          Espace publicitaire
        </span>
      </div>
    );
  }
  return (
    <a
      href={ad.link_url || "#"}
      target={ad.link_url ? "_blank" : undefined}
      rel="noopener noreferrer sponsored"
      onClick={() => incrementAdClicks(ad.id)}
      className="block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.image_url}
        alt={ad.name}
        className="h-auto w-full object-cover"
      />
    </a>
  );
}

// Conteneur generique pour chaque widget de la sidebar.
// Style uniforme : titre avec icone sur fond gris, contenu sur fond blanc, bordure fine.
function SidebarWidget({
  icon,
  title,
  children,
  delay = 0,
  inView,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className="overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="flex items-center gap-2 bg-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
        {icon}
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

// Sidebar de la homepage avec apparition progressive au scroll.
// Ordre : Matchs a venir, Classement, Resultats, Articles populaires,
// Categories, Pub placeholder.
export function Sidebar({
  articles,
  standings,
  upcomingMatches,
  recentResults,
  ad,
  adBottom,
}: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Compte une impression publicitaire par affichage de la page
  useEffect(() => {
    if (ad) incrementAdImpressions(ad.id);
    if (adBottom) incrementAdImpressions(adBottom.id);
  }, [ad, adBottom]);

  const popular = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 5),
    [articles],
  );

  return (
    <div ref={ref} className="sticky top-24 flex flex-col gap-6">
      {/* 1. Bloc pub — en tete de colonne pour une visibilite maximale */}
      <SidebarWidget
        icon={<Megaphone className="h-4 w-4 text-red-500" />}
        title="Publicite"
        delay={0}
        inView={inView}
      >
        <AdContent ad={ad} />
      </SidebarWidget>

      {/* 2. Matchs a venir (max 3) */}
      <SidebarWidget
        icon={<Calendar className="h-4 w-4 text-accent" />}
        title="Matchs a venir"
        delay={0}
        inView={inView}
      >
        <UpcomingMatches matches={upcomingMatches} max={2} />
      </SidebarWidget>

      {/* 2. Classement Ligue 1 (top 5) */}
      <SidebarWidget
        icon={<BarChart3 className="h-4 w-4 text-amber-500" />}
        title="Classement Ligue 1"
        delay={0.05}
        inView={inView}
      >
        <StandingsTable standings={standings} compact />
        <div className="px-4 py-2">
          <Link
            href="/classement"
            className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Voir le classement complet &gt;
          </Link>
        </div>
      </SidebarWidget>

      {/* 3. Resultats recents (max 5) */}
      <SidebarWidget
        icon={<Trophy className="h-4 w-4 text-green-500" />}
        title="Resultats recents"
        delay={0.1}
        inView={inView}
      >
        <RecentResults matches={recentResults} max={5} />
      </SidebarWidget>

      {/* 4. Articles populaires */}
      <SidebarWidget
        icon={<Star className="h-4 w-4 text-yellow-500" />}
        title="Articles populaires"
        delay={0.15}
        inView={inView}
      >
        <div className="px-4 py-3 space-y-3">
          {popular.map((article, i) => (
            <div key={article.id} className="flex items-start gap-3">
              <span className="shrink-0 text-lg font-bold leading-none text-gray-200 dark:text-gray-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/article/${article.slug}`}>
                  <h4 className="text-xs font-semibold leading-snug text-text-primary line-clamp-2 transition-colors hover:text-accent dark:text-gray-100">
                    {article.title}
                  </h4>
                </Link>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ color: article.category.color }}
                  >
                    {getBadgeLabel(article)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-text-secondary dark:text-gray-500">
                    <Eye className="h-3 w-3" />
                    {formatViews(article.views)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SidebarWidget>

      {/* 6. Seconde banniere publicitaire (slot "home_bottom") */}
      <SidebarWidget
        icon={<Megaphone className="h-4 w-4 text-red-500" />}
        title="Publicite"
        delay={0.2}
        inView={inView}
      >
        <AdContent ad={adBottom} />
      </SidebarWidget>

    </div>
  );
}
