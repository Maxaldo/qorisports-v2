import type { Metadata } from "next";
import { upcomingMatches, recentResults } from "@/data/mock-matches";
import { UpcomingMatches } from "@/components/matches/UpcomingMatches";
import { RecentResults } from "@/components/matches/RecentResults";

export const metadata: Metadata = {
  title: "Calendrier Ligue 1 Beninoise",
  description:
    "Calendrier complet, matchs a venir et resultats recents de la Ligue 1 beninoise de football, saison 2025-2026.",
};

export default function MatchsPage() {
  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-primary px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          Calendrier Ligue 1 Beninoise
        </h1>
        <p className="mt-3 text-lg text-gray-400">Saison 2025-2026</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        {/* Matchs a venir */}
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Matchs a venir
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Resultats recents */}
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Derniers resultats
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {recentResults.map((match) => (
              <ResultCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Carte de match a venir
function MatchCard({ match }: { match: (typeof upcomingMatches)[number] }) {
  const dateObj = new Date(match.date);
  const formattedDate = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between text-xs text-text-secondary dark:text-gray-400">
        <span className="font-semibold uppercase tracking-wide">
          J{match.matchday}
        </span>
        <span className="capitalize">{formattedDate}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="flex-1 text-right text-sm font-semibold text-text-primary dark:text-gray-100">
          {match.homeTeam}
        </p>
        <span className="shrink-0 rounded-md bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          VS
        </span>
        <p className="flex-1 text-left text-sm font-semibold text-text-primary dark:text-gray-100">
          {match.awayTeam}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary dark:text-gray-400">
        <span className="font-medium">{match.time}</span>
        <span className="h-1 w-1 rounded-full bg-text-secondary/40" />
        <span>{match.venue}</span>
      </div>
    </div>
  );
}

// Carte de resultat
function ResultCard({ match }: { match: (typeof recentResults)[number] }) {
  const homeWin =
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore > match.awayScore;
  const awayWin =
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.awayScore > match.homeScore;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
        J{match.matchday}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          className={`flex-1 text-right text-sm leading-snug ${
            homeWin
              ? "font-bold text-text-primary dark:text-gray-100"
              : "text-text-secondary dark:text-gray-400"
          }`}
        >
          {match.homeTeam}
        </p>

        <span className="shrink-0 rounded-lg bg-primary px-4 py-2 text-lg font-extrabold tabular-nums text-white">
          {match.homeScore} - {match.awayScore}
        </span>

        <p
          className={`flex-1 text-left text-sm leading-snug ${
            awayWin
              ? "font-bold text-text-primary dark:text-gray-100"
              : "text-text-secondary dark:text-gray-400"
          }`}
        >
          {match.awayTeam}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-text-secondary dark:text-gray-400">
        {match.venue}
      </p>
    </div>
  );
}
