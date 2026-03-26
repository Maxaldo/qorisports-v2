import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";

function getCurrentDateInFrench(): string {
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Met la premiere lettre en majuscule pour un rendu editorial.
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function TopBar() {
  return (
    <div className="hidden md:flex h-9 bg-primary text-white text-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
        <p>{getCurrentDateInFrench()}</p>
        <div className="flex items-center gap-3">
          <Link
            href="https://facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookIcon className="h-4 w-4 transition-opacity hover:opacity-80" />
          </Link>
          <Link
            href="https://twitter.com"
            aria-label="Twitter"
            target="_blank"
            rel="noreferrer"
          >
            <XIcon className="h-4 w-4 transition-opacity hover:opacity-80" />
          </Link>
          <Link
            href="https://instagram.com"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon className="h-4 w-4 transition-opacity hover:opacity-80" />
          </Link>
          <Link
            href="https://youtube.com"
            aria-label="Youtube"
            target="_blank"
            rel="noreferrer"
          >
            <YouTubeIcon className="h-4 w-4 transition-opacity hover:opacity-80" />
          </Link>
        </div>
      </div>
    </div>
  );
}
