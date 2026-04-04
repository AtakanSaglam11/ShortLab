import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { extractVideoId } from "@/lib/transcript";
import { fetchYouTubeTitle } from "@/lib/youtube";
import HistoryList from "@/components/dashboard/HistoryList";

export const metadata: Metadata = {
  title: "Historique",
  description: "Toutes vos générations de scripts passées.",
};

async function getAllGenerations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: generations } = await supabase
    .from("generations")
    .select("id, youtube_url, youtube_title, created_at, scripts")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!generations) return [];

  // Enrich generations missing a title
  const enriched = await Promise.all(
    generations.map(async (gen) => {
      if (gen.youtube_title) return gen;
      const videoId = extractVideoId(gen.youtube_url);
      const title = videoId ? await fetchYouTubeTitle(videoId) : null;
      return { ...gen, youtube_title: title };
    })
  );

  return enriched;
}

export default async function HistoryPage() {
  const generations = await getAllGenerations();

  return (
    <div className="flex flex-col">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h1 className="text-lg font-bold text-white">Historique</h1>
        <p className="text-sm text-gray-500">
          {generations.length > 0
            ? `${generations.length} génération${generations.length > 1 ? "s" : ""} au total`
            : "Toutes vos générations de scripts"}
        </p>
      </header>

      <div className="flex-1 px-4 py-6 sm:px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <HistoryList generations={generations} />
        </div>
      </div>
    </div>
  );
}
