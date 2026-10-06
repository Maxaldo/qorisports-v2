import type { Metadata } from "next";
import { Mail, ShieldCheck, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Supprimer mon compte QorisLive",
  description:
    "Procedure de suppression d'un compte QorisLive et des donnees associees : comment en faire la demande, quelles donnees sont supprimees et lesquelles sont conservees.",
  alternates: {
    canonical: "https://www.qorisports.com/suppression-compte",
  },
  // Page exigee par Google Play : elle doit rester accessible publiquement,
  // sans connexion, et indexable.
  robots: { index: true, follow: true },
};

// Contenu fixe : aucune raison de regenerer souvent.
export const revalidate = 86400;

const SUPPORT_EMAIL = "support@qorisports.com";
const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Suppression de compte",
)}`;

export default function SuppressionComptePage() {
  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      <div className="bg-primary px-4 py-14 text-center">
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
          Supprimer mon compte QorisLive
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
          QorisLive est une application editee par BeMedia. Si vous souhaitez
          supprimer votre compte et les donnees associees, suivez la procedure
          ci-dessous.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12">
        {/* Procedure */}
        <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-text-primary dark:text-gray-100">
              Comment demander la suppression
            </h2>
          </div>

          <p className="mt-4 leading-relaxed text-text-secondary dark:text-gray-400">
            Envoyez un message a{" "}
            <a
              href={MAILTO}
              className="font-semibold text-accent underline underline-offset-2 hover:opacity-80"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            en indiquant le numero de telephone utilise lors de votre
            inscription, avec pour objet{" "}
            <strong className="font-semibold text-text-primary dark:text-gray-200">
              « Suppression de compte »
            </strong>
            .
          </p>

          <p className="mt-4 leading-relaxed text-text-secondary dark:text-gray-400">
            Votre demande sera traitee sous 30 jours.
          </p>

          <a
            href={MAILTO}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-accent"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Envoyer ma demande
          </a>
        </section>

        {/* Donnees supprimees */}
        <section className="mt-8 rounded-xl bg-white p-8 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-500" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-text-primary dark:text-gray-100">
              Donnees supprimees
            </h2>
          </div>

          <ul className="mt-4 space-y-2 text-text-secondary dark:text-gray-400">
            {[
              "Votre nom",
              "Votre numero de telephone",
              "Votre adresse e-mail, le cas echeant",
              "Vos preferences (club favori)",
              "Vos identifiants d'appareil",
              "Vos jetons de notification",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Donnees conservees */}
        <section className="mt-8 rounded-xl bg-white p-8 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-text-primary dark:text-gray-100">
              Donnees conservees
            </h2>
          </div>

          <div className="mt-4 space-y-4 leading-relaxed text-text-secondary dark:text-gray-400">
            <p>
              L&apos;historique de vos paiements est conserve pendant la duree
              legale imposee par la reglementation comptable, sous une forme
              dissociee de votre identite.
            </p>
            <p>
              Les donnees sportives (scores, compositions, statistiques des
              matchs) ne vous concernent pas personnellement et ne sont pas
              affectees.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
