// Mock provider — lit le contenu de la DB (seed) et ajoute un peu de jitter
// pour simuler une "capture du jour" quand on appelle /api/sync.

import { prisma } from "../db";
import type {
  InstagramProvider,
  MediaType,
  ProviderAccountInfo,
  ProviderAccountStats,
  ProviderMedia,
  ProviderMediaStats,
} from "./types";
import { isMediaType } from "./types";

function jitter(base: number, pct = 0.05): number {
  return Math.max(0, Math.round(base * (1 + (Math.random() - 0.5) * 2 * pct)));
}

function castType(s: string): MediaType {
  return isMediaType(s) ? s : "REEL";
}

export const mockProvider: InstagramProvider = {
  name: "mock",

  async fetchAccount(): Promise<ProviderAccountInfo> {
    const account = await prisma.account.findFirst();
    if (!account) {
      return {
        igUserId: "mock-17841400000000000",
        username: "mock_creator",
        profilePicUrl: null,
      };
    }
    return {
      igUserId: account.igUserId,
      username: account.username,
      profilePicUrl: account.profilePicUrl,
    };
  },

  async fetchAccountStats(): Promise<ProviderAccountStats> {
    const last = await prisma.accountSnapshot.findFirst({
      orderBy: { capturedAt: "desc" },
    });
    const now = new Date();
    now.setHours(12, 0, 0, 0);

    if (!last) {
      return {
        capturedAt: now,
        followers: 10_000,
        following: 350,
        reach: 4_000,
        impressions: 7_500,
        profileViews: 250,
        engagementRate: 0.04,
      };
    }

    return {
      capturedAt: now,
      followers: last.followers + Math.floor(Math.random() * 60) - 10,
      following: last.following + Math.floor(Math.random() * 3) - 1,
      reach: jitter(last.reach, 0.15),
      impressions: jitter(last.impressions, 0.15),
      profileViews: jitter(last.profileViews, 0.2),
      engagementRate: Math.max(
        0.01,
        Math.min(0.1, last.engagementRate + (Math.random() - 0.5) * 0.01),
      ),
    };
  },

  async fetchMedia(): Promise<ProviderMedia[]> {
    const videos = await prisma.video.findMany({
      orderBy: { postedAt: "desc" },
    });
    return videos.map((v) => ({
      igMediaId: v.igMediaId,
      type: castType(v.type),
      caption: v.caption,
      permalink: v.permalink,
      thumbnailUrl: v.thumbnailUrl,
      postedAt: v.postedAt,
      durationSec: v.durationSec,
    }));
  },

  async fetchMediaStats(igMediaId: string): Promise<ProviderMediaStats> {
    const video = await prisma.video.findUnique({ where: { igMediaId } });
    const now = new Date();
    now.setHours(12, 0, 0, 0);

    if (!video) {
      return {
        igMediaId,
        capturedAt: now,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        reach: 0,
        watchTimeSec: 0,
      };
    }

    const last = await prisma.videoSnapshot.findFirst({
      where: { videoId: video.id },
      orderBy: { capturedAt: "desc" },
    });
    if (!last) {
      return {
        igMediaId,
        capturedAt: now,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        reach: 0,
        watchTimeSec: 0,
      };
    }

    return {
      igMediaId,
      capturedAt: now,
      views: last.views + Math.floor(Math.random() * 50),
      likes: last.likes + Math.floor(Math.random() * 10),
      comments: last.comments + Math.floor(Math.random() * 3),
      shares: last.shares + Math.floor(Math.random() * 4),
      saves: last.saves + Math.floor(Math.random() * 5),
      reach: jitter(last.reach, 0.05),
      watchTimeSec: last.watchTimeSec + Math.floor(Math.random() * 40),
    };
  },
};
