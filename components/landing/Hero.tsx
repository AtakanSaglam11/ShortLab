import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 md:pb-24 md:pt-36">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-300 sm:text-sm">
          <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-violet-400" />
          3 scripts offerts à l&apos;inscription · Sans carte bancaire
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-[2.4rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
          Tes vidéos YouTube{" "}
          <br className="hidden sm:block" />
          deviennent des{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            scripts viraux
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Colle un lien YouTube. En 30 secondes, ShortLab génère 3 scripts distincts
          optimisés pour TikTok et Instagram Reels — prêts à filmer.
        </p>

        {/* Single CTA */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.03] hover:shadow-violet-500/50 active:scale-[0.98]"
        >
          Commencer gratuitement
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        <p className="mt-3 text-xs text-gray-600">Sans engagement · Annulation en 1 clic</p>

        {/* Script preview card */}
        <div className="mx-auto mt-12 max-w-lg text-left">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/60">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-400 ring-2 ring-green-400/20" />
                <span className="text-xs font-medium text-gray-400">Script généré en 28 secondes</span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-500">
                ~45s · Erreur courante
              </span>
            </div>

            <div className="space-y-3 p-4">
              {/* Hook */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-500/60">
                  Hook
                </p>
                <p className="text-sm font-semibold leading-snug text-amber-100 sm:text-base">
                  Tu perds 80% de ton audience dans les 3 premières secondes.
                </p>
              </div>

              {/* Corps */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Corps
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                  La plupart des créateurs pensent que la qualité vidéo retient les gens. Les données montrent autre chose. Le vrai problème, c&apos;est les 3 premières secondes. Si ton hook ne crée pas de tension immédiate — le scroll continue.
                </p>
              </div>

              {/* CTA */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500/60">
                  Call to action
                </p>
                <p className="text-sm font-medium text-blue-200">
                  Commente HOOK si tu veux les 5 formules qui fonctionnent.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">
                  Script 1 / 3
                </span>
                <span className="text-xs text-gray-600">2 autres angles disponibles</span>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:text-white">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
