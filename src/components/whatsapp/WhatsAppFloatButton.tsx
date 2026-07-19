import { WHATSAPP_CHANNEL_URL } from "@/lib/site-config";

// Bouton flottant WhatsApp, visible sur toutes les pages.
// Icone officielle (Simple Icons) dans une pastille blanche, pilule verte
// en degrade avec ombre coloree. Place au-dessus du bouton ScrollToTop.
export function WhatsAppFloatButton() {
  return (
    <a
      href={WHATSAPP_CHANNEL_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Rejoindre la chaîne WhatsApp de Qorisports"
      className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1FBE5A] to-[#25D366] py-1.5 pl-1.5 pr-1.5 text-white shadow-md shadow-[#25D366]/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#25D366]/50 md:pr-4"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.simpleicons.org/whatsapp/25D366"
          alt=""
          className="h-5 w-5"
        />
      </span>
      <span className="hidden text-xs font-bold md:inline">
        Rejoindre la chaîne
      </span>
    </a>
  );
}
