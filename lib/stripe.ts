import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER!,
    credits: 40,
    mode: "subscription" as const,
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO!,
    credits: 150,
    mode: "subscription" as const,
  },
  pack: {
    name: "Pack Crédits",
    priceId: process.env.STRIPE_PRICE_PACK_15!,
    credits: 15,
    mode: "payment" as const,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
