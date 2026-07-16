"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { WHATSAPP_CHANNEL_URL } from "@/lib/site-config";

// Popup d'invitation a rejoindre la chaine WhatsApp.
// Declencheur : apres 10 secondes OU des que le visiteur scrolle ~40% de la page
// (le premier des deux). Memorise dans localStorage :
//  - clic "Rejoindre"  -> ne reapparait plus jamais
//  - clic "Non merci"  -> reapparait apres 7 jours
const JOINED_KEY = "qs-wa-joined";
const DISMISSED_KEY = "qs-wa-dismissed-at";
const DISMISS_DAYS = 7;
const DELAY_MS = 10_000;
const SCROLL_RATIO = 0.4;

function canShow(): boolean {
  try {
    if (localStorage.getItem(JOINED_KEY)) return false;
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function WhatsAppPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!canShow()) return;

    let triggered = false;
    function trigger() {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      cleanup();
    }

    function handleScroll() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SCROLL_RATIO) trigger();
    }

    const timer = setTimeout(trigger, DELAY_MS);
    window.addEventListener("scroll", handleScroll, { passive: true });

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    }
    return cleanup;
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  }

  function join() {
    try {
      localStorage.setItem(JOINED_KEY, "1");
    } catch {}
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Rejoindre la chaîne WhatsApp"
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bandeau logo : contraste inverse du theme.
                Mode clair -> fond bleu nuit | Mode dark -> fond blanc */}
            <div className="relative h-28 w-full bg-[#0A1533] dark:bg-white">
              <Image
                src="/logo.png"
                alt="Qorisports"
                fill
                sizes="448px"
                className="object-cover"
                priority
              />
              <button
                type="button"
                aria-label="Fermer"
                onClick={dismiss}
                className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white dark:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-200 dark:hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Badge WhatsApp a cheval sur le bandeau */}
            <div className="relative -mt-7 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-white dark:ring-gray-900">
                <WhatsAppIcon className="h-8 w-8" />
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 text-center">
              <h2 className="text-xl font-display font-bold text-text-primary dark:text-gray-100">
                Rejoignez notre chaîne
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-text-secondary dark:text-gray-400">
                Recevez en direct sur WhatsApp toute l&apos;actualité sportive
                béninoise et africaine de Qorisports.
              </p>

              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                onClick={join}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow transition-all hover:scale-[1.02] hover:bg-[#1FBE5A]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Rejoindre la chaîne WhatsApp
              </a>

              <button
                type="button"
                onClick={dismiss}
                className="mt-3 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              >
                Non merci
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
