const steps = [
  {
    number: "01",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    title: "Colle ton lien YouTube",
    description:
      "Copie l'URL de n'importe quelle vidéo YouTube, peu importe la durée. ShortLab extrait automatiquement le transcript complet.",
    detail: "Compatible avec toutes les vidéos sous-titrées",
  },
  {
    number: "02",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
        />
      </svg>
    ),
    title: "L'IA génère 3 scripts",
    description:
      "Notre IA analyse le contenu et crée 3 scripts distincts avec un hook percutant, un corps structuré et un call-to-action engageant.",
    detail: "30 secondes chrono, 3 angles différents",
  },
  {
    number: "03",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    title: "Copie et filme",
    description:
      "Sélectionne le script qui te plaît, copie-le en un clic et commence à filmer. Tous tes scripts sont sauvegardés dans ton historique.",
    detail: "Optimisé pour TikTok & Instagram Reels",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 md:py-32">
      {/* Subtle separator line */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Comment ça marche
          </p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            De la vidéo au script en{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              3 étapes
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] hidden h-px bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-violet-500/50 md:block" />

          {steps.map((step, i) => (
            <div key={i} className="group relative flex flex-col items-center text-center">
              {/* Number + icon bubble */}
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 to-blue-600/20 text-violet-300 shadow-lg shadow-violet-500/10 transition-all group-hover:border-violet-500/60 group-hover:shadow-violet-500/20">
                {step.icon}
                <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-md">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">{step.description}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-500">
                <svg className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {step.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
