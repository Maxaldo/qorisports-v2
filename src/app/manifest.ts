import type { MetadataRoute } from "next";

// Manifeste PWA : permet d'installer Qorisports sur l'ecran d'accueil
// (mobile et desktop) et de l'ouvrir en plein ecran comme une appli.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qorisports — Actualité sportive béninoise",
    short_name: "Qorisports",
    description:
      "Toute l'actualité sportive béninoise et africaine : football, basketball, handball, volleyball, athlétisme et plus.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    lang: "fr",
    categories: ["news", "sports"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
