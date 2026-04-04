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
    excluded: ["Crédits mensuels renouvelés", "Accès prioritaire", "Support dédié"],
    cta: "Commencer gratuitement",
    href: "/auth/register",
    variant: "ghost" as const,
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
    excluded: ["Accès prioritaire", "Support dédié"],
    cta: "Choisir Starter",
    href: "/api/stripe/checkout?plan=starter",
    variant: "ghost" as const,
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
    variant: "gradient" as const,
  },
];

const pack = {
  name: "Pack Crédits",
  price: "9€",
  credits: "15 crédits",
  description: "Recharge ponctuelle sans abonnement",
  note: "Les crédits s'ajoutent à votre solde, sans expiration",
  cta: "Acheter le pack",
  href: "/api/stripe/checkout?plan=pack",
};

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Tarifs
          </p>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Un plan pour{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              chaque créateur
            </span>
          </h2>
          <p className="text-gray-400">
            Sans engagement. Changez ou annulez à tout moment.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                plan.variant === "gradient"
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-600/20 to-blue-600/10 shadow-xl shadow-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-1 text-lg font-bold text-white">{plan.name}</h3>
                <p className="mb-4 text-sm text-gray-500">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="mb-1 text-gray-500">{plan.period}</span>
                  )}
                </div>
                <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2">
                  <p className="text-sm font-semibold text-violet-300">{plan.credits}</p>
                  <p className="text-xs text-gray-500">{plan.creditsNote}</p>
                </div>
              </div>

              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
                {plan.excluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <XIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all ${
                  plan.variant === "gradient"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                    : "border border-white/15 bg-white/8 text-white hover:bg-white/15"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Pack crédits one-shot */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 text-violet-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{pack.name}</h3>
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-sm font-semibold text-blue-300">
                    {pack.credits} · {pack.price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{pack.description}</p>
                <p className="mt-1 text-xs text-gray-600">{pack.note}</p>
              </div>
            </div>
            <Link
              href={pack.href}
              className="flex-shrink-0 rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15 text-center"
            >
              {pack.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
