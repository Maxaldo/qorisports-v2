import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { TopBar } from "@/components/layout/TopBar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { WhatsAppFloatButton } from "@/components/whatsapp/WhatsAppFloatButton";
import { WhatsAppPopup } from "@/components/whatsapp/WhatsAppPopup";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
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
  // Domaine canonique : sert de base aux URLs Open Graph, canonical, etc.
  metadataBase: new URL("https://www.qorisports.com"),
  alternates: {
    canonical: "./",
  },
  // Validation Google Search Console
  verification: {
    google: "mJlHQslExksEDIcElTuha3yJ8vTSttARtQeGnMYzam4",
  },
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
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Qorisports",
  },
  twitter: {
    card: "summary_large_image",
  },
  // PWA : nom affiche une fois installe + icone Apple
  applicationName: "Qorisports",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qorisports",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
};

// Donnees structurees globales : identite du site (logo + nom) pour Google.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.qorisports.com/#organization",
      name: "Qorisports",
      alternateName: "QoriSport",
      url: "https://www.qorisports.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.qorisports.com/favicon.png",
        width: 512,
        height: 512,
      },
      sameAs: ["https://www.facebook.com/QorisportsBenin/"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.qorisports.com/#website",
      name: "Qorisports",
      alternateName: "QoriSport",
      url: "https://www.qorisports.com",
      publisher: { "@id": "https://www.qorisports.com/#organization" },
      inLanguage: "fr",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <TopBar />
        <Navbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFloatButton />
        <WhatsAppPopup />
        <ScrollToTop />
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
