// CLI wrapper: appelle la logique partagée dans lib/seed-runtime.ts
// Lancement : `npm run db:seed`
import { runSeed } from "../lib/seed-runtime";
import { prisma } from "../lib/db";

async function main() {
  console.log("🌱 Seeding mock Instagram data...");
  const result = await runSeed();
  console.log(
    `✅ Seed done — @${result.account}, ${result.videos} videos, ${result.snapshots} snapshots, ${result.days} days`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
