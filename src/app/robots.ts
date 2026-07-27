import type { MetadataRoute } from "next";

// Autorise tous les crawlers et reference le sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // Autorise les grandes images dans les resultats : condition indispensable
    // pour apparaitre dans Google Discover et Google Actualites.
    sitemap: "https://www.qorisports.com/sitemap.xml",
  };
}
