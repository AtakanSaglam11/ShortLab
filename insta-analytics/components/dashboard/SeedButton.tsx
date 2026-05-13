"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error ?? "Erreur seed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setRunning(false);
      startTransition(() => router.refresh());
    }
  };

  const loading = running || pending;

  return (
    <div className="space-y-2">
      <Button onClick={onClick} disabled={loading} className="gap-2 w-full">
        <Sparkles className="h-4 w-4" />
        {loading ? "Génération en cours..." : "Générer 6 mois de données mock"}
      </Button>
      {error && (
        <p className="text-xs text-[var(--color-danger)]">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        50 vidéos, 180 jours d&apos;historique, alertes réalistes. Idempotent.
      </p>
    </div>
  );
}
