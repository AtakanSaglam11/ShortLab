import Link from "next/link";

const script = {
  videoTitle: "Comment construire une audience sur TikTok en 2025",
  hook: "97% des créateurs abandonnent avant d'atteindre 1 000 abonnés. Et c'est exactement pour ça que toi tu vas y arriver.",
  corps: `Pas par manque de talent. Pas par manque d'idées.

Mais parce qu'ils ne savent pas que la croissance sur TikTok est exponentielle.

Les 3 premiers mois sont les plus durs. C'est là que tout le monde lâche.

Mais ceux qui restent voient quelque chose d'étrange se produire : un contenu décolle et change tout.

Le secret, c'est la constance — pas la perfection.`,
  cta: "Follow si tu veux la méthode complète en 3 étapes.",
  angle: "Statistique choc",
  duration: "~50s",
};

export default function ScriptPreview() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center" data-animate>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">
            Exemple de résultat
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ce que ShortLab génère{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              pour toi
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
            Voici un exemple réel de script généré à partir d&apos;une vidéo YouTube.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6" data-animate>
          {/* Source */}
          <div className="flex flex-col gap-4">
            {/* Label */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-gray-400">
                1
              </div>
              <span className="text-sm font-medium text-gray-400">Vidéo source</span>
            </div>

            {/* YouTube card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-gray-500">
                <svg className="h-4 w-4 flex-shrink-0 text-red-400/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="truncate">youtube.com/watch?v=...</span>
              </div>

              {/* Thumbnail placeholder */}
              <div className="mb-3 aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02]">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">Miniature vidéo</p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-300">{script.videoTitle}</p>

              <div className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Transcript extrait
                </span>
                <span className="text-xs text-gray-600">3 scripts générés</span>
              </div>
            </div>

            {/* Arrow for mobile */}
            <div className="flex justify-center md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Generated script */}
          <div className="flex flex-col gap-4">
            {/* Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                  2
                </div>
                <span className="text-sm font-medium text-gray-400">Script généré</span>
              </div>
              <div className="flex gap-1.5">
                <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">
                  {script.angle}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-500">
                  {script.duration}
                </span>
              </div>
            </div>

            {/* Script card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="space-y-0 divide-y divide-white/[0.06]">
                {/* Hook */}
                <div className="bg-amber-500/5 p-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-500/60">Hook</p>
                  <p className="text-sm font-semibold leading-snug text-amber-100 sm:text-base">
                    {script.hook}
                  </p>
                </div>

                {/* Corps */}
                <div className="p-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">Corps</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-400">
                    {script.corps}
                  </p>
                </div>

                {/* CTA */}
                <div className="bg-blue-500/5 p-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Call to action</p>
                  <p className="text-sm font-medium text-blue-200">{script.cta}</p>
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
                <span className="text-xs text-gray-600">1 crédit consommé</span>
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:text-white">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier le script
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center" data-animate>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.03] hover:shadow-violet-500/40 active:scale-[0.98]"
          >
            Générer mes premiers scripts
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-2 text-xs text-gray-600">3 crédits offerts · Sans carte bancaire</p>
        </div>
      </div>
    </section>
  );
}
