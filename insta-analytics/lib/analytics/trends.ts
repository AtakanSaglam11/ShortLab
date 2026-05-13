import { prisma } from "../db";
import type { PeriodRange } from "./periods";
import { previousRange } from "./periods";

export interface MetricDelta {
  current: number;
  previous: number;
  delta: number; // ratio: 0.12 = +12%, -0.23 = -23%
  absoluteDelta: number;
}

export function computeDelta(current: number, previous: number): MetricDelta {
  const delta = previous === 0 ? (current > 0 ? 1 : 0) : (current - previous) / previous;
  return { current, previous, delta, absoluteDelta: current - previous };
}

export interface AccountKpis {
  followers: MetricDelta;
  reach: MetricDelta;
  impressions: MetricDelta;
  engagementRate: MetricDelta;
  profileViews: MetricDelta;
}

export async function getAccountKpis(
  accountId: string,
  range: PeriodRange,
): Promise<AccountKpis> {
  const prev = previousRange(range);

  const [curr, prevSnap, latest, prevLatest] = await Promise.all([
    prisma.accountSnapshot.findMany({
      where: { accountId, capturedAt: { gte: range.from, lte: range.to } },
      orderBy: { capturedAt: "asc" },
    }),
    prisma.accountSnapshot.findMany({
      where: { accountId, capturedAt: { gte: prev.from, lte: prev.to } },
      orderBy: { capturedAt: "asc" },
    }),
    prisma.accountSnapshot.findFirst({
      where: { accountId, capturedAt: { lte: range.to } },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.accountSnapshot.findFirst({
      where: { accountId, capturedAt: { lte: prev.to } },
      orderBy: { capturedAt: "desc" },
    }),
  ]);

  const sum = (xs: typeof curr, key: "reach" | "impressions" | "profileViews") =>
    xs.reduce((a, b) => a + b[key], 0);
  const avg = (xs: typeof curr, key: "engagementRate") =>
    xs.length ? xs.reduce((a, b) => a + b[key], 0) / xs.length : 0;

  return {
    followers: computeDelta(latest?.followers ?? 0, prevLatest?.followers ?? 0),
    reach: computeDelta(sum(curr, "reach"), sum(prevSnap, "reach")),
    impressions: computeDelta(sum(curr, "impressions"), sum(prevSnap, "impressions")),
    engagementRate: computeDelta(avg(curr, "engagementRate"), avg(prevSnap, "engagementRate")),
    profileViews: computeDelta(sum(curr, "profileViews"), sum(prevSnap, "profileViews")),
  };
}

export interface AccountTimeseries {
  date: Date;
  followers: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

export async function getAccountTimeseries(
  accountId: string,
  range: PeriodRange,
): Promise<AccountTimeseries[]> {
  const rows = await prisma.accountSnapshot.findMany({
    where: { accountId, capturedAt: { gte: range.from, lte: range.to } },
    orderBy: { capturedAt: "asc" },
    select: {
      capturedAt: true,
      followers: true,
      reach: true,
      impressions: true,
      engagementRate: true,
    },
  });
  return rows.map((r) => ({
    date: r.capturedAt,
    followers: r.followers,
    reach: r.reach,
    impressions: r.impressions,
    engagementRate: r.engagementRate,
  }));
}

export interface VideoWithLatestStats {
  id: string;
  igMediaId: string;
  type: string;
  caption: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  postedAt: Date;
  durationSec: number | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  watchTimeSec: number;
  engagementRate: number;
}

export async function getVideosWithLatestStats(
  accountId: string,
  range: PeriodRange,
): Promise<VideoWithLatestStats[]> {
  const videos = await prisma.video.findMany({
    where: {
      accountId,
      postedAt: { gte: range.from, lte: range.to },
    },
    include: {
      snapshots: {
        orderBy: { capturedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { postedAt: "desc" },
  });

  return videos.map((v) => {
    const s = v.snapshots[0];
    const engagement = s
      ? (s.likes + s.comments + s.shares + s.saves) / Math.max(1, s.reach)
      : 0;
    return {
      id: v.id,
      igMediaId: v.igMediaId,
      type: v.type,
      caption: v.caption,
      permalink: v.permalink,
      thumbnailUrl: v.thumbnailUrl,
      postedAt: v.postedAt,
      durationSec: v.durationSec,
      views: s?.views ?? 0,
      likes: s?.likes ?? 0,
      comments: s?.comments ?? 0,
      shares: s?.shares ?? 0,
      saves: s?.saves ?? 0,
      reach: s?.reach ?? 0,
      watchTimeSec: s?.watchTimeSec ?? 0,
      engagementRate: engagement,
    };
  });
}
