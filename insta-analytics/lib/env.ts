import { z } from "zod";

const schema = z.object({
  DATA_SOURCE: z.enum(["mock", "ig"]).default("mock"),
  IG_ACCESS_TOKEN: z.string().optional(),
  IG_USER_ID: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  CRON_SECRET: z.string().min(8).default("change-me-to-a-long-random-string"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3001"),
  AUTH_PASSWORD: z.string().optional(),
});

export const env = schema.parse({
  DATA_SOURCE: process.env.DATA_SOURCE,
  IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
  IG_USER_ID: process.env.IG_USER_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  CRON_SECRET: process.env.CRON_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
});

export type Env = typeof env;
