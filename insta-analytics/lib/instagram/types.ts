export type MediaType = "REEL" | "IMAGE" | "VIDEO" | "CAROUSEL";

export const MEDIA_TYPES: MediaType[] = ["REEL", "IMAGE", "VIDEO", "CAROUSEL"];

export function isMediaType(s: string): s is MediaType {
  return (MEDIA_TYPES as string[]).includes(s);
}

export interface ProviderAccountInfo {
  igUserId: string;
  username: string;
  profilePicUrl: string | null;
}

export interface ProviderAccountStats {
  capturedAt: Date;
  followers: number;
  following: number;
  reach: number;
  impressions: number;
  profileViews: number;
  engagementRate: number;
}

export interface ProviderMedia {
  igMediaId: string;
  type: MediaType;
  caption: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  postedAt: Date;
  durationSec: number | null;
}

export interface ProviderMediaStats {
  igMediaId: string;
  capturedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  watchTimeSec: number;
}

export interface InstagramProvider {
  name: "mock" | "ig";
  fetchAccount(): Promise<ProviderAccountInfo>;
  fetchAccountStats(): Promise<ProviderAccountStats>;
  fetchMedia(): Promise<ProviderMedia[]>;
  fetchMediaStats(igMediaId: string): Promise<ProviderMediaStats>;
}
