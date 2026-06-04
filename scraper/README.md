# Scraper Flashscore - Ligue 1 Beninoise

Scraper Puppeteer pour recuperer les donnees de la Ligue 1 beninoise de football depuis Flashscore.

## Donnees recuperees

- **Classement** : position, equipe, matchs joues, victoires, nuls, defaites, buts, forme recente
- **Resultats** : 10 derniers resultats (scores, equipes, journees)
- **Calendrier** : prochains matchs a venir (equipes, dates, heures)

## Installation

```bash
npm install puppeteer cheerio
npm install -D @types/cheerio tsx
```

## Utilisation

### Lancer tout le scraping

```bash
npm run scrape
```

### Lancer un scraper individuel

```bash
npm run scrape:standings   # Classement uniquement
npm run scrape:results     # Resultats uniquement
npm run scrape:fixtures    # Calendrier uniquement
```

### Execution manuelle avec tsx

```bash
npx tsx scraper/index.ts
```

## Fichiers de sortie

Les donnees sont sauvegardees dans `src/data/` :

| Fichier | Contenu |
|---------|---------|
| `standings-data.json` | Classement complet |
| `results-data.json` | Derniers resultats |
| `fixtures-data.json` | Matchs a venir |
| `last-update.json` | Timestamp de derniere MAJ |

## Programmation CRON

Pour mettre a jour automatiquement les donnees :

```bash
# Toutes les 6 heures
0 */6 * * * cd /chemin/vers/qorisports-v2 && npm run scrape >> /var/log/qorisports-scrape.log 2>&1

# Tous les jours a 6h du matin
0 6 * * * cd /chemin/vers/qorisports-v2 && npm run scrape >> /var/log/qorisports-scrape.log 2>&1
```

Sur Windows (Planificateur de taches) :
1. Ouvrir le Planificateur de taches
2. Creer une tache de base
3. Declencheur : tous les jours a 6h
4. Action : demarrer `npm.cmd` avec argument `run scrape` dans le dossier du projet

## Avertissement

Le scraping de sites web se situe dans une zone grise legale. Utilisez ce scraper de maniere responsable :
- Ne lancez pas le scraping trop frequemment (max 2-3 fois par jour)
- Respectez les conditions d'utilisation de Flashscore
- Les donnees recuperees sont destinees a un usage personnel / editorial
- Flashscore peut modifier sa structure HTML a tout moment, ce qui peut casser le scraper
