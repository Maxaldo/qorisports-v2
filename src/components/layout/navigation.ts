export interface NavItem {
  label: string;
  href: string;
  color?: string;
  // Petite pastille affichee a cote du libelle (ex. "Bientot").
  badge?: string;
  // true : lien de telechargement direct (balise <a download>) et non une
  // navigation interne.
  download?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Football", href: "/categorie/football", color: "#16A34A" },
  { label: "Basketball", href: "/categorie/basketball", color: "#EA580C" },
  { label: "Handball", href: "/categorie/handball", color: "#2563EB" },
  { label: "Volleyball", href: "/categorie/volleyball", color: "#0891B2" },
  { label: "Athletisme", href: "/categorie/athletisme", color: "#DC2626" },
  { label: "Autres", href: "/categorie/autres", color: "#7C3AED" },
  { label: "Matchs", href: "/matchs", color: "#16A34A" },
  { label: "Coin des Parieurs", href: "/coin-des-parieurs", color: "#CA8A04" },
  // Pour remettre le telechargement de l'APK, reinserer ici :
  // {
  //   label: "Télécharger QorisLive",
  //   href: "<url de l'APK>",
  //   color: "#58A22C",   // vert du logo ; le jaune reste au Coin des Parieurs
  //   download: true,
  // },
  // Le rendu <a download> est deja en place dans Navbar et MobileMenu.
  // Attention : au-dela de 8 entrees, la barre horizontale deborde sous
  // 1280px — il faudra repasser ses points de rupture de "lg" a "xl".
];
