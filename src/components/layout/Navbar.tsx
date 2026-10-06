"use client";

import Image from "next/image";
import { Download, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navItems } from "@/components/layout/navigation";
import { SearchModal } from "@/components/ui/SearchModal";
import { useTheme } from "@/lib/useTheme";

// Entrees affichees en pastille coloree plutot qu'en onglet de la barre.
const PILL_HREFS = new Set([
  "/apps/qorislive-1.0.0.apk",
  "/coin-des-parieurs",
]);

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Ombre discrete une fois la page scrollee.
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasShadow(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Astuce top negatif : la barre logo (64px) defile naturellement,
          le menu de navigation reste colle en haut. Aucune animation de
          hauteur = aucun tremblement. */}
      <div
        className={`sticky top-[-64px] z-50 transition-shadow duration-300 ${
          hasShadow ? "shadow-md" : ""
        }`}
      >
        {/* Niveau 1 — Barre principale (defile avec la page) */}
        <header className="h-16 border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Qorisports"
                width={280}
                height={64}
                className="h-25 w-auto dark:brightness-110 dark:contrast-110"
                priority
              />
            </Link>

            {/* Actions droite */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Rechercher"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-md p-2 text-gray-500 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-gray-100"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label={
                  theme === "light"
                    ? "Activer le mode sombre"
                    : "Activer le mode clair"
                }
                onClick={toggleTheme}
                className="rounded-md p-2 text-gray-500 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-gray-100"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              {/* Hamburger anime : 3 barres -> X */}
              <button
                type="button"
                aria-label={
                  isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
                }
                onClick={() => setIsMenuOpen((v) => !v)}
                className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
              >
                <span
                  className={`block h-[2px] w-[18px] rounded-full bg-gray-600 transition-all duration-300 dark:bg-gray-300 ${
                    isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-[18px] rounded-full bg-gray-600 transition-all duration-300 dark:bg-gray-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-[18px] rounded-full bg-gray-600 transition-all duration-300 dark:bg-gray-300 ${
                    isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Niveau 2 — Barre de navigation sombre (reste collee en haut) */}
        {/* 8 entrees : la barre tient a partir de lg. Si on en ajoute une
            avec un libelle long, elle debordera — passer alors a "xl", ici
            comme sur le bouton hamburger et le MobileMenu. */}
        <nav className="hidden bg-primary lg:block">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
            {navItems.map((item, i) => {
              const active = isActive(item.href);
              const isBetting = item.href === "/coin-des-parieurs";

              // Telechargement direct : balise <a download>, pas un <Link>.
              // Pastille verte (vert du logo) pour se demarquer sans empieter
              // sur le jaune du Coin des Parieurs.
              if (item.download) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    download
                    className="ml-1 flex h-7 items-center gap-1.5 rounded bg-[#58A22C] px-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#467F22]"
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </a>
                );
              }

              if (isBetting) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`ml-1 flex h-7 items-center rounded px-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors ${
                      active
                        ? "bg-[#A16207]"
                        : "bg-[#CA8A04] hover:bg-[#A16207]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-full items-center px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    // Pas de separateur juste avant une pastille (QorisLive,
                    // Coin des Parieurs) ni sur le dernier element.
                    i < navItems.length - 1 && !PILL_HREFS.has(navItems[i + 1].href)
                      ? "border-r border-white/20"
                      : ""
                  } ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span
                      className="absolute bottom-0 left-0 h-[3px] w-full"
                      style={{
                        backgroundColor: item.color ?? "#84CC16",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
