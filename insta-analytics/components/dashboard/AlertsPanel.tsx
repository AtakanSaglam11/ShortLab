import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert, AlertSeverity } from "@/lib/analytics/alerts";

const STYLES: Record<
  AlertSeverity,
  { border: string; bg: string; icon: typeof Info; text: string }
> = {
  danger: {
    border: "border-[var(--color-danger)]/50",
    bg: "bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]",
    icon: TriangleAlert,
    text: "text-[var(--color-danger)]",
  },
  warning: {
    border: "border-[var(--color-warning)]/50",
    bg: "bg-[color-mix(in_srgb,var(--color-warning)_10%,transparent)]",
    icon: AlertTriangle,
    text: "text-[var(--color-warning)]",
  },
  info: {
    border: "border-[var(--color-info)]/50",
    bg: "bg-[color-mix(in_srgb,var(--color-info)_10%,transparent)]",
    icon: Info,
    text: "text-[var(--color-info)]",
  },
  success: {
    border: "border-[var(--color-success)]/40",
    bg: "bg-[color-mix(in_srgb,var(--color-success)_8%,transparent)]",
    icon: CheckCircle2,
    text: "text-[var(--color-success)]",
  },
};

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
        Analyse honnête — ce qui ressort
      </h2>
      <div className="space-y-2">
        {alerts.map((a, i) => {
          const s = STYLES[a.severity];
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={cn(
                "flex gap-3 rounded-lg border p-4",
                s.border,
                s.bg,
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", s.text)} />
              <div className="min-w-0">
                <h3 className={cn("text-sm font-medium", s.text)}>
                  {a.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {a.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
