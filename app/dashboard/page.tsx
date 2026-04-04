import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { extractVideoId } from "@/lib/transcript";
import { fetchYouTubeTitle } from "@/lib/youtube";
import YouTubeForm from "@/components/dashboard/YouTubeForm";
import GenerationHistory from "@/components/dashboard/GenerationHistory";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Génère des scripts viraux à partir de tes vidéos YouTube.",
};

async function getUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, credits: 0, generations: [] };

  // Crédits depuis la table users (peut ne pas encore exister)
  const { data: userData } = await supabase
    .from("users")
    .select("credits, plan")
    .eq("id", user.id)
    .single();

  // Historique récent
  const { data: generations } = await supabase
    .from("generations")
    .select("id, youtube_url, youtube_title, created_at, scripts")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Enrich generations missing a title (old records before title-fetching was added)
  const rawGenerations = generations ?? [];
  const enriched = await Promise.all(
    rawGenerations.map(async (gen) => {
      if (gen.youtube_title) return gen;
      const videoId = extractVideoId(gen.youtube_url);
      const title = videoId ? await fetchYouTubeTitle(videoId) : null;
      return { ...gen, youtube_title: title };
    })
  );

  return {
    user,
    credits: userData?.credits ?? null,
    plan: userData?.plan ?? "free",
    generations: enriched,
  };
}

export default async function DashboardPage() {
  const { user, credits, plan, generations } = await getUserData();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "toi";

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
        <div>
          {/* Mobile logo */}
          <div className="mb-1 flex items-center gap-2 md:hidden">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-blue-600">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">ShortLab</span>
          </div>
          <h1 className="text-base font-bold text-white sm:text-lg">
            Bonjour, {firstName}
          </h1>
          <p className="hidden text-sm text-gray-500 sm:block">Prêt à créer du contenu viral ?</p>
        </div>

        {/* Credits badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2">
            <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-bold text-violet-300">
              {credits === null ? "..." : credits}
            </span>
            <span className="text-sm text-gray-500">
              crédit{credits !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">
            {(user?.email?.[0] ?? "?").toUpperCase()}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 px-6 py-8 md:px-10">
        {/* Generate section */}
        <section className="mx-auto max-w-2xl">
          {/* Hero text */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              {plan === "pro"
                ? "Plan Pro"
                : plan === "starter"
                ? "Plan Starter"
                : "Plan Free"}
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Génère tes scripts
            </h2>
            <p className="text-gray-500">
              Colle un lien YouTube et reçois 3 scripts optimisés pour TikTok et Instagram Reels.
            </p>
          </div>

          {/* Credits warning */}
          {credits === 0 && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>
                Tu n&apos;as plus de crédits.{" "}
                <a href="/dashboard/billing" className="font-semibold underline underline-offset-2 hover:text-amber-200">
                  Recharge ton compte
                </a>{" "}
                pour continuer.
              </span>
            </div>
          )}

          {/* YouTube form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <YouTubeForm />
          </div>

          {/* Tip */}
          <p className="mt-3 text-center text-xs text-gray-600">
            1 crédit consommé par génération · 3 scripts produits à chaque fois
          </p>
        </section>

        {/* History section */}
        <section className="mx-auto mt-12 max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">Générations récentes</h3>
            {generations.length > 0 && (
              <a
                href="/dashboard/history"
                className="text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                Voir tout
              </a>
            )}
          </div>

          <GenerationHistory generations={generations} />
        </section>
      </div>
    </div>
  );
}
