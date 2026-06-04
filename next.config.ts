import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
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
