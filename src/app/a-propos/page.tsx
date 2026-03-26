import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Shield, Users } from "lucide-react";
import { authors } from "@/data/mock-articles";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Decouvrez Qorisports, la reference de l'actualite sportive beninoise et africaine. Notre mission, notre equipe et nos valeurs.",
};

// Biographies fictives des membres de l'equipe.
const teamBios: Record<string, string> = {
  "author-redaction":
    "L'equipe de redaction de Qorisports rassemble des passionnes de sport beninois et africain. Ensemble, ils couvrent quotidiennement les evenements sportifs majeurs avec rigueur et impartialite.",
  "author-randis":
    "Journaliste sportif avec plus de 8 ans d'experience, Randis suit de pres le football beninois et les competitions continentales. Sa plume allie analyse tactique et recit humain.",
};

const values = [
  {
    icon: Shield,
    title: "Rigueur",
    description: "Une information verifiee et fiable",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "L'amour du sport au coeur de chaque article",
  },
  {
    icon: Users,
    title: "Proximite",
    description: "Au plus pres des acteurs du sport beninois",
  },
];

export default function AProposPage() {
  return (
    <div className="bg-surface pb-16 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-primary px-4 py-14 text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          A propos de Qorisports
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
          La reference de l&apos;actualite sportive beninoise et africaine
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-12">
        {/* Notre mission */}
        <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-900">
          <h2 className="font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Notre mission
          </h2>
          <div className="mt-4 space-y-4 text-text-secondary leading-relaxed dark:text-gray-400">
            <p>
              Qorisports est ne de la conviction que le sport beninois et
              africain merite une couverture mediatique a la hauteur de son
              intensite et de sa richesse. Notre ambition est de raconter chaque
              competition, chaque performance et chaque histoire avec rigueur,
              passion et proximite.
            </p>
            <p>
              Nous couvrons l&apos;actualite du football, du basketball, du
              handball, de l&apos;athletisme et de toutes les disciplines qui
              font vibrer le continent. Nous croyons que l&apos;information
              sportive de qualite contribue a structurer les ecosystemes sportifs
              et a inspirer les jeunes generations.
            </p>
          </div>
        </section>

        {/* L'equipe */}
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            L&apos;equipe
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {authors.map((author) => (
              <div
                key={author.id}
                className="flex items-start gap-5 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-display font-bold text-text-primary dark:text-gray-100">
                    {author.name}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    {author.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary dark:text-gray-400">
                    {teamBios[author.id] ?? ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary dark:text-gray-100">
            Nos valeurs
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-900"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <v.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-display font-bold text-text-primary dark:text-gray-100">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
