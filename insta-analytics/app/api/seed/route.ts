import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runSeed } from "@/lib/seed-runtime";

// POST /api/seed — réinjecte les données mock (6 mois, 50 vidéos).
// Refuse si l'option n'est pas autorisée explicitement (sauf en mode mock).
export async function POST() {
  if (process.env.DATA_SOURCE === "ig") {
    return NextResponse.json(
      { ok: false, error: "Seed désactivé en mode IG. Utilise /api/sync." },
      { status: 400 },
    );
  }

  try {
    const result = await runSeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// GET pour vérifier rapidement le statut
export async function GET() {
  const [accounts, videos, snapshots] = await Promise.all([
    prisma.account.count(),
    prisma.video.count(),
    prisma.videoSnapshot.count(),
  ]);
  return NextResponse.json({ accounts, videos, snapshots });
}
