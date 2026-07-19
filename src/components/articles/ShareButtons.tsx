"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

// Boutons de partage ronds avec les vraies icones officielles des reseaux
// (glyphes officiels servis par cdn.simpleicons.org).
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const round =
    "flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-text-secondary dark:text-gray-400">
        Partager :
      </span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Partager sur Facebook"
        className={`${round} bg-[#1877F2]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.simpleicons.org/facebook/ffffff"
          alt=""
          className="h-5 w-5"
        />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Partager sur X"
        className={`${round} bg-black dark:bg-gray-700`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.simpleicons.org/x/ffffff"
          alt=""
          className="h-4 w-4"
        />
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Partager sur WhatsApp"
        className={`${round} bg-[#25D366]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.simpleicons.org/whatsapp/ffffff"
          alt=""
          className="h-5 w-5"
        />
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copier le lien"
        className={`${round} ${copied ? "bg-green-600" : "bg-gray-500 dark:bg-gray-600"} text-white`}
      >
        {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
      </button>

      {copied && (
        <span className="text-xs font-medium text-green-600">Copié !</span>
      )}
    </div>
  );
}
