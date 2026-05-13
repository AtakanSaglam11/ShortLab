import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatSignedPercent } from "@/lib/format";

export function TrendBadge({
  delta,
  inverse = false,
}: {
  delta: number;
  // si true, baisse = bon (ex : unfollow rate)
  inverse?: boolean;
}) {
  if (!Number.isFinite(delta)) {
    return (
      <Badge variant="outline" className="gap-1 font-mono text-[10px]">
        <Minus className="h-3 w-3" /> —
      </Badge>
    );
  }
  const positive = inverse ? delta < 0 : delta > 0;
  const negative = inverse ? delta > 0 : delta < 0;
  const variant = positive ? "success" : negative ? "danger" : "default";
  const Icon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;

  return (
    <Badge variant={variant} className="gap-1 font-mono text-[10px]">
      <Icon className="h-3 w-3" />
      {formatSignedPercent(delta, Math.abs(delta) >= 0.1 ? 0 : 1)}
    </Badge>
  );
}
