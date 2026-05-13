import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, formatPercent, formatDate } from "@/lib/format";
import type { VideoWithLatestStats } from "@/lib/analytics/trends";

function truncate(s: string | null, n: number): string {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function RecentVideosTable({
  videos,
}: {
  videos: VideoWithLatestStats[];
}) {
  if (videos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Aucune vidéo sur cette période.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posté</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="min-w-[220px]">Caption</TableHead>
            <TableHead className="text-right">Vues</TableHead>
            <TableHead className="text-right">Reach</TableHead>
            <TableHead className="text-right">Likes</TableHead>
            <TableHead className="text-right">Comm.</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Saves</TableHead>
            <TableHead className="text-right">ER</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(v.postedAt)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {v.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/videos/${v.id}`}
                  className="text-sm hover:underline underline-offset-4"
                >
                  {truncate(v.caption, 56)}
                </Link>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(v.views)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatNumber(v.reach)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(v.likes)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(v.comments)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(v.shares)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(v.saves)}
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {formatPercent(v.engagementRate, 1)}
              </TableCell>
              <TableCell>
                {v.permalink && (
                  <a
                    href={v.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
