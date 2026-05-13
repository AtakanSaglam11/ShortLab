import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getProvider } from "@/lib/instagram/provider";

// POST /api/sync — déclenche un rafraîchissement manuel des données IG.
// En mock mode : ajoute une "capture du jour" (jitter sur le dernier snapshot).
// En mode IG : appelle la Graph API pour chaque vidéo connue et écrit les snapshots.
export async function POST() {
  const run = await prisma.syncRun.create({
    data: { source: "pending", status: "running" },
  });

  try {
    const provider = getProvider();
    await prisma.syncRun.update({
      where: { id: run.id },
      data: { source: provider.name },
    });

    const accountInfo = await provider.fetchAccount();
    const account = await prisma.account.upsert({
      where: { igUserId: accountInfo.igUserId },
      update: {
        username: accountInfo.username,
        profilePicUrl: accountInfo.profilePicUrl,
      },
      create: {
        igUserId: accountInfo.igUserId,
        username: accountInfo.username,
        profilePicUrl: accountInfo.profilePicUrl,
      },
    });

    // Snapshot global du compte
    const stats = await provider.fetchAccountStats();
    await prisma.accountSnapshot.upsert({
      where: {
        accountId_capturedAt: {
          accountId: account.id,
          capturedAt: stats.capturedAt,
        },
      },
      update: {
        followers: stats.followers,
        following: stats.following,
        reach: stats.reach,
        impressions: stats.impressions,
        profileViews: stats.profileViews,
        engagementRate: stats.engagementRate,
      },
      create: {
        accountId: account.id,
        capturedAt: stats.capturedAt,
        followers: stats.followers,
        following: stats.following,
        reach: stats.reach,
        impressions: stats.impressions,
        profileViews: stats.profileViews,
        engagementRate: stats.engagementRate,
      },
    });

    // Médias : upsert + snapshot
    const medias = await provider.fetchMedia();
    let videosTouched = 0;
    let snapshotsTouched = 0;
    for (const m of medias) {
      const video = await prisma.video.upsert({
        where: { igMediaId: m.igMediaId },
        update: {
          type: m.type,
          caption: m.caption,
          permalink: m.permalink,
          thumbnailUrl: m.thumbnailUrl,
          postedAt: m.postedAt,
          durationSec: m.durationSec,
        },
        create: {
          igMediaId: m.igMediaId,
          accountId: account.id,
          type: m.type,
          caption: m.caption,
          permalink: m.permalink,
          thumbnailUrl: m.thumbnailUrl,
          postedAt: m.postedAt,
          durationSec: m.durationSec,
        },
      });
      videosTouched++;

      const mediaStats = await provider.fetchMediaStats(m.igMediaId);
      await prisma.videoSnapshot.upsert({
        where: {
          videoId_capturedAt: {
            videoId: video.id,
            capturedAt: mediaStats.capturedAt,
          },
        },
        update: {
          views: mediaStats.views,
          likes: mediaStats.likes,
          comments: mediaStats.comments,
          shares: mediaStats.shares,
          saves: mediaStats.saves,
          reach: mediaStats.reach,
          watchTimeSec: mediaStats.watchTimeSec,
        },
        create: {
          videoId: video.id,
          capturedAt: mediaStats.capturedAt,
          views: mediaStats.views,
          likes: mediaStats.likes,
          comments: mediaStats.comments,
          shares: mediaStats.shares,
          saves: mediaStats.saves,
          reach: mediaStats.reach,
          watchTimeSec: mediaStats.watchTimeSec,
        },
      });
      snapshotsTouched++;
    }

    await prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        notes: `${videosTouched} vidéos, ${snapshotsTouched} snapshots`,
      },
    });

    return NextResponse.json({
      ok: true,
      source: provider.name,
      videos: videosTouched,
      snapshots: snapshotsTouched,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await prisma.syncRun.update({
      where: { id: run.id },
      data: {
        status: "error",
        finishedAt: new Date(),
        errorMsg: msg,
      },
    });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
