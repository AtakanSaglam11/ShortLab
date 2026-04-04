const steps = [
  {
    number: "01",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Colle ton lien YouTube",
    description: "Copie l'URL de n'importe quelle vidéo YouTube. ShortLab extrait automatiquement le transcript complet, peu importe la durée.",
    detail: "Compatible avec toutes les vidéos sous-titrées",
  },
  {
    number: "02",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "L'IA génère 3 scripts",
    description: "Claude analyse le contenu et crée 3 scripts avec des angles différents : hook percutant, corps structuré, call-to-action engageant.",
    detail: "3 angles distincts à chaque génération",
  },
  {
    number: "03",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Copie et filme",
    description: "Sélectionne le script qui te plaît, copie-le en un clic et commence à filmer. Tous tes scripts sont sauvegardés dans l'historique.",
    detail: "Optimisé pour TikTok & Instagram Reels",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center" data-animate>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">
            Comment ça marche
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            De la vidéo au script en{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              3 étapes
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              data-animate
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Number + icon */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-300">
                  {step.icon}
                </div>
                <span className="text-3xl font-bold text-white/10">{step.number}</span>
              </div>

              <h3 className="mb-2 text-base font-bold text-white">{step.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-400">{step.description}</p>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-gray-600">{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
