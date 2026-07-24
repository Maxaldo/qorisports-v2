"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/components/layout/navigation";
import { CategoryIcon } from "@/components/layout/CategoryIcon";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Overlay sombre anime separement */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel du menu qui glisse depuis la droite */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-primary text-white md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={onClose}>
                  <Image
                    src="/logo.png"
                    alt="Qorisports"
                    width={130}
                    height={36}
                    className="h-8 w-auto brightness-110 contrast-110"
                  />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer le menu"
                  className="rounded-md p-2 transition-colors hover:bg-white/10"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-4 text-xl font-semibold"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${item.color ?? "#94A3B8"}22`,
                          color: item.color ?? "#E2E8F0",
                        }}
                      >
                        <CategoryIcon label={item.label} className="h-5 w-5" />
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
