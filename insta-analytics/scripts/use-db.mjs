#!/usr/bin/env node
// Swap automatique du schema Prisma selon DATABASE_URL.
// - postgres:// ou postgresql://  -> utilise schema.postgres.prisma
// - autre (file:./...)            -> garde schema.prisma (SQLite par défaut)
//
// Idempotent. Tourne en pré-build (Vercel) et post-install.

import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sqlitePath = join(root, "prisma", "schema.prisma");
const pgPath = join(root, "prisma", "schema.postgres.prisma");
const backupPath = join(root, "prisma", ".schema.sqlite.bak.prisma");

const url = (process.env.DATABASE_URL ?? "").trim();
const isPostgres = /^postgres(ql)?:\/\//i.test(url);

if (!existsSync(pgPath)) {
  console.log("[use-db] schema.postgres.prisma absent, skip.");
  process.exit(0);
}

if (isPostgres) {
  // Sauvegarde une seule fois la version SQLite si pas déjà fait.
  if (!existsSync(backupPath)) {
    copyFileSync(sqlitePath, backupPath);
  }
  // Vérifie si le schema actif est déjà Postgres
  const current = existsSync(sqlitePath) ? readFileSync(sqlitePath, "utf8") : "";
  if (!current.includes('provider = "postgresql"')) {
    copyFileSync(pgPath, sqlitePath);
    console.log("[use-db] DATABASE_URL postgres -> schema.prisma swapped to postgres.");
  } else {
    console.log("[use-db] schema already postgres, no change.");
  }
} else {
  // Retour à SQLite si on a une sauvegarde
  if (existsSync(backupPath)) {
    const current = existsSync(sqlitePath) ? readFileSync(sqlitePath, "utf8") : "";
    if (current.includes('provider = "postgresql"')) {
      copyFileSync(backupPath, sqlitePath);
      console.log("[use-db] Non-postgres URL -> schema.prisma restored to SQLite.");
    }
  } else {
    console.log("[use-db] No backup, keeping current schema (assumed SQLite).");
  }
}
