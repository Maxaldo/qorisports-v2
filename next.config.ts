import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  // Redirections 301 des anciennes URLs WordPress vers la nouvelle structure.
  // Indispensable pour conserver le referencement Google acquis.
  async redirects() {
    return [
      // Anciennes categories WP encore valables : /category/football -> /categorie/football
      {
        source:
          "/category/:slug(football|basketball|handball|volleyball|athletisme|autres)",
        destination: "/categorie/:slug",
        permanent: true,
      },
      // Toutes les autres anciennes categories (can-2025, cnos-ben, boxe...) -> Autres
      {
        source: "/category/:path*",
        destination: "/categorie/autres",
        permanent: true,
      },
      // Tags, auteurs, archives par date, flux RSS -> accueil
      { source: "/tag/:path*", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/:year(\\d{4})/:path*", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      // Pages d'attachement WP : /mon-article/1-3/ -> /article/mon-article
      {
        source: "/:slug([a-z0-9-]+)/:sub(\\d+-\\d+)",
        destination: "/article/:slug",
        permanent: true,
      },
      // Permaliens WP /%postname%/ : /mon-article -> /article/mon-article
      // (exclut les vraies pages du site et les fichiers)
      {
        source:
          "/:slug((?!article$|categorie$|matchs$|classement$|coin-des-parieurs$|a-propos$|api$|category$|wp-admin$|wp-login|wp-content$)[a-z0-9]+(?:-[a-z0-9]+)+)",
        destination: "/article/:slug",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["10.5.0.2", "192.168.1.178"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qorisports.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "static.flashscore.com",
      },
      {
        protocol: "https",
        hostname: "www.flashscore.com",
      },
      {
        protocol: "https",
        hostname: "www.flashscore.fr",
      },
      {
        protocol: "https",
        hostname: "static.fssta.com",
      },
    ],
  },
};

export default nextConfig;
