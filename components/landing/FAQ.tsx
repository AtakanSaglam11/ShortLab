"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Mes vidéos YouTube doivent-elles avoir des sous-titres ?",
    a: "Oui, ShortLab extrait automatiquement le transcript de la vidéo. La grande majorité des vidéos populaires sur YouTube ont des sous-titres générés automatiquement. Si une vidéo n'en a pas, ShortLab l'indiquera clairement avec un message d'erreur.",
  },
  {
    q: "Combien de scripts sont générés par vidéo ?",
    a: "Cela dépend de votre plan : 3 scripts avec le plan Free, 5 avec Starter, et 10 avec Pro. Chaque script est unique et utilise un angle différent — erreur courante, statistique choc, storytelling, contrarian — pour maximiser vos chances de viralité.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, sans engagement. Vous pouvez annuler en un clic depuis votre espace de facturation. Vous conservez l'accès à votre plan jusqu'à la fin de la période déjà payée. Aucune question posée.",
  },
  {
    q: "Dans quelles langues les scripts sont-ils générés ?",
    a: "ShortLab supporte toutes les langues. Les scripts sont générés dans la langue de votre choix — même si la vidéo source est dans une autre langue. Idéal pour adapter du contenu anglophone à une audience francophone, ou l'inverse.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center" data-animate>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">FAQ</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Questions fréquentes</h2>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-white/[0.06]" data-animate>
          {faqs.map((faq, i) => (
            <div key={i} className="py-1">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-4 text-left"
              >
                <span className={`text-sm font-medium transition-colors sm:text-base ${open === i ? "text-white" : "text-gray-300"}`}>
                  {faq.q}
                </span>
                <svg
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <p className="pb-4 text-sm leading-relaxed text-gray-400">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
