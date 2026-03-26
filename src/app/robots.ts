import type { MetadataRoute } from "next";

// Autorise tous les crawlers et reference le sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://qorisports.com/sitemap.xml",
  };
}
