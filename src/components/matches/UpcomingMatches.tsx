"use client";

import { motion, useInView } from "framer-motion";
import { Calendar } from "lucide-react";
import { useRef } from "react";
import type { Match } from "@/lib/types";

interface UpcomingMatchesProps {
  matches: Match[];
  compact?: boolean;
}

// Formate une date ISO en francais court (ex: "Sam. 29 mars")
function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
  const num = date.getDate();
  const month = date.toLocaleDateString("fr-FR", { month: "short" });
  return `${day} ${num} ${month}`;
}

export function UpcomingMatches({ matches, compact = false }: UpcomingMatchesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const displayed = compact ? matches.slice(0, 3) : matches;

  if (displayed.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900"
    >
      <h3 className="flex items-center gap-2 bg-surface px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
        <Calendar className="h-4 w-4 text-accent" />
        Matchs a venir
      </h3>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {displayed.map((match) => (
          <div key={match.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex w-16 shrink-0 flex-col items-center rounded-md bg-accent/10 px-2 py-1.5 text-center">
              <span className="text-[10px] font-bold uppercase leading-tight text-accent">
                {formatShortDate(match.date).split(" ").slice(0, 1)}
              </span>
              <span className="text-base font-extrabold leading-tight text-accent">
                {new Date(match.date).getDate()}
              </span>
              <span className="text-[10px] uppercase leading-tight text-accent/70">
                {new Date(match.date).toLocaleDateString("fr-FR", { month: "short" })}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug text-text-primary dark:text-gray-100">
                {match.homeTeam}
                <span className="mx-1 text-text-secondary dark:text-gray-500">vs</span>
                {match.awayTeam}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary dark:text-gray-400">
                {match.time} - {match.venue}
              </p>
            </div>
          </div>
        ))}
      </div>

      {compact && matches.length > 3 && (
        <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
          <a
            href="/matchs"
            className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Voir tous les matchs &gt;
          </a>
        </div>
      )}
    </motion.div>
  );
}
