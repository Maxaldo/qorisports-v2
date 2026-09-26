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
  // Telechargement direct de l'APK. Chemin relatif volontairement : il reste
  // sur la meme origine que le site, condition pour que l'attribut "download"
  // soit pris en compte par le navigateur.
  // Vert exact du logo QoriSports (echantillonne dans public/QORISLIVE.png) ;
  // le jaune reste reserve au Coin des Parieurs.
  {
    label: "Télécharger QorisLive",
    href: "/apps/qorislive-1.0.0.apk",
    color: "#58A22C",
    download: true,
  },
  { label: "Coin des Parieurs", href: "/coin-des-parieurs", color: "#CA8A04" },
];
