// Synchronisation des donnees scrapees vers Supabase.
// Le front lit ces tables ; le dashboard permet de corriger manuellement.
import * as fs from "fs";
import * as path from "path";
import { LEAGUE_NAME, SEASON } from "./config.js";
import type { StandingRow, MatchResult, UpcomingMatch } from "./types.js";

// --- Lecture .env.local (gere encodages Windows) ---
function readEnv(): Record<string, string> {
  const buf = fs.readFileSync(path.resolve(process.cwd(), ".env.local"));
  let raw = buf.includes(0) ? buf.toString("utf16le") : buf.toString("utf-8");
  raw = raw.replace(/^﻿/, "");
  const env: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = readEnv();
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

const H = {
  apikey: SERVICE,
  Authorization: `Bearer ${SERVICE}`,
  "Content-Type": "application/json",
};

async function rest(pathname: string, options: RequestInit = {}): Promise<void> {
  const res = await fetch(`${URL_BASE}${pathname}`, {
    ...options,
    headers: { ...H, ...(options.headers as Record<string, string>) },
  });
  if (!res.ok) {
    throw new Error(`${pathname} → ${res.status} : ${(await res.text()).slice(0, 200)}`);
  }
}

// Convertit "30.05" (+ heure) en date ISO en deduisant l'annee depuis la
// saison (ex: 2025-2026 : mois 08-12 -> 2025, mois 01-07 -> 2026).
function toIsoDate(ddmm: string): string | null {
  const m = ddmm.match(/^(\d{1,2})\.(\d{1,2})\.?$/);
  if (!m) return null;
  const day = m[1].padStart(2, "0");
  const month = m[2].padStart(2, "0");
  const [y1, y2] = SEASON.split("-").map(Number);
  const year = Number(month) >= 8 ? y1 : (y2 ?? y1);
  return `${year}-${month}-${day}`;
}

export async function syncStandingsToSupabase(rows: StandingRow[]): Promise<void> {
  if (!URL_BASE || !SERVICE) {
    console.log("  (Supabase non configure : synchronisation ignoree)");
    return;
  }
  if (rows.length === 0) return;

  // On remplace entierement le classement de la ligue/saison
  await rest(
    `/rest/v1/standings?league=eq.${encodeURIComponent(LEAGUE_NAME)}&season=eq.${encodeURIComponent(SEASON)}`,
    { method: "DELETE" },
  );
  await rest(`/rest/v1/standings`, {
    method: "POST",
    body: JSON.stringify(
      rows.map((r) => ({
        league: LEAGUE_NAME,
        season: SEASON,
        position: r.position,
        team: r.team,
        team_logo: r.logo || "",
        played: r.played,
        wins: r.won,
        draws: r.drawn,
        losses: r.lost,
        goals_for: r.goalsFor,
        goals_against: r.goalsAgainst,
        points: r.points,
        form: r.form ?? [],
        updated_at: new Date().toISOString(),
      })),
    ),
  });
  console.log(`  ✅ Classement synchronise vers Supabase (${rows.length} equipes)`);
}

export async function syncMatchesToSupabase(
  results: MatchResult[],
  fixtures: UpcomingMatch[],
): Promise<void> {
  if (!URL_BASE || !SERVICE) {
    console.log("  (Supabase non configure : synchronisation ignoree)");
    return;
  }

  const toRow = (m: MatchResult | UpcomingMatch) => {
    const matchDate = toIsoDate(m.date);
    if (!matchDate) return null;
    return {
      league: LEAGUE_NAME,
      home_team: m.homeTeam,
      away_team: m.awayTeam,
      home_logo: m.homeLogo || "",
      away_logo: m.awayLogo || "",
      match_date: matchDate,
      match_time: m.time || "",
      status: m.status,
      home_score: "homeScore" in m ? m.homeScore : null,
      away_score: "awayScore" in m ? m.awayScore : null,
      matchday: m.matchday || "",
    };
  };

  const all = [...results, ...fixtures];
  const rows = all.map(toRow).filter(Boolean);
  const skipped = all.length - rows.length;
  if (skipped > 0) {
    console.log(
      `  ⚠️ ${skipped} match(s) ignore(s) : date absente sur Flashscore (frequent en fin de saison)`,
    );
  }
  if (rows.length === 0) {
    console.log("  (Aucun match a synchroniser)");
    return;
  }

  // Upsert sur (league, home_team, away_team, match_date) : les scores des
  // matchs termines ecrasent les fiches "a venir" correspondantes.
  await rest(
    `/rest/v1/matches?on_conflict=league,home_team,away_team,match_date`,
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(rows),
    },
  );
  console.log(`  ✅ Matchs synchronises vers Supabase (${rows.length} matchs)`);
}
