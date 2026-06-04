"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur page :", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Oups, une erreur est survenue
      </h2>
      <p className="max-w-md text-gray-600 dark:text-gray-400">
        {error.message || "Un probleme inattendu s'est produit."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
      >
        Reessayer
      </button>
    </div>
  );
}
