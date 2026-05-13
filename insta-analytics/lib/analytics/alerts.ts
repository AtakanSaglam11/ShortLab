// Génère des alertes honnêtes (factuelles, sans enrobage positif) à partir
// des données récentes. Si tout va bien, retourne juste un message sobre.

import { differenceInDays, subDays } from "date-fns";
import { prisma } from "../db";
import { formatNumber, formatSignedPercent } from "../format";

export type AlertSeverity = "danger" | "warning" | "info" | "success";

export interface Alert {
  severity: AlertSeverity;
  title: string;
  detail: string;
}

export async function computeAlerts(accountId: string): Promise<Alert[]> {
  const alerts: Alert[] = [];
  const now = new Date();

  // --- 1. Reach 14j vs 14j précédent ---
  const last14 = await prisma.accountSnapshot.findMany({
    where: { accountId, capturedAt: { gte: subDays(now, 14) } },
  });
  const prev14 = await prisma.accountSnapshot.findMany({
    where: {
      accountId,
      capturedAt: { gte: subDays(now, 28), lt: subDays(now, 14) },
    },
  });
  const sumReach = (xs: { reach: number }[]) => xs.reduce((a, b) => a + b.reach, 0);
  const curReach = sumReach(last14);
  const prevReach = sumReach(prev14);
  if (prevReach > 0) {
    const delta = (curReach - prevReach) / prevReach;
    if (delta <= -0.15) {
      alerts.push({
        severity: "danger",
        title: `Reach en chute de ${formatSignedPercent(delta, 0)} sur 14 jours`,
        detail: `${formatNumber(curReach)} reach cumulé contre ${formatNumber(prevReach)} les 14 jours précédents. Cherche ce qui a changé : format, fréquence, créneau de publication.`,
      });
    } else if (delta <= -0.05) {
      alerts.push({
        severity: "warning",
        title: `Reach en léger recul (${formatSignedPercent(delta, 0)})`,
        detail: `Variation modérée sur 14 jours — pas grave en soi, à surveiller si ça se prolonge.`,
      });
    }
  }

  // --- 2. Engagement 7j vs 7j ---
  const last7 = await prisma.accountSnapshot.findMany({
    where: { accountId, capturedAt: { gte: subDays(now, 7) } },
  });
  const prev7 = await prisma.accountSnapshot.findMany({
    where: {
      accountId,
      capturedAt: { gte: subDays(now, 14), lt: subDays(now, 7) },
    },
  });
  const avgEng = (xs: { engagementRate: number }[]) =>
    xs.length ? xs.reduce((a, b) => a + b.engagementRate, 0) / xs.length : 0;
  const curEng = avgEng(last7);
  const prevEng = avgEng(prev7);
  if (prevEng > 0) {
    const delta = (curEng - prevEng) / prevEng;
    if (delta <= -0.20) {
      alerts.push({
        severity: "danger",
        title: `Engagement rate en chute de ${formatSignedPercent(delta, 0)} sur 7 jours`,
        detail: `Tu passes de ${(prevEng * 100).toFixed(1)}% à ${(curEng * 100).toFixed(1)}%. Probablement lié à du reach acheté/poussé qui ne convertit pas.`,
      });
    }
  }

  // --- 3. Vidéos sous-performantes parmi les 5 dernières ---
  const recent = await prisma.video.findMany({
    where: { accountId },
    orderBy: { postedAt: "desc" },
    take: 5,
    include: {
      snapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
    },
  });
  // Compare à la médiane des vues sur les 30 vidéos précédentes
  const baseline = await prisma.video.findMany({
    where: { accountId },
    orderBy: { postedAt: "desc" },
    skip: 5,
    take: 30,
    include: {
      snapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
    },
  });
  const baseViews = baseline
    .map((v) => v.snapshots[0]?.views ?? 0)
    .filter((x) => x > 0)
    .sort((a, b) => a - b);
  if (baseViews.length > 5) {
    const median = baseViews[Math.floor(baseViews.length / 2)];
    const underperf = recent.filter(
      (v) => (v.snapshots[0]?.views ?? 0) < median * 0.5,
    );
    if (underperf.length >= 3) {
      alerts.push({
        severity: "danger",
        title: `${underperf.length} vidéos sur 5 sous la moitié de ta médiane`,
        detail: `Tes ${underperf.length} dernières publications font moins de ${formatNumber(Math.round(median * 0.5))} vues (médiane historique : ${formatNumber(median)}). Pause-toi et regarde ce qui a changé dans le format.`,
      });
    } else if (underperf.length === 2) {
      alerts.push({
        severity: "warning",
        title: `2 vidéos récentes sous la médiane`,
        detail: `À surveiller. Si la 3ème suit le même chemin, c'est un signal franc.`,
      });
    }
  }

  // --- 4. Inactivité ---
  const lastPost = await prisma.video.findFirst({
    where: { accountId },
    orderBy: { postedAt: "desc" },
  });
  if (lastPost) {
    const daysSince = differenceInDays(now, lastPost.postedAt);
    if (daysSince >= 7) {
      alerts.push({
        severity: "warning",
        title: `${daysSince} jours sans poster`,
        detail: `L'algo va te désindexer. Publie quelque chose, même imparfait.`,
      });
    }
  }

  // Si rien à signaler
  if (alerts.length === 0) {
    alerts.push({
      severity: "success",
      title: "Rien d'alarmant à signaler",
      detail: `Tes métriques sur 14 jours sont stables ou en hausse. Continue sur cette ligne.`,
    });
  }

  return alerts;
}
