"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [syncing, setSyncing] = useState(false);

  const onClick = async () => {
    setSyncing(true);
    try {
      await fetch("/api/sync", { method: "POST" });
    } catch {
      // silencieux : l'erreur sera visible dans la table SyncRun
    } finally {
      setSyncing(false);
      startTransition(() => router.refresh());
    }
  };

  const loading = syncing || pending;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="gap-2"
    >
      <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
      {loading ? "Sync..." : "Refresh"}
    </Button>
  );
}
