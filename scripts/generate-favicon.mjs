// Fond blanc + carre 512px, puis generation favicon.ico pour Next.js (app/favicon.ico).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public", "favicon.png");

// Transparence remplie en blanc, image centree dans un carre (meilleur rendu en favicon).
const flattened = await sharp(pngPath)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png()
  .toBuffer();

fs.writeFileSync(pngPath, flattened);

const ico = await pngToIco(flattened);
fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico);
fs.writeFileSync(path.join(root, "src", "app", "favicon.ico"), ico);
console.log("favicon.png (fond blanc), favicon.ico -> public/ et src/app/");
