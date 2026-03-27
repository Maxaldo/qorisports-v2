"use client";

import Image from "next/image";
import { Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navItems } from "@/components/layout/navigation";
import { SearchModal } from "@/components/ui/SearchModal";
import { useTheme } from "@/lib/useTheme";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Logique de scroll avec zone morte de 20px pour eviter les oscillations.
  const [showTopBar, setShowTopBar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const anchorY = useRef(0);
  const directionRef = useRef<"up" | "down" | null>(null);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;

      setHasShadow(y > 8);

      // En haut de page : toujours afficher le niveau 1.
      if (y <= 120) {
        setShowTopBar(true);
        anchorY.current = y;
        directionRef.current = null;
        return;
      }

      const delta = y - anchorY.current;

      // Zone morte : ignorer les micro-scrolls de moins de 20px.
      if (Math.abs(delta) < 20) return;

      if (delta > 0 && directionRef.current !== "down") {
        // Changement de direction vers le bas : masquer.
        directionRef.current = "down";
        setShowTopBar(false);
        anchorY.current = y;
      } else if (delta < 0 && directionRef.current !== "up") {
        // Changement de direction vers le haut : afficher.
        directionRef.current = "up";
        setShowTopBar(true);
        anchorY.current = y;
      }
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
      <div
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          hasShadow ? "shadow-md" : ""
        }`}
      >
        {/* Niveau 1 — Barre principale, se replie au scroll vers le bas */}
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            showTopBar ? "max-h-16" : "max-h-0"
          }`}
        >
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
        </div>

        {/* Niveau 2 — Barre de navigation sombre */}
        <nav className="hidden bg-primary lg:block">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
            {navItems.map((item, i) => {
              const active = isActive(item.href);
              const isBetting = item.href === "/coin-des-parieurs";

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
                    i < navItems.length - 2
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
