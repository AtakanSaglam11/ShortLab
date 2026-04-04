import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractVideoId, fetchTranscript, TranscriptError } from "@/lib/transcript";
import { generateScripts } from "@/lib/ai-generate";
import { fetchYouTubeTitle } from "@/lib/youtube";

const SCRIPTS_BY_PLAN: Record<string, number> = {
  free: 3,
  starter: 5,
  pro: 10,
};


export async function POST(request: Request) {
  try {
    // 1. Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // 2. Validation du body
    const body = await request.json().catch(() => null);
    if (!body?.youtube_url || typeof body.youtube_url !== "string") {
      return NextResponse.json({ error: "URL YouTube manquante." }, { status: 400 });
    }

    const videoId = extractVideoId(body.youtube_url.trim());
    if (!videoId) {
      return NextResponse.json(
        { error: "URL YouTube invalide. Exemple valide : https://youtube.com/watch?v=xxxx" },
        { status: 400 }
      );
    }

    // 3. Vérification des crédits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits, plan")
      .eq("id", user.id)
      .single();

    // Si la table n'existe pas ou si l'utilisateur n'a pas encore de ligne (pas de trigger signup),
    // on laisse passer avec les valeurs par défaut. L'utilisateur EST authentifié (vérifié ci-dessus).
    const userDataAvailable = !userError && userData !== null;

    if (userDataAvailable && userData.credits < 1) {
      return NextResponse.json(
        { error: "Plus de crédits disponibles. Recharge ton compte.", code: "insufficient_credits" },
        { status: 402 }
      );
    }

    const plan = userData?.plan ?? "free";
    const numberOfScripts = SCRIPTS_BY_PLAN[plan] ?? 3;
    const tone = body.tone ?? "professionnel mais accessible";
    const language = body.language ?? "Français";

    // 4. Titre YouTube (best-effort)
    const youtubeTitle = await fetchYouTubeTitle(videoId);

    // 5. Récupération du transcript
    let transcript: string;
    try {
      transcript = await fetchTranscript(videoId);
    } catch (err) {
      if (err instanceof TranscriptError) {
        return NextResponse.json({ error: err.message }, { status: 422 });
      }
      return NextResponse.json(
        { error: "Impossible de récupérer le transcript. Réessaie." },
        { status: 503 }
      );
    }

    // 6. Génération des scripts via IA
    let scripts;
    try {
      scripts = await generateScripts(transcript, numberOfScripts, tone, language);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      return NextResponse.json(
        { error: `Erreur de génération : ${message}` },
        { status: 500 }
      );
    }

    // 7. Sauvegarde en base + décrémentation crédit (best-effort)
    let generationId: string | null = null;
    let creditsRemaining: number | null = userDataAvailable ? userData.credits : null;

    if (userDataAvailable) {
      try {
        const { data: gen } = await supabase
          .from("generations")
          .insert({
            user_id: user.id,
            youtube_url: body.youtube_url.trim(),
            youtube_title: youtubeTitle,
            scripts,
            options: { tone, language, scripts_count: numberOfScripts },
            credits_used: 1,
            status: "completed",
          })
          .select("id")
          .single();

        generationId = gen?.id ?? null;

        // Décrémente le crédit
        const newCredits = userData.credits - 1;
        await supabase
          .from("users")
          .update({ credits: newCredits })
          .eq("id", user.id);

        // On re-sélectionne le solde mis à jour
        const { data: updated } = await supabase
          .from("users")
          .select("credits")
          .eq("id", user.id)
          .single();
        creditsRemaining = updated?.credits ?? newCredits;

        // Log de la transaction
        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          amount: -1,
          type: "generation_use",
          description: `Génération pour ${body.youtube_url.trim()}`,
          reference: generationId,
        });
      } catch {
        // Sauvegarde échouée (table inexistante en dev) — on retourne quand même les scripts
      }
    }

    // 8. Réponse
    return NextResponse.json({
      scripts,
      youtube_title: youtubeTitle,
      credits_remaining: creditsRemaining,
      generation_id: generationId,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur inattendue. Réessaie." },
      { status: 500 }
    );
  }
}
