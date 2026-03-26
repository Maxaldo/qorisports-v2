"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

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
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary transition-colors hover:bg-[#1877F2] hover:text-white dark:bg-gray-800 dark:text-gray-400"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M14.5 8.5H16V6h-2c-2.2 0-3.5 1.3-3.5 3.7V12H8v2.5h2.5V21h2.7v-6.5H16L16.4 12h-3.2V9.9c0-.8.4-1.4 1.3-1.4Z" />
        </svg>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Partager sur X"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary transition-colors hover:bg-black hover:text-white dark:bg-gray-800 dark:text-gray-400"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M18.9 3H21l-4.6 5.2L22 21h-4.4l-3.4-4-3.6 4H8.5l4.9-5.6L8 3h4.5l3.1 3.7L18.9 3Zm-1.5 16h1.2L11.8 5H10.5l6.9 14Z" />
        </svg>
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Partager sur WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary transition-colors hover:bg-[#25D366] hover:text-white dark:bg-gray-800 dark:text-gray-400"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4l-2-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.3-.6.1s-1.2-.4-2.2-1.4c-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.1-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6 8.8 6 10.4s1.3 3.2 1.5 3.4c.2.2 2.6 3.9 6.2 5.5.9.4 1.5.6 2.1.8.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.6 1 1-3.5-.2-.4A9.8 9.8 0 012.2 12C2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copier le lien"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary transition-colors hover:bg-accent hover:text-white dark:bg-gray-800 dark:text-gray-400"
      >
        <Link2 className="h-4 w-4" />
      </button>

      {copied && (
        <span className="text-xs font-medium text-accent">Copie !</span>
      )}
    </div>
  );
}
