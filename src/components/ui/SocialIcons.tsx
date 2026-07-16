import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// Icône Facebook en SVG inline.
export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.5 8.5H16V6h-2c-2.2 0-3.5 1.3-3.5 3.7V12H8v2.5h2.5V21h2.7v-6.5H16L16.4 12h-3.2V9.9c0-.8.4-1.4 1.3-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Icône X (Twitter) en SVG inline.
export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M18.9 3H21l-4.6 5.2L22 21h-4.4l-3.4-4-3.6 4H8.5l4.9-5.6L8 3h4.5l3.1 3.7L18.9 3Zm-1.5 16h1.2L11.8 5H10.5l6.9 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Icône Instagram en SVG inline.
export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Icône WhatsApp en SVG inline.
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.1 14.9l-.4-.2-2.6.7.7-2.5-.3-.5A8 8 0 0 1 12 4Zm-3 4.2c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.6 8.6c-.2-.4-.4-.4-.6-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Icône YouTube en SVG inline.
export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="currentColor" />
      <path d="M10 9.3v5.4l4.8-2.7L10 9.3Z" fill="#0F172A" />
    </svg>
  );
}
