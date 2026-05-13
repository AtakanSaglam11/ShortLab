import { env } from "../env";
import { mockProvider } from "./mock-provider";
import { graphApiProvider } from "./graph-api";
import type { InstagramProvider } from "./types";

export function getProvider(): InstagramProvider {
  return env.DATA_SOURCE === "ig" ? graphApiProvider : mockProvider;
}

export type { InstagramProvider } from "./types";
