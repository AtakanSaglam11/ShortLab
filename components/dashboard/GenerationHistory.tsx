type Script = {
  id: number;
  hook: string;
  body: string;
  cta: string;
  duration_estimate: string;
  hashtags: string[];
};

type Generation = {
  id: string;
  youtube_url: string;
  youtube_title: string | null;
  created_at: string;
  scripts: Script[];
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-600">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-gray-400">Aucune génération pour le moment</p>
        <p className="mt-1 text-sm text-gray-600">
          Colle un lien YouTube ci-dessus pour créer tes premiers scripts.
        </p>
      </div>
    </div>
  );
}

export default function GenerationHistory({ generations }: { generations: Generation[] }) {
  if (generations.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {generations.map((gen) => {
        const videoId = extractVideoId(gen.youtube_url);
        const title = gen.youtube_title ?? gen.youtube_url;

        return (
          <div
            key={gen.id}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/8"
          >
            {/* Thumbnail */}
            {videoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt={title}
                className="h-16 w-28 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                </svg>
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-200">{title}</p>
              <p className="mt-1 text-xs text-gray-500">{formatDate(gen.created_at)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                  {gen.scripts.length} script{gen.scripts.length > 1 ? "s" : ""}
                </span>
                <span className="truncate text-xs text-gray-600 italic">
                  &ldquo;{gen.scripts[0]?.hook}&rdquo;
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-gray-700 transition-all group-hover:text-gray-400 group-hover:translate-x-0.5">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
