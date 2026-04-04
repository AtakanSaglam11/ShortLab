"use client";

import { useState } from "react";
import type { GeneratedScript } from "@/lib/ai-generate";
import ScriptCard from "./ScriptCard";

type Generation = {
  id: string;
  youtube_url: string;
  youtube_title: string | null;
  created_at: string;
  scripts: GeneratedScript[];
};

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-600">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-gray-400">Aucune génération pour le moment</p>
        <p className="mt-1 text-sm text-gray-600">
          Génère ton premier script depuis le{" "}
          <a href="/dashboard" className="text-violet-400 underline underline-offset-2 hover:text-violet-300">
            dashboard
          </a>.
        </p>
      </div>
    </div>
  );
}

export default function HistoryList({ generations }: { generations: Generation[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeScript, setActiveScript] = useState<Record<string, number>>({});

  if (generations.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-4">
      {generations.map((gen) => {
        const videoId = extractVideoId(gen.youtube_url);
        const title = gen.youtube_title ?? gen.youtube_url;
        const isExpanded = expandedId === gen.id;
        const scripts = Array.isArray(gen.scripts) ? gen.scripts : [];
        const currentScriptIndex = activeScript[gen.id] ?? 0;

        return (
          <div
            key={gen.id}
            className="rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-white/15"
          >
            {/* Card header */}
            <div className="flex items-start gap-4 p-4">
              {/* Thumbnail */}
              {videoId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt={title}
                  className="h-16 w-28 flex-shrink-0 rounded-lg object-cover sm:h-20 sm:w-36"
                />
              ) : (
                <div className="flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-600 sm:h-20 sm:w-36">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-gray-200">{title}</p>
                <p className="mt-1 text-xs text-gray-500">{formatDate(gen.created_at)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                    {scripts.length} script{scripts.length > 1 ? "s" : ""}
                  </span>
                  {scripts[0]?.hook && (
                    <span className="hidden truncate text-xs italic text-gray-600 sm:block max-w-xs">
                      &ldquo;{scripts[0].hook}&rdquo;
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle button */}
              {scripts.length > 0 && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : gen.id)}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition-all hover:bg-violet-500/20"
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="hidden sm:inline">{isExpanded ? "Masquer" : "Voir les scripts"}</span>
                  <span className="sm:hidden">{isExpanded ? "Masquer" : "Scripts"}</span>
                </button>
              )}
            </div>

            {/* Expanded scripts */}
            {isExpanded && scripts.length > 0 && (
              <div className="border-t border-white/10 px-4 pb-4 pt-4">
                {/* Script tabs */}
                {scripts.length > 1 && (
                  <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                    {scripts.map((script, i) => (
                      <button
                        key={script.numero ?? i}
                        onClick={() => setActiveScript((prev) => ({ ...prev, [gen.id]: i }))}
                        className={`flex-shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                          currentScriptIndex === i
                            ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                            : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
                        }`}
                      >
                        <span className="block text-xs opacity-60">Script</span>
                        <span>{script.numero ?? i + 1}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Script card */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <ScriptCard script={scripts[currentScriptIndex]} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
