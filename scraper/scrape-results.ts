import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { BROWSER_OPTIONS, OUTPUT_DIR, URL_RESULTATS, USER_AGENT } from "./config.js";
import type { MatchResult } from "./types.js";

const DEBUG_DIR = path.resolve(process.cwd(), "scraper", "debug-html");
// On recupere tous les matchs de la derniere journee complete

function saveDebugHtml(html: string, filename: string): void {
  fs.mkdirSync(DEBUG_DIR, { recursive: true });
  fs.writeFileSync(path.join(DEBUG_DIR, filename), html, "utf-8");
  console.log(`[DEBUG] HTML sauvegarde dans ${path.join(DEBUG_DIR, filename)}`);
}

export async function scrapeResults(): Promise<MatchResult[]> {
  console.log("[Resultats] Lancement du navigateur...");
  const browser = await puppeteer.launch(BROWSER_OPTIONS);

  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({ width: 1280, height: 900 });

    console.log("[Resultats] Navigation vers", URL_RESULTATS);
    await page.goto(URL_RESULTATS, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));

    // Accepter les cookies
    try {
      await page.click("#onetrust-accept-btn-handler");
      console.log("[Resultats] Cookies acceptes");
      await new Promise((r) => setTimeout(r, 2000));
    } catch {}

    // Attendre le rendu des matchs
    console.log("[Resultats] Attente du rendu des resultats...");
    try {
      await page.waitForSelector("[class*='event__match']", { timeout: 15000 });
      console.log("[Resultats] Matchs detectes");
    } catch {
      console.log("[Resultats] Matchs non detectes, attente supplementaire...");
      await new Promise((r) => setTimeout(r, 5000));
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Extraction via string JS pure
    const data = await page.evaluate(`
      (function() {
        var results = [];
        var currentRound = '';

        var allEls = document.querySelectorAll('[class*="event__round"], [class*="event__match"]');

        for (var i = 0; i < allEls.length; i++) {
          var el = allEls[i];
          var cls = el.getAttribute('class') || '';

          if (cls.indexOf('event__round') > -1) {
            currentRound = (el.textContent || '').trim();
            continue;
          }

          if (cls.indexOf('event__match') === -1) continue;

          // Equipes et logos
          var homeEl = el.querySelector('[class*="event__homeParticipant"]');
          var awayEl = el.querySelector('[class*="event__awayParticipant"]');
          if (!homeEl || !awayEl) continue;

          var homeNameEl = homeEl.querySelector('[class*="wcl-name"]') || homeEl;
          var awayNameEl = awayEl.querySelector('[class*="wcl-name"]') || awayEl;
          var homeTeam = (homeNameEl.textContent || '').trim();
          var awayTeam = (awayNameEl.textContent || '').trim();
          if (!homeTeam || !awayTeam) continue;

          // Logos des equipes
          var homeLogoEl = homeEl.querySelector('img') || el.querySelector('[class*="homeParticipant"] img');
          var awayLogoEl = awayEl.querySelector('img') || el.querySelector('[class*="awayParticipant"] img');
          var homeLogo = homeLogoEl ? (homeLogoEl.getAttribute('src') || '') : '';
          var awayLogo = awayLogoEl ? (awayLogoEl.getAttribute('src') || '') : '';

          // Scores
          var scoreHomeEl = el.querySelector('[class*="event__score--home"]');
          var scoreAwayEl = el.querySelector('[class*="event__score--away"]');
          var homeScore = scoreHomeEl ? parseInt((scoreHomeEl.textContent || '').trim(), 10) : 0;
          var awayScore = scoreAwayEl ? parseInt((scoreAwayEl.textContent || '').trim(), 10) : 0;

          // Date et heure
          var timeEl = el.querySelector('[class*="event__time"]');
          var timeText = timeEl ? (timeEl.textContent || '').trim() : '';
          var parts = timeText.split(/\\s+/);
          var dateStr = (parts[0] || '').replace(/\\.$/, '');
          var timeStr = parts[1] || '';

          results.push({
            id: 'r-' + (results.length + 1),
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeLogo: homeLogo,
            awayLogo: awayLogo,
            homeScore: isNaN(homeScore) ? 0 : homeScore,
            awayScore: isNaN(awayScore) ? 0 : awayScore,
            date: dateStr,
            time: timeStr,
            status: 'finished',
            matchday: currentRound
          });
        }

        return results;
      })()
    `);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("[Resultats] Aucun resultat trouve dans le DOM.");
      const html = await page.content();
      console.log("[Resultats] Extrait du HTML (500 premiers chars) :");
      console.log(html.substring(0, 500));
      saveDebugHtml(html, "results-debug.html");
      await browser.close();
      return [];
    }

    await browser.close();

    const allResults = data as MatchResult[];

    // Garder uniquement les matchs de la premiere journee (la plus recente)
    const firstRound = allResults.length > 0 ? allResults[0].matchday : "";
    const results = firstRound
      ? allResults.filter((m) => m.matchday === firstRound)
      : allResults;

    // Sauvegarde
    const outputPath = path.join(OUTPUT_DIR, "results-data.json");
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");

    console.log(`[Resultats] ${results.length} resultats recuperes -> ${outputPath}`);
    return results;
  } catch (error) {
    console.error("[Resultats] Erreur :", error);
    try {
      const pages = await browser.pages();
      if (pages.length > 0) {
        const html = await pages[0].content();
        saveDebugHtml(html, "results-debug.html");
      }
    } catch {}
    await browser.close().catch(() => {});
    return [];
  }
}

// Execution directe
const scriptName = process.argv[1] || "";
if (scriptName.includes("scrape-results")) {
  scrapeResults();
}
