interface BadgeProps {
  label: string;
  color: string;
}

// Badge colore pour les categories (texte de la couleur, fond a 10% d'opacite).
export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{
        color,
        backgroundColor: `${color}1a`,
      }}
    >
      {label}
    </span>
  );
}
