"use client";

import { motion, useInView } from "framer-motion";
import { Trophy } from "lucide-react";
import { useRef } from "react";
import type { Match } from "@/lib/types";

interface RecentResultsProps {
  matches: Match[];
}

export function RecentResults({ matches }: RecentResultsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const finished = matches.filter((m) => m.status === "finished");
  if (finished.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900"
    >
      <h3 className="flex items-center gap-2 bg-surface px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wide text-text-primary dark:bg-gray-800 dark:text-gray-100">
        <Trophy className="h-4 w-4 text-amber-500" />
        Resultats recents
      </h3>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {finished.map((match) => {
          const homeWin =
            match.homeScore !== null &&
            match.awayScore !== null &&
            match.homeScore > match.awayScore;
          const awayWin =
            match.homeScore !== null &&
            match.awayScore !== null &&
            match.awayScore > match.homeScore;

          return (
            <div key={match.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`min-w-0 flex-1 text-right text-sm leading-snug ${
                    homeWin
                      ? "font-bold text-text-primary dark:text-gray-100"
                      : "text-text-secondary dark:text-gray-400"
                  }`}
                >
                  {match.homeTeam}
                </span>

                <span className="shrink-0 rounded bg-primary px-2.5 py-1 text-sm font-bold tabular-nums text-white">
                  {match.homeScore} - {match.awayScore}
                </span>

                <span
                  className={`min-w-0 flex-1 text-left text-sm leading-snug ${
                    awayWin
                      ? "font-bold text-text-primary dark:text-gray-100"
                      : "text-text-secondary dark:text-gray-400"
                  }`}
                >
                  {match.awayTeam}
                </span>
              </div>

              <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-text-secondary dark:text-gray-500">
                J{match.matchday}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
