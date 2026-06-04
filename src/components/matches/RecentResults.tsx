"use client";

import Link from "next/link";
import type { Match } from "@/lib/types";
import { TeamLogo } from "@/components/ui/TeamLogo";

interface RecentResultsProps {
  matches: Match[];
  max?: number;
}

// Widget compact des resultats recents pour la sidebar.
// Une ligne par match : logo + equipe dom | score | logo + equipe ext.
export function RecentResults({ matches, max = 5 }: RecentResultsProps) {
  const finished = matches.filter((m) => m.status === "finished").slice(0, max);

  if (finished.length === 0) {
    return (
      <p className="px-3 py-4 text-center text-xs text-text-secondary dark:text-gray-500">
        Aucun resultat disponible
      </p>
    );
  }

  return (
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
          <div key={match.id} className="flex items-center gap-1 px-3 py-1.5">
            <span
              className={`flex min-w-0 flex-1 items-center justify-end gap-1 truncate text-right text-xs leading-tight ${
                homeWin
                  ? "font-bold text-text-primary dark:text-gray-100"
                  : "text-text-secondary dark:text-gray-400"
              }`}
            >
              <span className="truncate">{match.homeTeam}</span>
              <TeamLogo src={match.homeLogo} name={match.homeTeam} size={16} />
            </span>

            <span className="shrink-0 rounded bg-primary px-2 py-0.5 text-xs font-bold tabular-nums text-white">
              {match.homeScore}-{match.awayScore}
            </span>

            <span
              className={`flex min-w-0 flex-1 items-center gap-1 truncate text-left text-xs leading-tight ${
                awayWin
                  ? "font-bold text-text-primary dark:text-gray-100"
                  : "text-text-secondary dark:text-gray-400"
              }`}
            >
              <TeamLogo src={match.awayLogo} name={match.awayTeam} size={16} />
              <span className="truncate">{match.awayTeam}</span>
            </span>
          </div>
        );
      })}

      <div className="px-3 py-2">
        <Link
          href="/matchs"
          className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
        >
          Voir tous les resultats &gt;
        </Link>
      </div>
    </div>
  );
}
