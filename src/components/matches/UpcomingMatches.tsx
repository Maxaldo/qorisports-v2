"use client";

import Link from "next/link";
import type { Match } from "@/lib/types";
import { TeamLogo } from "@/components/ui/TeamLogo";

interface UpcomingMatchesProps {
  matches: Match[];
  max?: number;
}

// Widget compact des matchs a venir pour la sidebar.
export function UpcomingMatches({ matches, max = 2 }: UpcomingMatchesProps) {
  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, max);

  if (upcoming.length === 0) {
    return (
      <p className="px-3 py-4 text-center text-xs text-text-secondary dark:text-gray-500">
        Aucun match programme
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {upcoming.map((match) => (
        <div key={match.id} className="flex items-center gap-2 px-3 py-2">
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-accent">
            {match.date}
            <br />
            {match.time}
          </span>

          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="flex items-center gap-1.5 truncate text-xs font-semibold leading-tight text-text-primary dark:text-gray-100">
              <TeamLogo src={match.homeLogo} name={match.homeTeam} size={20} />
              {match.homeTeam}
            </p>
            <p className="flex items-center gap-1.5 truncate text-xs leading-tight text-text-secondary dark:text-gray-400">
              <TeamLogo src={match.awayLogo} name={match.awayTeam} size={20} />
              {match.awayTeam}
            </p>
          </div>
        </div>
      ))}

      {matches.length > max && (
        <div className="px-3 py-2">
          <Link
            href="/matchs"
            className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Voir tous les matchs &gt;
          </Link>
        </div>
      )}
    </div>
  );
}
