import type { Metadata } from "next";
import { getLastUpdate, getStandings } from "@/lib/data";
import { season } from "@/data/mock-standings";
import { StandingsTable } from "@/components/standings/StandingsTable";

export const metadata: Metadata = {
  title: "Classement Ligue 1 Beninoise",
  description:
    "Classement complet de la Ligue 1 beninoise de football, saison 2025-2026. Points, resultats et forme des equipes.",
};

export default async function ClassementPage() {
  const [standings, lastUpdate] = await Promise.all([
    getStandings(),
    getLastUpdate(),
  ]);

  const bestAttack = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const bestDefense = [...standings].sort(
    (a, b) => a.goalsAgainst - b.goalsAgainst,
  )[0];
  const longestWinStreak = [...standings].sort((a, b) => {
    const streak = (form: string[]) => {
      let count = 0;
      for (const r of form) {
        if (r === "W") count++;
        else break;
      }
      return count;
    };
    return streak(b.form) - streak(a.form);
  })[0];

  if (!bestAttack || !bestDefense || !longestWinStreak) {
    return (
      <div className="bg-surface pb-16 dark:bg-gray-950">
        <div className="bg-primary px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Classement Ligue 1 Beninoise
          </h1>
        </div>
        <p className="py-20 text-center text-text-secondary">
          Aucune donnee de classement disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <div className="bg-primary px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          Classement Ligue 1 Beninoise
        </h1>
        <p className="mt-3 text-lg text-gray-400">Saison {season}</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
              Meilleure attaque
            </p>
            <p className="mt-1 font-display text-lg font-bold text-text-primary dark:text-gray-100">
              {bestAttack.team}
            </p>
            <p className="mt-0.5 text-2xl font-extrabold text-green-600">
              {bestAttack.goalsFor} buts
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
              Meilleure defense
            </p>
            <p className="mt-1 font-display text-lg font-bold text-text-primary dark:text-gray-100">
              {bestDefense.team}
            </p>
            <p className="mt-0.5 text-2xl font-extrabold text-accent">
              {bestDefense.goalsAgainst} enc.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
              Meilleure serie recente
            </p>
            <p className="mt-1 font-display text-lg font-bold text-text-primary dark:text-gray-100">
              {longestWinStreak.team}
            </p>
            <div className="mt-1.5 flex gap-1">
              {longestWinStreak.form.map((r, i) => (
                <span
                  key={i}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                    r === "W"
                      ? "bg-green-500"
                      : r === "D"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900">
          <StandingsTable standings={standings} />
        </div>

        {lastUpdate && (
          <p className="mt-4 text-center text-xs text-text-secondary dark:text-gray-500">
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
