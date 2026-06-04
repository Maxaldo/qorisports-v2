// Fonctions server-only pour lire les donnees scrapees (JSON).
// Ne pas importer ce fichier dans des composants "use client".
import * as fs from "fs";
import * as path from "path";
import type { Match } from "./types";
import { standings as mockStandings, type Standing } from "@/data/mock-standings";
import {
  upcomingMatches as mockUpcoming,
  recentResults as mockResults,
} from "@/data/mock-matches";

const DATA_DIR = path.join(process.cwd(), "src", "data");

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

// Classement depuis les donnees scrapees, fallback sur mock
export function getStandings(): Standing[] {
  const scraped = readJsonFile<Standing[]>("standings-data.json");
  if (scraped && scraped.length > 0) return scraped;
  return mockStandings;
}

// Resultats recents depuis les donnees scrapees, fallback sur mock
export function getRecentResults(): Match[] {
  const scraped = readJsonFile<any[]>("results-data.json");
  if (scraped && scraped.length > 0) {
    return scraped.map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeLogo: m.homeLogo || "",
      awayLogo: m.awayLogo || "",
      date: m.date,
      time: m.time || "",
      venue: "",
      league: "Ligue 1 Benin",
      status: "finished" as const,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      matchday: m.matchday || "",
    }));
  }
  return mockResults;
}

// Matchs a venir depuis les donnees scrapees, fallback sur mock
export function getUpcomingFixtures(): Match[] {
  const scraped = readJsonFile<any[]>("fixtures-data.json");
  if (scraped && scraped.length > 0) {
    return scraped.map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeLogo: m.homeLogo || "",
      awayLogo: m.awayLogo || "",
      date: m.date,
      time: m.time || "",
      venue: "",
      league: "Ligue 1 Benin",
      status: "upcoming" as const,
      homeScore: null,
      awayScore: null,
      matchday: m.matchday || "",
    }));
  }
  return mockUpcoming;
}

// Timestamp de derniere mise a jour du scraping
export function getLastUpdate(): string | null {
  const data = readJsonFile<{ timestamp: string }>("last-update.json");
  return data?.timestamp ?? null;
}
