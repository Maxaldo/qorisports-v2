interface BadgeProps {
  label: string;
  color: string;
}

// Badge categorie : texte colore sur fond blanc, lisible sur les photos.
export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="inline-block rounded bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm"
      style={{ color }}
    >
      {label}
    </span>
  );
}
