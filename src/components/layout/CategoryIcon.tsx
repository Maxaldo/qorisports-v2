import {
  CalendarDays,
  Coins,
  Footprints,
  Home,
  Shapes,
  Volleyball,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// Icone par categorie pour le menu mobile.
// lucide n'a pas de ballon de foot/basket/handball : on les dessine en SVG
// (style contour, currentColor pour prendre la couleur de la categorie).

type IconProps = SVGProps<SVGSVGElement>;

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FootballIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.2l3.4 2.5-1.3 4h-4.2l-1.3-4z" />
      <path d="M12 8.2V4M15.4 10.7l3.2-1.6M14.1 14.7l1.9 3.1M9.9 14.7l-1.9 3.1M8.6 10.7L5.4 9.1" />
    </svg>
  );
}

function BasketballIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
      <path d="M5.6 5.6a12.7 12.7 0 0 1 0 12.8M18.4 5.6a12.7 12.7 0 0 0 0 12.8" />
    </svg>
  );
}

function HandballIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c2.5 3 2.5 15 0 18M6 6c3 2 9 2 12 0M6 18c3-2 9-2 12 0" />
    </svg>
  );
}

type IconComp = ComponentType<{ className?: string }>;

const MAP: Record<string, IconComp> = {
  accueil: Home,
  football: FootballIcon,
  basketball: BasketballIcon,
  handball: HandballIcon,
  volleyball: Volleyball,
  athletisme: Footprints,
  autres: Shapes,
  matchs: CalendarDays,
};

export function CategoryIcon({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const key = label.toLowerCase();
  const Icon: IconComp = key.includes("parieur")
    ? Coins
    : MAP[key] ?? Shapes;
  return <Icon className={className} />;
}
