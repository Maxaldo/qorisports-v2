import { categories } from "@/data/mock-articles";

export interface NavItem {
  label: string;
  href: string;
  color?: string;
}

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Football",
    href: "/categorie/football",
    color: categories.find((category) => category.slug === "football")?.color,
  },
  {
    label: "Basketball",
    href: "/categorie/basketball",
    color: categories.find((category) => category.slug === "basketball")?.color,
  },
  {
    label: "Handball",
    href: "/categorie/handball",
    color: categories.find((category) => category.slug === "handball")?.color,
  },
  {
    label: "Athletisme",
    href: "/categorie/athletisme",
    color: categories.find((category) => category.slug === "athletisme")?.color,
  },
  {
    label: "Autres",
    href: "/categorie/autres",
    color: categories.find((category) => category.slug === "autres")?.color,
  },
  {
    label: "Coin des Parieurs",
    href: "/categorie/coin-des-parieurs",
    color: categories.find((category) => category.slug === "coin-des-parieurs")?.color,
  },
];
