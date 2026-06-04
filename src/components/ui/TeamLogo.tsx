"use client";

import { useState } from "react";

interface TeamLogoProps {
  src: string;
  name: string;
  size?: number;
}

// Cercle avec la premiere lettre du nom, utilise comme fallback.
function LetterFallback({ name, size }: { name: string; size: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {name.charAt(0)}
    </span>
  );
}

// Logo d'equipe avec fallback : si l'image ne charge pas ou n'existe pas,
// affiche un cercle gris avec la premiere lettre du nom.
export function TeamLogo({ src, name, size = 20 }: TeamLogoProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <LetterFallback name={name} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 object-contain"
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
