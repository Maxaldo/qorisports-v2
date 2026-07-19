import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";
import { WHATSAPP_CHANNEL_URL } from "@/lib/site-config";

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
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1FBE5A] to-[#25D366] py-0.5 pl-0.5 pr-3 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.simpleicons.org/whatsapp/25D366"
                alt=""
                className="h-3.5 w-3.5"
              />
            </span>
            Rejoindre la chaîne
          </a>
          <span className="h-4 w-px bg-white/30" aria-hidden="true" />
          <Link
            href="https://www.facebook.com/QorisportsBenin/"
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
