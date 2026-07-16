import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { WHATSAPP_CHANNEL_URL } from "@/lib/site-config";

// Bouton flottant WhatsApp, visible sur toutes les pages.
// Place au-dessus du bouton ScrollToTop (bottom-6) pour ne pas le chevaucher.
export function WhatsAppFloatButton() {
  return (
    <a
      href={WHATSAPP_CHANNEL_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Rejoindre la chaîne WhatsApp de Qorisports"
      className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1FBE5A] md:pr-5"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold md:inline">
        Rejoindre la chaîne
      </span>
    </a>
  );
}
