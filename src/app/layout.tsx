import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TopBar } from "@/components/layout/TopBar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Qorisports — La reference de l'actualite sportive",
    template: "%s | Qorisports",
  },
  description:
    "Toute l'actualite sportive beninoise et africaine : football, basketball, handball, athletisme et plus encore.",
  // favicon.ico dans src/app/ est la methode officielle Next.js ; PNG pour Apple / haute resolution.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Qorisports",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-body bg-surface text-text-primary antialiased dark:bg-gray-950 dark:text-gray-100">
        <TopBar />
        <Navbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
