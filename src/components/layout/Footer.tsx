import Link from "next/link";
import { navItems } from "@/components/layout/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";

const categoryLinks = navItems.filter((item) => item.href !== "/");

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl font-extrabold">
              <span className="text-secondary">QORI</span>SPORTS
            </h3>
            <p className="mt-3 text-sm text-white/85">
              La reference de l&apos;actualite sportive beninoise et africaine
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {categoryLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-opacity hover:opacity-80">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Suivez-nous</h4>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FacebookIcon className="h-5 w-5 transition-opacity hover:opacity-80" />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noreferrer"
              >
                <XIcon className="h-5 w-5 transition-opacity hover:opacity-80" />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon className="h-5 w-5 transition-opacity hover:opacity-80" />
              </Link>
              <Link
                href="https://youtube.com"
                aria-label="Youtube"
                target="_blank"
                rel="noreferrer"
              >
                <YouTubeIcon className="h-5 w-5 transition-opacity hover:opacity-80" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <a
              href="mailto:contact@qorisports.com"
              className="mt-3 inline-block text-sm text-white/85 transition-opacity hover:opacity-80"
            >
              contact@qorisports.com
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/30 pt-4 text-sm text-white/80 md:flex md:items-center md:justify-between">
          <p>2026 Qorisports. Tous droits reserves.</p>
          <p className="mt-2 md:mt-0">Realise par Maxaldo</p>
        </div>
      </div>
    </footer>
  );
}
