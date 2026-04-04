import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const planKey = searchParams.get("plan") as PlanKey | null;

  if (!planKey || !(planKey in PLANS)) {
    return NextResponse.redirect(`${origin}/dashboard/billing?error=invalid_plan`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/login?next=/dashboard/billing`
    );
  }

  const plan = PLANS[planKey];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?success=1&plan=${planKey}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/billing?canceled=1`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan_key: planKey,
        credits: plan.credits.toString(),
      },
      ...(plan.mode === "subscription" && {
        subscription_data: {
          metadata: { user_id: user.id, plan_key: planKey },
        },
      }),
    });

    return NextResponse.redirect(session.url!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.redirect(
      `${origin}/dashboard/billing?error=${encodeURIComponent(message)}`
    );
  }
}
