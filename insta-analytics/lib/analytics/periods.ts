import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export type PeriodKind =
  | "week"
  | "month"
  | "last-month"
  | "3m"
  | "6m"
  | "custom";

export interface Period {
  kind: PeriodKind;
  from: Date;
  to: Date;
}

export interface PeriodRange {
  from: Date;
  to: Date;
}

const KNOWN: PeriodKind[] = ["week", "month", "last-month", "3m", "6m", "custom"];

export function parsePeriod(
  kind: string | null | undefined,
  from?: string | null,
  to?: string | null,
  now: Date = new Date(),
): Period {
  const k: PeriodKind = (KNOWN as string[]).includes(kind ?? "")
    ? (kind as PeriodKind)
    : "month";

  if (k === "custom" && from && to) {
    return {
      kind: "custom",
      from: startOfDay(new Date(from)),
      to: endOfDay(new Date(to)),
    };
  }
  return resolvePeriod(k, now);
}

export function resolvePeriod(kind: PeriodKind, now: Date = new Date()): Period {
  const to = endOfDay(now);
  switch (kind) {
    case "week":
      return { kind, from: startOfDay(subDays(now, 6)), to };
    case "month":
      return { kind, from: startOfDay(subDays(now, 29)), to };
    case "3m":
      return { kind, from: startOfDay(subDays(now, 89)), to };
    case "6m":
      return { kind, from: startOfDay(subDays(now, 179)), to };
    case "last-month": {
      const lm = subMonths(now, 1);
      return { kind, from: startOfMonth(lm), to: endOfMonth(lm) };
    }
    case "custom":
      return { kind, from: startOfDay(subDays(now, 29)), to };
  }
}

export function previousRange(p: PeriodRange): PeriodRange {
  const span = p.to.getTime() - p.from.getTime();
  return {
    from: new Date(p.from.getTime() - span - 1),
    to: new Date(p.from.getTime() - 1),
  };
}

export const PERIOD_LABELS: Record<PeriodKind, string> = {
  week: "7 derniers jours",
  month: "30 derniers jours",
  "last-month": "Mois dernier",
  "3m": "3 derniers mois",
  "6m": "6 derniers mois",
  custom: "Période personnalisée",
};
