"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/components/layout/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          className="fixed inset-0 z-50 bg-primary text-white md:hidden"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <div className="flex h-full flex-col px-6 py-6">
            <div className="flex items-center justify-end">
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 text-2xl font-semibold"
                >
                  {item.color ? (
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
