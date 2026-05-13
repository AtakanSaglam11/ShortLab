"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import type { PeriodKind } from "@/lib/analytics/periods";

const OPTIONS: { value: PeriodKind; label: string }[] = [
  { value: "week", label: "7j" },
  { value: "month", label: "30j" },
  { value: "last-month", label: "Mois -1" },
  { value: "3m", label: "3 mois" },
  { value: "6m", label: "6 mois" },
];

export function DateRangeFilter({ current }: { current: PeriodKind }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setPeriod = (p: PeriodKind) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", p);
    params.delete("from");
    params.delete("to");
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border bg-card p-0.5 text-xs",
        pending && "opacity-60",
      )}
      role="tablist"
    >
      {OPTIONS.map((o) => {
        const active = o.value === current;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => setPeriod(o.value)}
            className={cn(
              "px-3 py-1.5 rounded-[5px] transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
