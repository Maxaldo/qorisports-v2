// Fonctions server-only pour lire matchs et classements.
// Source principale : Supabase (alimente par le scraper + corrections du
// dashboard). Secours : fichiers JSON scrapes, puis donnees mock.
// Ne pas importer ce fichier dans des composants "use client".
import * as fs from "fs";
import * as path from "path";
import { supabase } from "./supabase";
import type { Match } from "./types";
import { standings as mockStandings, type Standing } from "@/data/mock-standings";
import {
  upcomingMatches as mockUpcoming,
  recentResults as mockResults,
} from "@/data/mock-matches";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const LEAGUE = "Ligue 1 Benin";

function readJsonFile<T>(filename: string): T | null {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// --- Types bruts Supabase ---
interface DbStanding {
  position: number;
  team: string;
  team_logo: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  form?: ("W" | "D" | "L")[] | null;
  updated_at?: string;
}

interface DbMatch {
  id: string;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  match_date: string;
  match_time: string | null;
  venue: string | null;
  league: string;
  status: "upcoming" | "live" | "finished";
  home_score: number | null;
  away_score: number | null;
  matchday: string | null;
}

// "2026-05-30" -> "30.05" (format d'affichage historique du site)
function toDisplayDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}.${m}`;
}

function transformMatch(row: DbMatch): Match {
  return {
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeLogo: row.home_logo || "",
    awayLogo: row.away_logo || "",
    date: toDisplayDate(row.match_date),
    time: row.match_time || "",
    venue: row.venue || "",
    league: row.league,
    status: row.status,
    homeScore: row.home_score,
    awayScore: row.away_score,
    matchday: row.matchday || "",
  };
}

// Classement : Supabase -> JSON scrape -> mock
export async function getStandings(): Promise<Standing[]> {
  try {
    const { data, error } = await supabase
      .from("standings")
      .select("*")
      .eq("league", LEAGUE)
      .order("position", { ascending: true });
    if (!error && data && data.length > 0) {
      return (data as DbStanding[]).map((r) => ({
        position: r.position,
        team: r.team,
        logo: r.team_logo || "",
        played: r.played,
        won: r.wins,
        drawn: r.draws,
        lost: r.losses,
        goalsFor: r.goals_for,
        goalsAgainst: r.goals_against,
        goalDifference: r.goals_for - r.goals_against,
        points: r.points,
        form: (r.form ?? []) as ("W" | "D" | "L")[],
      }));
    }
  } catch {
    // on passe au secours
  }
  const scraped = readJsonFile<Standing[]>("standings-data.json");
  if (scraped && scraped.length > 0) return scraped;
  return mockStandings;
}

// Resultats recents : Supabase -> JSON scrape -> mock
export async function getRecentResults(count: number = 10): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("league", LEAGUE)
      .eq("status", "finished")
      .order("match_date", { ascending: false })
      .limit(count);
    if (!error && data && data.length > 0) {
      return (data as DbMatch[]).map(transformMatch);
    }
  } catch {
    // on passe au secours
  }
  const scraped = readJsonFile<Record<string, unknown>[]>("results-data.json");
  if (scraped && scraped.length > 0) {
    return scraped.map((m) => ({
      id: String(m.id),
      homeTeam: String(m.homeTeam),
      awayTeam: String(m.awayTeam),
      homeLogo: String(m.homeLogo || ""),
      awayLogo: String(m.awayLogo || ""),
      date: String(m.date),
      time: String(m.time || ""),
      venue: "",
      league: LEAGUE,
      status: "finished" as const,
      homeScore: m.homeScore as number,
      awayScore: m.awayScore as number,
      matchday: String(m.matchday || ""),
    }));
  }
  return mockResults;
}

// Matchs a venir : Supabase -> JSON scrape -> mock
export async function getUpcomingFixtures(count: number = 10): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("league", LEAGUE)
      .in("status", ["upcoming", "live"])
      .order("match_date", { ascending: true })
      .limit(count);
    if (!error && data && data.length > 0) {
      return (data as DbMatch[]).map(transformMatch);
    }
  } catch {
    // on passe au secours
  }
  const scraped = readJsonFile<Record<string, unknown>[]>("fixtures-data.json");
  if (scraped && scraped.length > 0) {
    return scraped.map((m) => ({
      id: String(m.id),
      homeTeam: String(m.homeTeam),
      awayTeam: String(m.awayTeam),
      homeLogo: String(m.homeLogo || ""),
      awayLogo: String(m.awayLogo || ""),
      date: String(m.date),
      time: String(m.time || ""),
      venue: "",
      league: LEAGUE,
      status: "upcoming" as const,
      homeScore: null,
      awayScore: null,
      matchday: String(m.matchday || ""),
    }));
  }
  return mockUpcoming;
}

// Date de derniere mise a jour : Supabase (standings.updated_at) -> JSON
export async function getLastUpdate(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("standings")
      .select("updated_at")
      .eq("league", LEAGUE)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!error && data?.updated_at) return data.updated_at as string;
  } catch {
    // on passe au secours
  }
  const data = readJsonFile<{ timestamp: string }>("last-update.json");
  return data?.timestamp ?? null;
}
