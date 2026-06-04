import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { BROWSER_OPTIONS, OUTPUT_DIR, URL_CLASSEMENT, USER_AGENT } from "./config.js";
import type { StandingRow } from "./types.js";

const DEBUG_DIR = path.resolve(process.cwd(), "scraper", "debug-html");

function saveDebugHtml(html: string, filename: string): void {
  fs.mkdirSync(DEBUG_DIR, { recursive: true });
  fs.writeFileSync(path.join(DEBUG_DIR, filename), html, "utf-8");
  console.log(`[DEBUG] HTML sauvegarde dans ${path.join(DEBUG_DIR, filename)}`);
}

export async function scrapeStandings(): Promise<StandingRow[]> {
  console.log("[Classement] Lancement du navigateur...");
  const browser = await puppeteer.launch(BROWSER_OPTIONS);

  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({ width: 1280, height: 900 });

    console.log("[Classement] Navigation vers", URL_CLASSEMENT);
    await page.goto(URL_CLASSEMENT, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));

    // Accepter les cookies
    try {
      await page.click("#onetrust-accept-btn-handler");
      console.log("[Classement] Cookies acceptes");
      await new Promise((r) => setTimeout(r, 2000));
    } catch {}

    // Attendre le rendu du tableau
    console.log("[Classement] Attente du rendu du tableau...");
    try {
      await page.waitForSelector(".ui-table__body .ui-table__row", { timeout: 15000 });
      console.log("[Classement] Tableau detecte");
    } catch {
      console.log("[Classement] Tableau non detecte, attente supplementaire...");
      await new Promise((r) => setTimeout(r, 5000));
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Extraction via string JS pure (evite le bug __name de tsx)
    const data = await page.evaluate(`
      (function() {
        var rows = [];
        var tableRows = document.querySelectorAll('.ui-table__body .ui-table__row');

        for (var i = 0; i < tableRows.length; i++) {
          var row = tableRows[i];

          // Nom de l'equipe
          var nameEl = row.querySelector('.tableCellParticipant__name');
          if (!nameEl) continue;
          var team = (nameEl.textContent || '').trim();
          if (!team) continue;

          // Logo de l'equipe
          var logoEl = row.querySelector('.tableCellParticipant__image img') ||
                       row.querySelector('.participant__image') ||
                       row.querySelector('[class*="participantImage"] img') ||
                       row.querySelector('img');
          var logo = '';
          if (logoEl) {
            logo = logoEl.getAttribute('src') || logoEl.getAttribute('data-src') || '';
          }

          // Valeurs numeriques (MJ, V, N, D)
          var valueCells = row.querySelectorAll('.table__cell--value');
          var vals = [];
          for (var j = 0; j < valueCells.length; j++) {
            var txt = (valueCells[j].textContent || '').trim();
            var n = parseInt(txt, 10);
            if (!isNaN(n)) vals.push(n);
          }

          // Buts : cellule "28:13" dans table__cell--score
          var goalsFor = 0;
          var goalsAgainst = 0;
          var scoreCell = row.querySelector('.table__cell--score');
          if (scoreCell) {
            var scoreText = (scoreCell.textContent || '').trim();
            var goalParts = scoreText.split(':');
            if (goalParts.length === 2) {
              goalsFor = parseInt(goalParts[0], 10) || 0;
              goalsAgainst = parseInt(goalParts[1], 10) || 0;
            }
          }

          // Difference de buts
          var diff = 0;
          var diffCell = row.querySelector('.table__cell--goalsForAgainstDiff');
          if (diffCell) {
            diff = parseInt((diffCell.textContent || '').trim(), 10) || 0;
          }

          // Points
          var pts = 0;
          var ptsCell = row.querySelector('.table__cell--points');
          if (ptsCell) {
            pts = parseInt((ptsCell.textContent || '').trim(), 10) || 0;
          }

          // Forme : V = Victoire (Win), N = Nul (Draw), D = Defaite (Loss)
          var formIcons = row.querySelectorAll('.table__cell--form .tableCellFormIcon');
          var form = [];
          for (var k = 0; k < formIcons.length && k < 5; k++) {
            var iconText = (formIcons[k].textContent || '').trim().toUpperCase();
            if (iconText === 'V') form.push('W');
            else if (iconText === 'N') form.push('D');
            else if (iconText === 'D') form.push('L');
          }

          if (vals.length >= 4) {
            rows.push({
              position: i + 1,
              team: team,
              logo: logo,
              played: vals[0],
              won: vals[1],
              drawn: vals[2],
              lost: vals[3],
              goalsFor: goalsFor,
              goalsAgainst: goalsAgainst,
              goalDifference: diff,
              points: pts,
              form: form
            });
          }
        }

        return rows;
      })()
    `);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("[Classement] Aucune equipe trouvee dans le DOM.");
      const html = await page.content();
      console.log("[Classement] Extrait du HTML (500 premiers chars) :");
      console.log(html.substring(0, 500));
      saveDebugHtml(html, "standings-debug.html");
      await browser.close();
      return [];
    }

    await browser.close();

    const standings = data as StandingRow[];

    // Sauvegarde
    const outputPath = path.join(OUTPUT_DIR, "standings-data.json");
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(standings, null, 2), "utf-8");

    console.log(`[Classement] ${standings.length} equipes recuperees -> ${outputPath}`);
    return standings;
  } catch (error) {
    console.error("[Classement] Erreur :", error);
    try {
      const pages = await browser.pages();
      if (pages.length > 0) {
        const html = await pages[0].content();
        saveDebugHtml(html, "standings-debug.html");
      }
    } catch {}
    await browser.close().catch(() => {});
    return [];
  }
}

// Execution directe
const scriptName = process.argv[1] || "";
if (scriptName.includes("scrape-standings")) {
  scrapeStandings();
}
