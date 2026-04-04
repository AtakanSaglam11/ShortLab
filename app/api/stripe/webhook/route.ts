import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";

// Client admin (service role) pour bypasser RLS depuis le webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Webhook invalide : ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const planKey = session.metadata?.plan_key as PlanKey | undefined;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);

    if (!userId || !planKey || !credits || !(planKey in PLANS)) {
      return NextResponse.json({ error: "Metadata manquante" }, { status: 400 });
    }

    const plan = PLANS[planKey];

    if (plan.mode === "subscription") {
      // Abonnement : met à jour le plan et remet les crédits au montant du plan
      await supabaseAdmin.from("users").upsert(
        {
          id: userId,
          plan: planKey,
          credits,
          stripe_customer_id: session.customer as string | null,
          stripe_subscription_id: session.subscription as string | null,
        },
        { onConflict: "id" }
      );
    } else {
      // Pack one-time : ajoute les crédits au solde existant
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("credits")
        .eq("id", userId)
        .single();

      const newCredits = (userData?.credits ?? 0) + credits;
      await supabaseAdmin
        .from("users")
        .upsert({ id: userId, credits: newCredits }, { onConflict: "id" });
    }

    await supabaseAdmin.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: plan.mode === "subscription" ? "subscription" : "purchase",
      description: `Achat ${plan.name}`,
      reference: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
