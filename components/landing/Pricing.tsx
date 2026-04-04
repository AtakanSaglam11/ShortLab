import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0€",
    period: null,
    description: "Pour découvrir ShortLab",
    credits: "3 crédits offerts",
    creditsNote: "à l'inscription, non renouvelés",
    badge: null,
    features: [
      "3 générations incluses",
      "3 scripts par génération",
      "Historique 7 jours",
      "Toutes les langues",
    ],
    excluded: ["Crédits mensuels renouvelés", "Accès prioritaire"],
    cta: "Commencer gratuitement",
    href: "/auth/login",
    highlight: false,
  },
  {
    name: "Starter",
    price: "19€",
    period: "/mois",
    description: "Pour les créateurs réguliers",
    credits: "40 crédits / mois",
    creditsNote: "renouvelés chaque mois",
    badge: null,
    features: [
      "40 générations par mois",
      "5 scripts par génération",
      "Historique illimité",
      "Toutes les langues",
      "Ton personnalisable",
    ],
    excluded: ["Accès prioritaire"],
    cta: "Choisir Starter",
    href: "/api/stripe/checkout?plan=starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "49€",
    period: "/mois",
    description: "Pour les agences et power users",
    credits: "150 crédits / mois",
    creditsNote: "renouvelés chaque mois",
    badge: "Populaire",
    features: [
      "150 générations par mois",
      "10 scripts par génération",
      "Historique illimité",
      "Toutes les langues",
      "Ton personnalisable",
      "Accès API prioritaire",
      "Support dédié",
    ],
    excluded: [],
    cta: "Choisir Pro",
    href: "/api/stripe/checkout?plan=pro",
    highlight: true,
  },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center" data-animate>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">Tarifs</p>
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Un plan pour{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              chaque créateur
            </span>
          </h2>
          <p className="text-sm text-gray-500 sm:text-base">
            Sans engagement. Changez ou annulez à tout moment.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                plan.highlight
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-600/15 to-transparent"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
              data-animate
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-5">
                <h3 className="mb-0.5 text-base font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500">{plan.description}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="mb-0.5 text-sm text-gray-500">{plan.period}</span>}
                </div>
                <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/8 px-3 py-2">
                  <p className="text-xs font-semibold text-violet-300">{plan.credits}</p>
                  <p className="text-xs text-gray-600">{plan.creditsNote}</p>
                </div>
              </div>

              {/* Features */}
              <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
                {plan.excluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <XIcon />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Credit pack */}
        <div
          className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
          data-animate
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/25 to-blue-600/25 text-violet-300">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Pack Crédits</h3>
                  <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                    15 crédits · 9€
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Recharge ponctuelle, sans abonnement, sans expiration.
                </p>
              </div>
            </div>
            <Link
              href="/api/stripe/checkout?plan=pack"
              className="flex-shrink-0 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              Acheter — 9€
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
