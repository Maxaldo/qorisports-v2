import path from "path";

// URLs Flashscore pour la Ligue 1 beninoise
export const URL_CLASSEMENT =
  "https://www.flashscore.fr/football/benin/ligue-1/classement/";
export const URL_RESULTATS =
  "https://www.flashscore.fr/football/benin/ligue-1/resultats/";
export const URL_MATCHS =
  "https://www.flashscore.fr/football/benin/ligue-1/calendrier/";

export const LEAGUE_NAME = "Ligue 1 Benin";
export const SEASON = "2025-2026";

// Dossier de sortie : src/data/ du projet Next.js
export const OUTPUT_DIR = path.resolve(process.cwd(), "src", "data");

// User-agent realiste
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// Options Puppeteer
export const BROWSER_OPTIONS = {
  headless: true as const,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
