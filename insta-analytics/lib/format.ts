export function formatNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return (n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1) + "M";
  }
  if (abs >= 1_000) {
    return (n / 1_000).toFixed(abs >= 10_000 ? 0 : 1) + "k";
  }
  return n.toString();
}

export function formatPercent(n: number, digits = 1): string {
  return (n * 100).toFixed(digits) + "%";
}

export function formatSignedPercent(delta: number, digits = 1): string {
  if (!Number.isFinite(delta)) return "—";
  const sign = delta > 0 ? "+" : "";
  return sign + (delta * 100).toFixed(digits) + "%";
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}min` : `${m}min ${s}s`;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
