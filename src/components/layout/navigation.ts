export interface NavItem {
  label: string;
  href: string;
  color?: string;
}

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Football", href: "/categorie/football", color: "#16A34A" },
  { label: "Basketball", href: "/categorie/basketball", color: "#EA580C" },
  { label: "Handball", href: "/categorie/handball", color: "#2563EB" },
  { label: "Athletisme", href: "/categorie/athletisme", color: "#DC2626" },
  { label: "Autres", href: "/categorie/autres", color: "#7C3AED" },
  { label: "Coin des Parieurs", href: "/coin-des-parieurs", color: "#CA8A04" },
];
