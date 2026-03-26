"use client";

import { Menu, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchModal } from "@/components/ui/SearchModal";
import { navItems } from "@/components/layout/navigation";
import { useTheme } from "@/lib/useTheme";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow dark:bg-gray-900 ${
          hasShadow ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight"
          >
            <span className="text-secondary">QORI</span>
            <span className="text-primary dark:text-gray-100">SPORTS</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-text-primary transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-white"
              >
                {item.color ? (
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                ) : null}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-md p-2 text-primary transition-colors hover:bg-surface dark:text-gray-300 dark:hover:bg-gray-800"
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
              className="rounded-md p-2 text-primary transition-colors hover:bg-surface dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              aria-label="Ouvrir le menu mobile"
              onClick={() => setIsOpen(true)}
              className="rounded-md p-2 text-primary transition-colors hover:bg-surface md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
