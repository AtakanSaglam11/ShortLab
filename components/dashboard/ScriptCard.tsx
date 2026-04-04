"use client";

import { useState } from "react";
import type { GeneratedScript } from "@/lib/ai-generate";

function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copié !
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function ScriptCard({ script }: { script: GeneratedScript }) {
  const fullScript = [script.hook, script.corps, script.cta].join("\n\n");

  return (
    <div className="flex flex-col gap-5">
      {/* Title + meta */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{script.titre_suggere}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">
              {script.angle}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-500">
              {script.duree_estimee}
            </span>
          </div>
        </div>
        <CopyButton text={fullScript} label="Copier le script" />
      </div>

      {/* Hook */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500/70">
          Hook
        </p>
        <p className="text-base font-semibold leading-snug text-amber-100">
          {script.hook}
        </p>
      </div>

      {/* Corps */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Corps du script
          </p>
          <CopyButton text={script.corps} />
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-300">
          {script.corps}
        </p>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500/70">
          Call to action
        </p>
        <p className="text-sm font-medium text-blue-200">{script.cta}</p>
      </div>

      {/* Filming tip */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-400">Conseil tournage : </span>
          {script.conseil_tournage}
        </p>
      </div>
    </div>
  );
}
