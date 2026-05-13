import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendBadge } from "./TrendBadge";
import { formatNumber, formatPercent } from "@/lib/format";
import type { MetricDelta } from "@/lib/analytics/trends";

export function KpiCard({
  label,
  metric,
  format = "number",
  hint,
}: {
  label: string;
  metric: MetricDelta;
  format?: "number" | "percent";
  hint?: string;
}) {
  const display =
    format === "percent" ? formatPercent(metric.current) : formatNumber(metric.current);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs uppercase tracking-wider">
            {label}
          </CardTitle>
          <TrendBadge delta={metric.delta} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums tracking-tight">
          {display}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {hint ??
            (format === "percent"
              ? `vs ${formatPercent(metric.previous)} période précédente`
              : `vs ${formatNumber(metric.previous)} période précédente`)}
        </p>
      </CardContent>
    </Card>
  );
}
