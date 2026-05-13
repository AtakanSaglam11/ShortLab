import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [account, videoCount, snapshotCount, lastSync] = await Promise.all([
    prisma.account.findFirst(),
    prisma.video.count(),
    prisma.accountSnapshot.count(),
    prisma.syncRun.findFirst({ orderBy: { startedAt: "desc" } }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Instagram Analytics
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bootstrap OK — le dashboard arrive
        </h1>
        <p className="text-muted-foreground">
          Fondation prête (Next.js + Prisma + provider mock/IG). L&apos;UI complète
          (dashboard, vidéos, insights, Shorzy) suit dans la prochaine étape.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Source" value={env.DATA_SOURCE.toUpperCase()} />
        <Stat
          label="Compte"
          value={account?.username ?? "—"}
          hint={account ? `@${account.username}` : "Lance le seed"}
        />
        <Stat label="Vidéos" value={formatNumber(videoCount)} />
        <Stat label="Snapshots" value={formatNumber(snapshotCount)} />
      </div>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <h2 className="text-sm font-medium">Dernière synchro</h2>
        {lastSync ? (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="capitalize">{lastSync.status}</span> · source{" "}
            {lastSync.source} ·{" "}
            {new Date(lastSync.startedAt).toLocaleString("fr-FR")}
            {lastSync.notes && (
              <span className="block text-xs">{lastSync.notes}</span>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Aucune synchro pour l&apos;instant. Lance{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">
              npm run db:seed
            </code>
            .
          </p>
        )}
      </div>

      <div className="mt-8 space-y-2 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Étapes restantes :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>UI : shadcn, layout sidebar, KPI cards, dashboard</li>
          <li>Pages vidéos (table triable + détail courbes)</li>
          <li>Insights (analyse honnête, patterns, alertes)</li>
          <li>Section Shorzy (conversions manuelles + corrélation)</li>
          <li>API sync (manuel + cron)</li>
        </ul>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
