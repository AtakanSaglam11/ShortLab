# Insta Analytics

Analytics Instagram personnelles — auto-hébergées, honnêtes, denses.

> ⚠️ Projet **autonome**. Il vit dans le repo ShortLab mais n'a aucun lien avec
> l'app Shorzy à la racine. Tu peux à tout moment l'extraire avec
> `mv insta-analytics ../insta-analytics && cd ../insta-analytics && git init`.

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 + shadcn/ui (composants, dark mode par défaut)
- Recharts pour les graphiques
- Prisma + SQLite en local (migrable Postgres en prod)
- Zod pour la validation d'environnement

## Démarrage rapide (local)

```bash
cd insta-analytics
cp .env.example .env.local           # déjà configuré pour le mode mock
npm install
npx prisma migrate dev --name init   # crée prisma/dev.db
npm run db:seed                      # 6 mois de données factices
npm run dev                          # http://localhost:3001
```

Le port `3001` est utilisé pour ne pas collisionner avec Shorzy (3000).

## Scripts

| Commande            | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server sur 3001                                  |
| `npm run build`     | Build prod                                           |
| `npm start`         | Démarre le build prod                                |
| `npm run lint`      | ESLint                                               |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm run db:migrate`| Crée/applique une migration                          |
| `npm run db:seed`   | Réinjecte les 50 vidéos + 180 jours de mock data     |
| `npm run db:reset`  | `migrate reset` + reseed                             |
| `npm run db:studio` | Prisma Studio sur la DB                              |

## Variables d'environnement

Tout est dans `.env.example`. Les essentielles :

| Variable              | Rôle                                                    |
| --------------------- | ------------------------------------------------------- |
| `DATA_SOURCE`         | `mock` (défaut, données factices) ou `ig` (Graph API)   |
| `DATABASE_URL`        | SQLite par défaut, URL Postgres en prod                 |
| `IG_ACCESS_TOKEN`     | Token long-lived Instagram Graph (voir plus bas)        |
| `IG_USER_ID`          | ID utilisateur Instagram Business/Creator               |
| `CRON_SECRET`         | Token Bearer pour `/api/cron/daily`                     |
| `AUTH_PASSWORD`       | Si défini, active basic-auth `admin:<password>` (prod)  |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app                                   |

## Instagram Graph API — setup

Procédure rapide pour générer le token long-lived (60 jours).

1. **Pré-requis**
   - Compte Instagram en **Business** ou **Creator** (Réglages → Compte → Passer à un compte pro).
   - Page Facebook liée à ce compte Instagram.

2. **App Meta**
   - https://developers.facebook.com/apps/ → "Créer une app" → type _Business_.
   - Ajouter le produit **Instagram Graph API** (et **Facebook Login**).

3. **Token de test (1 heure)**
   - Va sur https://developers.facebook.com/tools/explorer/
   - Sélectionne ton app, demande les permissions :
     `instagram_basic`, `instagram_manage_insights`, `pages_show_list`,
     `pages_read_engagement`.
   - Récupère le token user.

4. **Échanger contre un token long-lived (60 jours)**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/oauth/access_token?\
   grant_type=fb_exchange_token&\
   client_id=APP_ID&\
   client_secret=APP_SECRET&\
   fb_exchange_token=SHORT_TOKEN"
   ```
   Réponse : `{ "access_token": "EAA...", "expires_in": 5183944 }`.

5. **Trouver `IG_USER_ID`**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=LONG_TOKEN"
   # → récupère le PAGE_ID de la page Facebook liée
   curl -s "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=LONG_TOKEN"
   # → instagram_business_account.id = IG_USER_ID
   ```

6. **Renseigner**
   ```env
   DATA_SOURCE=ig
   IG_ACCESS_TOKEN=EAA...
   IG_USER_ID=178414...
   ```
   Puis `npm run dev`, et clique sur _Refresh_ dans le dashboard (à venir).

> Le token long-lived expire après 60 jours. Une route de refresh
> (`/api/sync` ré-échange le token tous les ~30 jours) sera ajoutée à
> l'étape sync.

## Modèle de données

```
Account
 └── AccountSnapshot[]       (1 / jour, stats globales)
 └── Video[]
      └── VideoSnapshot[]    (1 / jour, métriques par vidéo)
      └── Conversion[]       (clics / signups Shorzy)
SyncRun                      (historique des synchros)
```

## Architecture

```
insta-analytics/
├── app/                     Routes Next.js (dashboard, videos, insights, shorzy, api)
├── components/              UI (shadcn ui/, layout, charts, ...)
├── lib/
│   ├── db.ts                PrismaClient singleton
│   ├── env.ts               Validation Zod du .env
│   ├── format.ts            Helpers d'affichage (1.2k, +12%, etc.)
│   ├── utils.ts             cn() helper
│   ├── instagram/           Providers (mock | graph API)
│   └── analytics/           Trends, patterns, alerts, corrélations
├── prisma/                  Schéma, migrations, seed
└── middleware.ts            Basic-auth stub (prod uniquement)
```

## Déploiement

### Vercel (le plus simple)
1. Crée un projet Vercel pointant sur ce dossier (`root: insta-analytics`).
2. Provisionne un Postgres (Vercel Postgres / Neon / Supabase).
3. Dans `prisma/schema.prisma`, change `provider = "postgresql"`.
4. Variables Vercel : `DATABASE_URL`, `DATA_SOURCE=ig`, `IG_ACCESS_TOKEN`,
   `IG_USER_ID`, `CRON_SECRET`, `AUTH_PASSWORD`, `NEXT_PUBLIC_APP_URL`.
5. Add un Vercel Cron sur `/api/cron/daily` (header `Authorization: Bearer $CRON_SECRET`).

### VPS / Docker
- Postgres + Node 20+ + pm2 ou systemd.
- `prisma migrate deploy` à chaque release.
- Reverse-proxy nginx, et configure un `cron` qui appelle `/api/cron/daily`.

## Migration SQLite → Postgres

```bash
# 1. Dump SQLite (optionnel — en perso on repart souvent à zéro)
sqlite3 prisma/dev.db ".dump" > backup.sql

# 2. Changer prisma/schema.prisma : provider = "postgresql"
# 3. Mettre DATABASE_URL=postgresql://...
npx prisma migrate dev --name init-pg
npm run db:seed     # ou import manuel des données réelles
```
