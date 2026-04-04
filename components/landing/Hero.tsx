import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-36 md:pb-32">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] h-[200px] w-[200px] rounded-full bg-violet-500/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          Tes prochains scripts viraux sont à 30 secondes
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
          Transforme n&apos;importe quelle{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            vidéo YouTube
          </span>{" "}
          en scripts viraux
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          Colle un lien YouTube. En 30 secondes, ShortLab génère 3 scripts
          optimisés pour TikTok et Instagram Reels, prêts à filmer.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
          >
            Commencer gratuitement
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
          >
            Voir les tarifs
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-gray-500">
          3 scripts offerts à l&apos;inscription · Sans carte bancaire
        </p>

        {/* Demo mockup */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/50 backdrop-blur">
            {/* Browser bar */}
            <div className="flex items-center gap-2 rounded-t-xl border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="mx-auto flex h-7 w-2/3 items-center justify-center rounded-md bg-white/5 px-3 text-xs text-gray-500">
                app.shortlab.io/dashboard
              </div>
            </div>

            {/* App preview */}
            <div className="p-6 text-left">
              <p className="mb-3 text-sm font-medium text-gray-400">
                Lien YouTube
              </p>
              <div className="mb-4 flex gap-3">
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-500">
                  https://youtube.com/watch?v=dQw4w9WgXcQ
                </div>
                <div className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white">
                  Générer →
                </div>
              </div>

              {/* Generated scripts preview */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    tag: "Script 1",
                    hook: "Tu faisais ça FAUX depuis le début...",
                    color: "violet",
                  },
                  {
                    tag: "Script 2",
                    hook: "Ce secret que personne ne te dit...",
                    color: "blue",
                  },
                  {
                    tag: "Script 3",
                    hook: "J'ai testé pendant 30 jours et voilà...",
                    color: "indigo",
                  },
                ].map((script) => (
                  <div
                    key={script.tag}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <span
                      className={`mb-2 inline-block rounded-full bg-${script.color}-500/20 px-2 py-0.5 text-xs font-medium text-${script.color}-300`}
                    >
                      {script.tag}
                    </span>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {script.hook}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
