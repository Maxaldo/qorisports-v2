import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Qorisports — La référence de l'actualité sportive",
  description:
    "Toute l'actualité sportive béninoise et africaine : football, basketball, handball, athlétisme et plus encore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen font-body bg-surface text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
