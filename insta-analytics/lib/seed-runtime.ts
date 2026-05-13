// Logique de seed réutilisable : appelable depuis la CLI (prisma/seed.ts)
// et depuis l'API (POST /api/seed).
// Déterministe (seed = 42) : relance idempotente.

import { prisma } from "./db";

function mulberry32(seed: number) {
  let s = seed;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function runSeed(): Promise<{
  account: string;
  videos: number;
  snapshots: number;
  days: number;
}> {
  const rng = mulberry32(42);
  const rand = (min: number, max: number) =>
    Math.floor(rng() * (max - min + 1)) + min;
  const randF = (min: number, max: number) => rng() * (max - min) + min;
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  await prisma.conversion.deleteMany();
  await prisma.videoSnapshot.deleteMany();
  await prisma.video.deleteMany();
  await prisma.accountSnapshot.deleteMany();
  await prisma.syncRun.deleteMany();
  await prisma.account.deleteMany();

  const account = await prisma.account.create({
    data: {
      igUserId: "mock-17841400000000000",
      username: "mock_creator",
      profilePicUrl: null,
    },
  });

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const DAYS = 180;
  let followers = 8500;
  let following = 320;
  const accountSnapshots = [];

  for (let i = DAYS; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);

    const isViral = rng() < 0.04;
    const isDip = rng() < 0.06;
    const delta = isViral ? rand(150, 350) : isDip ? -rand(5, 30) : rand(2, 35);
    followers += delta;
    following += rand(-1, 2);

    const dow = day.getDay();
    const weekendFactor = dow === 0 || dow === 6 ? 0.85 : 1.0;
    const recentDipFactor = i < 14 ? 0.72 : 1.0;

    const reach = Math.round(
      rand(2000, 6500) * weekendFactor * recentDipFactor,
    );
    const impressions = Math.round(reach * randF(1.4, 2.2));
    const profileViews = Math.round(rand(120, 480) * weekendFactor);
    const engagementRate = randF(0.025, 0.06) * (i < 14 ? 0.85 : 1);

    accountSnapshots.push({
      accountId: account.id,
      capturedAt: day,
      followers,
      following,
      reach,
      impressions,
      profileViews,
      engagementRate,
    });
  }
  await prisma.accountSnapshot.createMany({ data: accountSnapshots });

  const types = [
    "REEL",
    "REEL",
    "REEL",
    "REEL",
    "REEL",
    "IMAGE",
    "CAROUSEL",
    "VIDEO",
  ];
  const captions = [
    "Voilà 3 erreurs que je faisais en début de SaaS",
    "Le hack qui change tout pour ton onboarding",
    "POV: tu lances ton produit",
    "Routine 5h pour bosser sur ton side project",
    "Comment j'ai trouvé mes 10 premiers clients",
    "Stop avec le no-code, voilà pourquoi",
    "Mon stack 2026 pour build vite",
    "3 outils que personne n'utilise (et qui devraient)",
    "La vérité sur le revenu d'un solopreneur",
    "Ce que les indiehackers cachent",
    "Pourquoi je supprime tout mon contenu",
    "Le piège du MVP parfait",
    "J'ai testé 5 SaaS en 5 jours",
    "Comment j'écris mes scripts viraux",
    "L'IA va-t-elle tuer les solopreneurs ?",
  ];

  const videos: {
    id: string;
    postedAt: Date;
    type: string;
    baseQuality: number;
  }[] = [];

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(rng() * 175) + 1;
    const postedAt = new Date(today);
    postedAt.setDate(postedAt.getDate() - daysAgo);
    postedAt.setHours(rand(7, 22), rand(0, 59), 0, 0);

    const type = pick(types);
    const r = rng();
    const baseQuality =
      r < 0.05 ? randF(2.5, 4.5) : r < 0.25 ? randF(0.15, 0.45) : randF(0.6, 1.5);

    const video = await prisma.video.create({
      data: {
        igMediaId: `mock-media-${i}`,
        accountId: account.id,
        type,
        caption: pick(captions) + (rng() < 0.3 ? " 👀" : ""),
        permalink: `https://www.instagram.com/p/mock${i}/`,
        thumbnailUrl: null,
        postedAt,
        durationSec:
          type === "REEL" || type === "VIDEO" ? rand(15, 90) : null,
      },
    });
    videos.push({ id: video.id, postedAt, type, baseQuality });
  }

  let totalSnapshots = 0;
  for (const v of videos) {
    const ageDays = Math.floor(
      (today.getTime() - v.postedAt.getTime()) / 86_400_000,
    );
    const isReel = v.type === "REEL";
    const peakViews = Math.round(
      3000 * v.baseQuality * (isReel ? 1.6 : v.type === "VIDEO" ? 1.2 : 0.7),
    );

    const snapshots = [];
    for (let d = 0; d <= ageDays; d++) {
      const t = Math.min(d / 7, 1.4);
      const progress = 1 - Math.exp(-2.5 * t);
      const views = Math.round(peakViews * progress * randF(0.95, 1.05));
      const likes = Math.round(views * randF(0.03, 0.08));
      const comments = Math.round(views * randF(0.002, 0.012));
      const shares = Math.round(views * randF(0.005, 0.025));
      const saves = Math.round(views * randF(0.008, 0.04));
      const reach = Math.round(views * randF(0.6, 0.9));
      const watchTimeSec =
        isReel || v.type === "VIDEO" ? Math.round(views * randF(4, 14)) : 0;

      const cap = new Date(v.postedAt);
      cap.setDate(cap.getDate() + d);
      cap.setHours(12, 0, 0, 0);

      snapshots.push({
        videoId: v.id,
        capturedAt: cap,
        views,
        likes,
        comments,
        shares,
        saves,
        reach,
        watchTimeSec,
      });
    }
    await prisma.videoSnapshot.createMany({ data: snapshots });
    totalSnapshots += snapshots.length;
  }

  const top = [...videos].sort((a, b) => b.baseQuality - a.baseQuality).slice(0, 8);
  for (const v of top) {
    const nClicks = rand(15, 140);
    const nSignups = Math.round(nClicks * randF(0.04, 0.12));

    await prisma.conversion.create({
      data: {
        videoId: v.id,
        kind: "click",
        count: nClicks,
        occurredAt: new Date(v.postedAt.getTime() + 86_400_000 * rand(1, 14)),
        source: "manual",
        note: "Seed",
      },
    });
    if (nSignups > 0) {
      await prisma.conversion.create({
        data: {
          videoId: v.id,
          kind: "signup",
          count: nSignups,
          occurredAt: new Date(v.postedAt.getTime() + 86_400_000 * rand(2, 20)),
          source: "manual",
        },
      });
    }
  }

  await prisma.syncRun.create({
    data: {
      source: "mock",
      status: "success",
      finishedAt: new Date(),
      notes: `Seed: ${videos.length} vidéos, ${DAYS} jours d'historique`,
    },
  });

  return {
    account: account.username,
    videos: videos.length,
    snapshots: totalSnapshots,
    days: DAYS,
  };
}
