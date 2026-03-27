"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Standing } from "@/data/mock-standings";

interface StandingsTableProps {
  standings: Standing[];
  compact?: boolean;
}

// Couleur de fond selon le resultat (forme).
function formColor(result: "W" | "D" | "L"): string {
  if (result === "W") return "bg-green-500";
  if (result === "D") return "bg-amber-500";
  return "bg-red-500";
}

// Fond de ligne selon la zone du classement.
function rowZone(
  position: number,
  total: number,
): string {
  if (position <= 3) return "bg-green-50 dark:bg-green-950/30";
  if (position > total - 3) return "bg-red-50 dark:bg-red-950/30";
  return "";
}

// Tableau du classement de la Ligue 1 beninoise.
export function StandingsTable({ standings, compact = false }: StandingsTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const data = compact ? standings.slice(0, 5) : standings;
  const total = standings.length;

  return (
    <div ref={ref} className="overflow-x-auto">
      <table className="w-full min-w-[360px] text-sm">
        <thead>
          <tr className="bg-primary text-xs font-semibold uppercase tracking-wide text-white">
            <th className="px-3 py-2.5 text-left">#</th>
            <th className="px-3 py-2.5 text-left">Equipe</th>
            <th className="px-3 py-2.5 text-center">MJ</th>
            {!compact && (
              <>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">V</th>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">N</th>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">D</th>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">BP</th>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">BC</th>
                <th className="hidden px-3 py-2.5 text-center md:table-cell">Diff</th>
              </>
            )}
            <th className="px-3 py-2.5 text-center">Pts</th>
            {!compact && (
              <th className="hidden px-3 py-2.5 text-center lg:table-cell">Forme</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, i) => (
            <motion.tr
              key={row.team}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${rowZone(row.position, total)}`}
            >
              <td className="px-3 py-2.5 font-bold text-text-primary dark:text-gray-100">
                {row.position}
              </td>
              <td className="px-3 py-2.5 font-semibold text-text-primary dark:text-gray-100">
                {row.team}
              </td>
              <td className="px-3 py-2.5 text-center text-text-secondary dark:text-gray-400">
                {row.played}
              </td>
              {!compact && (
                <>
                  <td className="hidden px-3 py-2.5 text-center text-text-secondary md:table-cell dark:text-gray-400">
                    {row.won}
                  </td>
                  <td className="hidden px-3 py-2.5 text-center text-text-secondary md:table-cell dark:text-gray-400">
                    {row.drawn}
                  </td>
                  <td className="hidden px-3 py-2.5 text-center text-text-secondary md:table-cell dark:text-gray-400">
                    {row.lost}
                  </td>
                  <td className="hidden px-3 py-2.5 text-center text-text-secondary md:table-cell dark:text-gray-400">
                    {row.goalsFor}
                  </td>
                  <td className="hidden px-3 py-2.5 text-center text-text-secondary md:table-cell dark:text-gray-400">
                    {row.goalsAgainst}
                  </td>
                  <td className="hidden px-3 py-2.5 text-center font-medium text-text-primary md:table-cell dark:text-gray-300">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                </>
              )}
              <td className="px-3 py-2.5 text-center">
                <span className="inline-block rounded bg-accent/10 px-2 py-0.5 font-bold text-accent">
                  {row.points}
                </span>
              </td>
              {!compact && (
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <div className="flex items-center justify-center gap-1">
                    {row.form.map((r, fi) => (
                      <span
                        key={fi}
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${formColor(r)}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Legende des zones */}
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-4 px-3 text-xs text-text-secondary dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-green-500/20 ring-1 ring-green-500/40" />
            Qualification continentale
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-500/20 ring-1 ring-red-500/40" />
            Zone de relegation
          </span>
        </div>
      )}
    </div>
  );
}
