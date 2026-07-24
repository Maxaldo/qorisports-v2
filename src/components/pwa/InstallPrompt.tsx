"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

// Bandeau d'installation de la PWA.
// - Android/Chrome : capture l'evenement natif beforeinstallprompt et propose
//   un bouton "Installer" qui ouvre la vraie fenetre d'installation.
// - iPhone/Safari : pas d'API d'install, on affiche la marche a suivre manuelle.
// Memorise le refus/installation pour ne pas reapparaitre a chaque visite.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "qs-pwa-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }

    // Deja installe (mode standalone) -> ne rien afficher
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - propriete iOS non standard
      window.navigator.standalone === true;
    if (standalone) return;

    // Detection iOS (iPhone/iPad Safari)
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const isSafari = ios && !/crios|fxios/.test(ua);
    if (isSafari) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    // Android / Chrome desktop : evenement natif
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    function onInstalled() {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {}
    }
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        aria-label="Fermer"
        onClick={dismiss}
        className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon-192.png"
          alt="Qorisports"
          className="h-12 w-12 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-primary dark:text-gray-100">
            Installer l&apos;appli Qorisports
          </p>
          {isIOS ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
              Touchez <Share className="inline h-3.5 w-3.5" /> puis « Sur
              l&apos;écran d&apos;accueil »
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-text-secondary dark:text-gray-400">
              Accès rapide, plein écran, comme une vraie appli.
            </p>
          )}
        </div>

        {!isIOS && (
          <button
            type="button"
            onClick={install}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 dark:bg-accent"
          >
            <Download className="h-4 w-4" />
            Installer
          </button>
        )}
      </div>
    </div>
  );
}
