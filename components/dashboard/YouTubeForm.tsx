"use client";

import { useState, useEffect } from "react";
import type { GeneratedScript } from "@/lib/ai-generate";
import ScriptResults from "./ScriptResults";

function isValidYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(url);
}

const LOADING_STEPS = [
  "Analyse de la vidéo YouTube...",
  "Extraction du transcript...",
  "Génération des scripts avec l'IA...",
  "Mise en forme des résultats...",
];

function LoadingAnimation() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Spinner */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>

      {/* Step message */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-white">{LOADING_STEPS[stepIndex]}</p>
        <div className="flex gap-1.5">
          {LOADING_STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === stepIndex
                  ? "w-5 bg-violet-400"
                  : i < stepIndex
                  ? "w-1.5 bg-violet-600"
                  : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton */}
      <div className="w-full space-y-3">
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/5" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/5" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/5" />
      </div>
    </div>
  );
}

export default function YouTubeForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scripts, setScripts] = useState<GeneratedScript[] | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);

  const isValid = isValidYouTubeUrl(url);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);

    const submittedUrl = url;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtube_url: submittedUrl }),
      });

      if (res.status === 402) {
        setError("Tu n'as plus de crédits. Recharge ton compte pour continuer.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Une erreur est survenue. Réessaie.");
        return;
      }

      const data = await res.json();
      setGeneratedUrl(submittedUrl);
      setGeneratedTitle(data.youtube_title ?? null);
      setScripts(data.scripts);
    } catch {
      setError("Impossible de joindre le serveur. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (scripts) {
    return (
      <ScriptResults
        scripts={scripts}
        videoUrl={generatedUrl ?? undefined}
        videoTitle={generatedTitle ?? undefined}
        onReset={() => {
          setScripts(null);
          setUrl("");
          setError(null);
          setGeneratedUrl(null);
          setGeneratedTitle(null);
        }}
      />
    );
  }

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          {/* YouTube icon */}
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-base text-white placeholder-gray-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Validation indicator */}
          {url && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isValid ? (
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Générer mes scripts
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
