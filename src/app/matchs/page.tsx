import type { Metadata } from "next";
import { getLastUpdate, getRecentResults, getUpcomingFixtures } from "@/lib/data";
import type { Match } from "@/lib/types";
import { TeamLogo } from "@/components/ui/TeamLogo";

export const metadata: Metadata = {
  title: "Calendrier Ligue 1 Beninoise",
  description:
    "Calendrier complet, matchs a venir et resultats recents de la Ligue 1 beninoise de football, saison 2025-2026.",
};

export default async function MatchsPage() {
  const [upcoming, results, lastUpdate] = await Promise.all([
    getUpcomingFixtures(),
    getRecentResults(),
    getLastUpdate(),
  ]);

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
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

          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-text-secondary dark:text-gray-400">
              Aucun match a venir pour le moment.
            </p>
          )}
        </section>

        {/* Resultats recents */}
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Derniers resultats
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {results.map((match) => (
                <ResultCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-text-secondary dark:text-gray-400">
              Aucun resultat disponible.
            </p>
          )}
        </section>

        {lastUpdate && (
          <p className="mt-10 text-center text-xs text-text-secondary dark:text-gray-500">
            Derniere mise a jour :{" "}
            {new Date(lastUpdate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between text-xs text-text-secondary dark:text-gray-400">
        <span className="font-semibold uppercase tracking-wide">
          {match.matchday}
        </span>
        <span>{match.date}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-end gap-2 text-right">
          <p className="text-sm font-semibold text-text-primary dark:text-gray-100">
            {match.homeTeam}
          </p>
          <TeamLogo src={match.homeLogo} name={match.homeTeam} size={28} />
        </div>

        <span className="shrink-0 rounded-md bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          VS
        </span>

        <div className="flex flex-1 items-center gap-2 text-left">
          <TeamLogo src={match.awayLogo} name={match.awayTeam} size={28} />
          <p className="text-sm font-semibold text-text-primary dark:text-gray-100">
            {match.awayTeam}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-medium text-text-secondary dark:text-gray-400">
        {match.time}
      </p>
    </div>
  );
}

function ResultCard({ match }: { match: Match }) {
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
        {match.matchday}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div
          className={`flex flex-1 items-center justify-end gap-2 text-right text-sm leading-snug ${
            homeWin
              ? "font-bold text-text-primary dark:text-gray-100"
              : "text-text-secondary dark:text-gray-400"
          }`}
        >
          <span>{match.homeTeam}</span>
          <TeamLogo src={match.homeLogo} name={match.homeTeam} size={24} />
        </div>

        <span className="shrink-0 rounded-lg bg-primary px-4 py-2 text-lg font-extrabold tabular-nums text-white">
          {match.homeScore} - {match.awayScore}
        </span>

        <div
          className={`flex flex-1 items-center gap-2 text-left text-sm leading-snug ${
            awayWin
              ? "font-bold text-text-primary dark:text-gray-100"
              : "text-text-secondary dark:text-gray-400"
          }`}
        >
          <TeamLogo src={match.awayLogo} name={match.awayTeam} size={24} />
          <span>{match.awayTeam}</span>
        </div>
      </div>
    </div>
  );
}
