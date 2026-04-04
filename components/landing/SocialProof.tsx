const stats = [
  { value: "500+", label: "créateurs actifs" },
  { value: "10 000+", label: "scripts générés" },
  { value: "30 sec", label: "par génération" },
];

const trust = [
  "Aucune carte bancaire requise",
  "Scripts prêts à filmer",
  "Résultats en 30 secondes",
];

export default function SocialProof() {
  return (
    <section className="border-y border-white/[0.06] px-4 py-10 sm:px-6" data-animate>
      <div className="mx-auto max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trust.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-gray-500 sm:text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
