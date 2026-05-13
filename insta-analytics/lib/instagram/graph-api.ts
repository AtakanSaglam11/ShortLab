// Instagram Graph API provider — prêt mais activé uniquement quand DATA_SOURCE=ig.
//
// Pré-requis :
//   - Un compte Instagram Business ou Creator
//   - Lié à une Page Facebook
//   - Un token long-lived (60 jours) avec scopes :
//     instagram_basic, instagram_manage_insights,
//     pages_show_list, pages_read_engagement
//
// Voir README.md > "Instagram Graph API setup" pour la procédure complète.

import { env } from "../env";
import type {
  InstagramProvider,
  MediaType,
  ProviderAccountInfo,
  ProviderAccountStats,
  ProviderMedia,
  ProviderMediaStats,
} from "./types";

const GRAPH_VERSION = "v21.0";
const BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function assertCreds(): { token: string; userId: string } {
  if (!env.IG_ACCESS_TOKEN || !env.IG_USER_ID) {
    throw new Error(
      "Instagram credentials missing. Set IG_ACCESS_TOKEN and IG_USER_ID, or use DATA_SOURCE=mock.",
    );
  }
  return { token: env.IG_ACCESS_TOKEN, userId: env.IG_USER_ID };
}

type GraphResponse<T> = T & { error?: { message: string; code: number } };

async function call<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const { token } = assertCreds();
  const url = new URL(`${BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const body = (await res.json()) as GraphResponse<T>;
  if (!res.ok || body.error) {
    throw new Error(
      `IG Graph API error (${res.status}): ${body.error?.message ?? res.statusText}`,
    );
  }
  return body as T;
}

interface IGUserResponse {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
}

interface IGInsight {
  name: string;
  values: Array<{ value: number | Record<string, number> }>;
}

interface IGMediaResponse {
  id: string;
  media_type?: string;
  media_product_type?: string;
  caption?: string;
  permalink?: string;
  thumbnail_url?: string;
  media_url?: string;
  timestamp: string;
}

function mapMediaType(m: IGMediaResponse): MediaType {
  if (m.media_product_type === "REELS") return "REEL";
  if (m.media_type === "IMAGE") return "IMAGE";
  if (m.media_type === "CAROUSEL_ALBUM") return "CAROUSEL";
  return "VIDEO";
}

export const graphApiProvider: InstagramProvider = {
  name: "ig",

  async fetchAccount(): Promise<ProviderAccountInfo> {
    const { userId } = assertCreds();
    const data = await call<IGUserResponse>(userId, {
      fields: "id,username,profile_picture_url",
    });
    return {
      igUserId: data.id,
      username: data.username,
      profilePicUrl: data.profile_picture_url ?? null,
    };
  },

  async fetchAccountStats(): Promise<ProviderAccountStats> {
    const { userId } = assertCreds();
    const user = await call<IGUserResponse>(userId, {
      fields: "followers_count,follows_count",
    });
    const insights = await call<{ data: IGInsight[] }>(`${userId}/insights`, {
      metric: "reach,impressions,profile_views",
      period: "day",
    });

    const get = (name: string): number => {
      const found = insights.data.find((d) => d.name === name);
      const v = found?.values[0]?.value;
      return typeof v === "number" ? v : 0;
    };

    return {
      capturedAt: new Date(),
      followers: user.followers_count ?? 0,
      following: user.follows_count ?? 0,
      reach: get("reach"),
      impressions: get("impressions"),
      profileViews: get("profile_views"),
      engagementRate: 0, // calculé en aval à partir des stats média
    };
  },

  async fetchMedia(): Promise<ProviderMedia[]> {
    const { userId } = assertCreds();
    const data = await call<{ data: IGMediaResponse[] }>(`${userId}/media`, {
      fields:
        "id,media_type,media_product_type,caption,permalink,thumbnail_url,media_url,timestamp",
      limit: "100",
    });
    return data.data.map((m) => ({
      igMediaId: m.id,
      type: mapMediaType(m),
      caption: m.caption ?? null,
      permalink: m.permalink ?? null,
      thumbnailUrl: m.thumbnail_url ?? m.media_url ?? null,
      postedAt: new Date(m.timestamp),
      durationSec: null,
    }));
  },

  async fetchMediaStats(igMediaId: string): Promise<ProviderMediaStats> {
    const insights = await call<{ data: IGInsight[] }>(
      `${igMediaId}/insights`,
      {
        metric: "reach,impressions,likes,comments,shares,saved,plays",
      },
    );
    const get = (name: string): number => {
      const found = insights.data.find((d) => d.name === name);
      const v = found?.values[0]?.value;
      return typeof v === "number" ? v : 0;
    };

    return {
      igMediaId,
      capturedAt: new Date(),
      views: get("plays") || get("impressions"),
      likes: get("likes"),
      comments: get("comments"),
      shares: get("shares"),
      saves: get("saved"),
      reach: get("reach"),
      watchTimeSec: 0,
    };
  },
};
