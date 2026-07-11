import * as fs from "fs";
import * as path from "path";
import { OUTPUT_DIR, LEAGUE_NAME, SEASON } from "./config.js";
import { scrapeStandings } from "./scrape-standings.js";
import { scrapeResults } from "./scrape-results.js";
import { scrapeFixtures } from "./scrape-fixtures.js";
import {
  syncMatchesToSupabase,
  syncStandingsToSupabase,
} from "./supabase-sync.js";

async function main() {
  console.log("=".repeat(60));
  console.log(`  Scraper Flashscore - ${LEAGUE_NAME} ${SEASON}`);
  console.log("=".repeat(60));
  console.log();

  const startTime = Date.now();

  // 1. Classement
  console.log("--- Etape 1/3 : Classement ---");
  const standings = await scrapeStandings();
  console.log();

  // 2. Resultats recents
  console.log("--- Etape 2/3 : Resultats ---");
  const results = await scrapeResults();
  console.log();

  // 3. Matchs a venir
  console.log("--- Etape 3/3 : Calendrier ---");
  const fixtures = await scrapeFixtures();
  console.log();

  // 4. Synchronisation vers Supabase (non fatale : les JSON restent la
  // solution de secours si la synchro echoue)
  console.log("--- Etape 4/4 : Synchronisation Supabase ---");
  try {
    await syncStandingsToSupabase(standings);
    await syncMatchesToSupabase(results, fixtures);
  } catch (err) {
    console.error("  ⚠️ Synchro Supabase echouee (JSON conserves) :", err);
  }
  console.log();

  // Sauvegarde du timestamp de derniere mise a jour
  const lastUpdate = {
    timestamp: new Date().toISOString(),
    league: LEAGUE_NAME,
    season: SEASON,
    stats: {
      standings: standings.length,
      results: results.length,
      fixtures: fixtures.length,
    },
  };

  const updatePath = path.join(OUTPUT_DIR, "last-update.json");
  fs.writeFileSync(updatePath, JSON.stringify(lastUpdate, null, 2), "utf-8");

  // Resume
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("=".repeat(60));
  console.log("  Resume du scraping");
  console.log("=".repeat(60));
  console.log(`  Equipes au classement : ${standings.length}`);
  console.log(`  Resultats recuperes   : ${results.length}`);
  console.log(`  Matchs a venir        : ${fixtures.length}`);
  console.log(`  Duree totale          : ${elapsed}s`);
  console.log(`  Derniere MAJ          : ${lastUpdate.timestamp}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Erreur fatale du scraper :", err);
  process.exit(1);
});
