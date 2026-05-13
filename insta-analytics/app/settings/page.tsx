import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [account, lastSync, recentSyncs] = await Promise.all([
    prisma.account.findFirst(),
    prisma.syncRun.findFirst({ orderBy: { startedAt: "desc" } }),
    prisma.syncRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <>
      <TopBar title="Réglages" subtitle="Configuration et historique des syncs" />
      <main className="space-y-6 p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-sm">
              Source de données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row
              label="Mode"
              value={env.DATA_SOURCE === "ig" ? "Instagram Graph API" : "Mock"}
            />
            <Row
              label="Compte"
              value={account ? `@${account.username}` : "—"}
            />
            <Row
              label="IG User ID"
              value={env.IG_USER_ID ? "********" + env.IG_USER_ID.slice(-4) : "non défini"}
            />
            <Row
              label="Token"
              value={
                env.IG_ACCESS_TOKEN
                  ? `défini (${env.IG_ACCESS_TOKEN.length} chars)`
                  : "non défini"
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-sm">
              Dernière synchro
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {lastSync ? (
              <div className="space-y-1">
                <p>
                  <span className="text-muted-foreground">Statut : </span>
                  <span className="capitalize">{lastSync.status}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Source : </span>
                  {lastSync.source}
                </p>
                <p>
                  <span className="text-muted-foreground">Démarrée : </span>
                  {formatDateTime(lastSync.startedAt)}
                </p>
                {lastSync.notes && (
                  <p className="text-xs text-muted-foreground">
                    {lastSync.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune synchro.</p>
            )}
          </CardContent>
        </Card>

        {recentSyncs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground text-sm">
                Historique (10 dernières)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {recentSyncs.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 border-b pb-2 last:border-0"
                  >
                    <span className="text-muted-foreground">
                      {formatDateTime(r.startedAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.source}
                    </span>
                    <span
                      className={
                        r.status === "success"
                          ? "text-[var(--color-success)]"
                          : r.status === "error"
                            ? "text-[var(--color-danger)]"
                            : "text-muted-foreground"
                      }
                    >
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
