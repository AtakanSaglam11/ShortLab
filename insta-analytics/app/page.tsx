import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  parsePeriod,
  PERIOD_LABELS,
  type PeriodKind,
} from "@/lib/analytics/periods";
import {
  getAccountKpis,
  getAccountTimeseries,
  getVideosWithLatestStats,
} from "@/lib/analytics/trends";
import { computeAlerts } from "@/lib/analytics/alerts";
import { TopBar } from "@/components/layout/TopBar";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { RecentVideosTable } from "@/components/dashboard/RecentVideosTable";
import { SeedButton } from "@/components/dashboard/SeedButton";
import { EngagementChart } from "@/components/charts/EngagementChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const period = parsePeriod(params.period, params.from, params.to);

  const account = await prisma.account.findFirst();
  if (!account) return <EmptyState />;

  const [kpis, timeseries, videos, alerts] = await Promise.all([
    getAccountKpis(account.id, period),
    getAccountTimeseries(account.id, period),
    getVideosWithLatestStats(account.id, period),
    computeAlerts(account.id),
  ]);

  // Limiter la table aux 10 dernières vidéos
  const recent = videos.slice(0, 10);

  return (
    <>
      <TopBar
        title={`@${account.username}`}
        subtitle={`${PERIOD_LABELS[period.kind]} · ${formatDate(period.from)} → ${formatDate(period.to)}`}
        right={
          <>
            <DateRangeFilter current={period.kind as PeriodKind} />
            <RefreshButton />
          </>
        }
      />

      <main className="space-y-6 p-6">
        <AlertsPanel alerts={alerts} />

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <KpiCard label="Followers" metric={kpis.followers} />
          <KpiCard label="Reach" metric={kpis.reach} />
          <KpiCard label="Impressions" metric={kpis.impressions} />
          <KpiCard
            label="Engagement"
            metric={kpis.engagementRate}
            format="percent"
          />
          <KpiCard label="Profile views" metric={kpis.profileViews} />
        </section>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-medium text-foreground">
              Reach &amp; Impressions
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <LegendDot color="#a855f7" label="Reach" />
              <LegendDot color="#3b82f6" label="Impressions" />
            </div>
          </CardHeader>
          <CardContent>
            <EngagementChart data={timeseries} />
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Vidéos publiées sur la période ({videos.length})
            </h2>
            {videos.length > recent.length && (
              <a
                href="/videos"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Voir toutes les vidéos →
              </a>
            )}
          </div>
          <RecentVideosTable videos={recent} />
        </section>
      </main>
    </>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <main className="mx-auto max-w-xl p-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Base vide — démarrons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aucun compte n&apos;est encore en base. Clique ci-dessous pour
            générer 6 mois de données factices réalistes, ou lance{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">
              npm run db:seed
            </code>{" "}
            en local.
          </p>
          <SeedButton />
        </CardContent>
      </Card>
    </main>
  );
}
