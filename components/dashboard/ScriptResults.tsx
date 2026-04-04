"use client";

import { useState } from "react";
import type { GeneratedScript } from "@/lib/ai-generate";
import ScriptCard from "./ScriptCard";

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

export default function ScriptResults({
  scripts,
  videoUrl,
  videoTitle,
  onReset,
}: {
  scripts: GeneratedScript[];
  videoUrl?: string;
  videoTitle?: string;
  onReset: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoId = videoUrl ? extractVideoId(videoUrl) : null;

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">
            {scripts.length} script{scripts.length > 1 ? "s" : ""} générés
          </h3>
          <p className="text-sm text-gray-500">Sélectionne un script pour le lire et le copier.</p>
        </div>
        <button
          onClick={onReset}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nouvelle génération</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Video preview */}
      {videoId && (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={videoTitle ?? "Vidéo YouTube"}
            className="h-14 w-24 flex-shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Scripts basés sur</p>
            <p className="text-sm font-medium text-gray-200 line-clamp-2">{videoTitle ?? videoUrl}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {scripts.map((script, i) => (
          <button
            key={script.numero}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              activeIndex === i
                ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
            }`}
          >
            <span className="block text-xs opacity-60">Script</span>
            <span>{script.numero}</span>
          </button>
        ))}
      </div>

      {/* Active script */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-xl shadow-black/20">
        <ScriptCard script={scripts[activeIndex]} />
      </div>
    </div>
  );
}
