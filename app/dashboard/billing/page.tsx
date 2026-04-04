import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Facturation",
  description: "Gérez votre abonnement et vos crédits ShortLab.",
};
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

async function processSuccessfulPayment(sessionId: string): Promise<string | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") return null;

  const userId = session.metadata?.user_id;
  const planKey = session.metadata?.plan_key as PlanKey | undefined;
  const credits = parseInt(session.metadata?.credits ?? "0", 10);

  if (!userId || !planKey || !credits || !(planKey in PLANS)) {
    console.error("processSuccessfulPayment: metadata manquante", session.metadata);
    return "Metadata Stripe manquante";
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Idempotence : ne pas créditer deux fois la même session
  const { data: existing } = await supabaseAdmin
    .from("credit_transactions")
    .select("id")
    .eq("reference", sessionId)
    .maybeSingle();

  if (existing) return null;

  const plan = PLANS[planKey];

  if (plan.mode === "subscription") {
    const { error } = await supabaseAdmin.from("users").upsert(
      {
        id: userId,
        plan: planKey,
        credits,
        stripe_customer_id: session.customer as string | null,
        stripe_subscription_id: session.subscription as string | null,
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error("processSuccessfulPayment: upsert subscription failed", error);
      return error.message;
    }
  } else {
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    const newCredits = (userData?.credits ?? 0) + credits;
    const { error } = await supabaseAdmin
      .from("users")
      .upsert({ id: userId, credits: newCredits }, { onConflict: "id" });
    if (error) {
      console.error("processSuccessfulPayment: upsert credits failed", error);
      return error.message;
    }
  }

  const { error: txError } = await supabaseAdmin.from("credit_transactions").insert({
    user_id: userId,
    amount: credits,
    type: plan.mode === "subscription" ? "subscription" : "purchase",
    description: `Achat ${plan.name}`,
    reference: sessionId,
  });
  if (txError) {
    console.error("processSuccessfulPayment: insert transaction failed", txError);
    return txError.message;
  }

  return null;
}

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "19€",
    period: "/mois",
    credits: 40,
    description: "Pour les créateurs réguliers",
    features: ["40 crédits / mois renouvelés", "5 scripts par génération", "Historique illimité", "Ton personnalisable"],
    variant: "ghost" as const,
  },
  {
    key: "pro",
    name: "Pro",
    price: "49€",
    period: "/mois",
    credits: 150,
    description: "Pour les agences et power users",
    features: ["150 crédits / mois renouvelés", "10 scripts par génération", "Historique illimité", "Accès API prioritaire", "Support dédié"],
    badge: "Populaire",
    variant: "gradient" as const,
  },
];

const pack = {
  key: "pack",
  name: "Pack Crédits",
  price: "9€",
  credits: 15,
  description: "15 crédits, sans abonnement, sans expiration",
};

async function getUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { plan: "free", credits: 0 };

  const { data } = await supabase
    .from("users")
    .select("credits, plan")
    .eq("id", user.id)
    .single();

  return { plan: data?.plan ?? "free", credits: data?.credits ?? 0 };
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; error?: string; plan?: string; session_id?: string }>;
}) {
  const params = await searchParams;

  // Traitement côté serveur du paiement (contourne le webhook en localhost)
  if (params.success && params.session_id) {
    let processingError: string | null = null;
    try {
      processingError = await processSuccessfulPayment(params.session_id);
    } catch (err) {
      console.error("processSuccessfulPayment exception:", err);
      processingError = err instanceof Error ? err.message : "Erreur inconnue";
    }
    // Rediriger sans session_id pour forcer un render propre avec les crédits à jour
    if (processingError) {
      redirect(`/dashboard/billing?success=1&error=${encodeURIComponent(processingError)}`);
    } else {
      redirect("/dashboard/billing?success=1");
    }
  }

  const { plan: currentPlan, credits } = await getUserData();

  return (
    <div className="flex flex-col">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-bold text-white">Facturation</h1>
        <p className="text-sm text-gray-500">Gérez votre abonnement et vos crédits.</p>
      </header>

      <div className="flex-1 px-6 py-8 md:px-10">
        <div className="mx-auto max-w-3xl flex flex-col gap-10">

          {/* Feedback banners */}
          {params.success && (
            <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Paiement réussi ! Vos crédits ont été ajoutés.
            </div>
          )}
          {params.canceled && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Paiement annulé.
            </div>
          )}
          {params.error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Erreur : {decodeURIComponent(params.error)}
            </div>
          )}

          {/* Current status */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 font-semibold text-white">Situation actuelle</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-gray-400">Plan</span>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-sm font-semibold capitalize text-violet-300">
                  {currentPlan}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-bold text-white">{credits}</span>
                <span className="text-sm text-gray-500">crédit{credits !== 1 ? "s" : ""} restant{credits !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Abonnements */}
          <div>
            <h2 className="mb-4 font-semibold text-white">Abonnements</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => {
                const isCurrent = currentPlan === plan.key;
                return (
                  <div
                    key={plan.key}
                    className={`relative flex flex-col rounded-2xl border p-6 ${
                      plan.variant === "gradient"
                        ? "border-violet-500/50 bg-gradient-to-b from-violet-600/15 to-blue-600/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-0.5 text-xs font-bold text-white">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                      <div className="mt-2 flex items-end gap-1">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        <span className="mb-0.5 text-sm text-gray-500">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="mb-6 flex flex-col gap-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                          <svg className="h-3.5 w-3.5 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="block w-full rounded-xl border border-green-500/30 bg-green-500/10 py-3 text-center text-sm font-semibold text-green-400">
                        Plan actuel
                      </div>
                    ) : (
                      <Link
                        href={`/api/stripe/checkout?plan=${plan.key}`}
                        className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                          plan.variant === "gradient"
                            ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
                            : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {currentPlan === "free" ? "Passer à " : "Changer pour "}{plan.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pack crédits */}
          <div>
            <h2 className="mb-4 font-semibold text-white">Recharge ponctuelle</h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 text-violet-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{pack.name}</h3>
                      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                        {pack.credits} crédits · {pack.price}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{pack.description}</p>
                  </div>
                </div>
                <Link
                  href={`/api/stripe/checkout?plan=${pack.key}`}
                  className="flex-shrink-0 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 text-center"
                >
                  Acheter — {pack.price}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
