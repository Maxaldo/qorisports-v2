import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { BROWSER_OPTIONS, OUTPUT_DIR, URL_MATCHS, USER_AGENT } from "./config.js";
import type { UpcomingMatch } from "./types.js";

const DEBUG_DIR = path.resolve(process.cwd(), "scraper", "debug-html");
// On recupere tous les matchs de la prochaine journee

function saveDebugHtml(html: string, filename: string): void {
  fs.mkdirSync(DEBUG_DIR, { recursive: true });
  fs.writeFileSync(path.join(DEBUG_DIR, filename), html, "utf-8");
  console.log(`[DEBUG] HTML sauvegarde dans ${path.join(DEBUG_DIR, filename)}`);
}

export async function scrapeFixtures(): Promise<UpcomingMatch[]> {
  console.log("[Calendrier] Lancement du navigateur...");
  const browser = await puppeteer.launch(BROWSER_OPTIONS);

  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({ width: 1280, height: 900 });

    console.log("[Calendrier] Navigation vers", URL_MATCHS);
    await page.goto(URL_MATCHS, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));

    // Accepter les cookies
    try {
      await page.click("#onetrust-accept-btn-handler");
      console.log("[Calendrier] Cookies acceptes");
      await new Promise((r) => setTimeout(r, 2000));
    } catch {}

    // Attendre le rendu des matchs
    console.log("[Calendrier] Attente du rendu des matchs...");
    try {
      await page.waitForSelector("[class*='event__match']", { timeout: 15000 });
      console.log("[Calendrier] Matchs detectes");
    } catch {
      console.log("[Calendrier] Matchs non detectes, attente supplementaire...");
      await new Promise((r) => setTimeout(r, 5000));
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Extraction via string JS pure (evite le bug __name de tsx)
    const data = await page.evaluate(`
      (function() {
        var fixtures = [];
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

          // Logos des equipes (img dans le participant ou dans le container parent)
          var homeLogoEl = homeEl.querySelector('img') || el.querySelector('[class*="homeParticipant"] img');
          var awayLogoEl = awayEl.querySelector('img') || el.querySelector('[class*="awayParticipant"] img');
          var homeLogo = homeLogoEl ? (homeLogoEl.getAttribute('src') || '') : '';
          var awayLogo = awayLogoEl ? (awayLogoEl.getAttribute('src') || '') : '';

          // Verifier qu'il n'y a pas de score
          var scoreHomeEl = el.querySelector('[class*="event__score--home"]');
          var scoreAwayEl = el.querySelector('[class*="event__score--away"]');
          var sHome = scoreHomeEl ? (scoreHomeEl.textContent || '').trim() : '-';
          var sAway = scoreAwayEl ? (scoreAwayEl.textContent || '').trim() : '-';
          var homeNum = parseInt(sHome, 10);
          var awayNum = parseInt(sAway, 10);
          if (!isNaN(homeNum) && !isNaN(awayNum)) continue;

          // Date et heure
          var timeEl = el.querySelector('[class*="event__time"]');
          var timeText = timeEl ? (timeEl.textContent || '').trim() : '';
          var parts = timeText.split(/\\s+/);
          var dateStr = (parts[0] || '').replace(/\\.$/, '');
          var rawTime = parts[1] || '';
          var timeMatch = rawTime.match(/^(\\d{1,2}:\\d{2})/);
          var timeStr = timeMatch ? timeMatch[1] : rawTime;

          fixtures.push({
            id: 'f-' + (fixtures.length + 1),
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeLogo: homeLogo,
            awayLogo: awayLogo,
            date: dateStr,
            time: timeStr,
            status: 'upcoming',
            matchday: currentRound
          });
        }

        return fixtures;
      })()
    `);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("[Calendrier] Aucun match a venir trouve dans le DOM.");
      const html = await page.content();
      console.log("[Calendrier] Extrait du HTML (500 premiers chars) :");
      console.log(html.substring(0, 500));
      saveDebugHtml(html, "fixtures-debug.html");
      await browser.close();
      return [];
    }

    await browser.close();

    const allFixtures = data as UpcomingMatch[];

    // Garder uniquement les matchs de la premiere journee (la prochaine)
    const firstRound = allFixtures.length > 0 ? allFixtures[0].matchday : "";
    const fixtures = firstRound
      ? allFixtures.filter((m) => m.matchday === firstRound)
      : allFixtures;

    // Sauvegarde
    const outputPath = path.join(OUTPUT_DIR, "fixtures-data.json");
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(fixtures, null, 2), "utf-8");

    console.log(`[Calendrier] ${fixtures.length} matchs a venir recuperes -> ${outputPath}`);
    return fixtures;
  } catch (error) {
    console.error("[Calendrier] Erreur :", error);
    try {
      const pages = await browser.pages();
      if (pages.length > 0) {
        const html = await pages[0].content();
        saveDebugHtml(html, "fixtures-debug.html");
      }
    } catch {}
    await browser.close().catch(() => {});
    return [];
  }
}

// Execution directe
const scriptName = process.argv[1] || "";
if (scriptName.includes("scrape-fixtures")) {
  scrapeFixtures();
}
