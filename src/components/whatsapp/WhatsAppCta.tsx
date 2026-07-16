import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { WHATSAPP_CHANNEL_URL } from "@/lib/site-config";

// Bandeau d'appel a l'action WhatsApp, affiche apres chaque article.
export function WhatsAppCta() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-xl bg-gradient-to-r from-[#128C4B] to-[#25D366] p-6 text-center text-white sm:flex-row sm:text-left">
      <WhatsAppIcon className="h-12 w-12 shrink-0" />
      <div className="flex-1">
        <p className="text-lg font-display font-bold">
          📲 Recevez les prochaines infos sportives directement sur WhatsApp.
        </p>
        <p className="mt-1 text-sm text-white/85">
          Rejoignez la chaîne officielle Qorisports et ne manquez aucune
          actualité.
        </p>
      </div>
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#128C4B] shadow transition-transform hover:scale-105"
      >
        Rejoindre la chaîne
      </a>
    </div>
  );
}
