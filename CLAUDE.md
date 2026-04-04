# Project: ScriptForge (ou ton nom de SaaS)

## Description
SaaS qui transforme un lien YouTube en scripts de vidéos courtes virales.
Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (auth + DB), Stripe.

## Architecture
- /app : Pages et API routes Next.js
- /components : Composants React réutilisables  
- /lib : Utilitaires (API calls, config)
- Une seule API route principale : /api/generate

## Conventions
- TypeScript strict, pas de `any`
- Tailwind pour le styling, pas de CSS custom
- Server Components par défaut, Client Components seulement si interaction nécessaire
- Gestion d'erreurs avec try/catch sur tous les appels API
- Variables d'environnement dans .env.local

## APIs externes
- Transcript YouTube : TranscriptAPI (REST, clé dans TRANSCRIPT_API_KEY)
- Génération IA : API Anthropic Claude Sonnet (clé dans ANTHROPIC_API_KEY)  
- Paiements : Stripe (clés dans STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY)
- Auth + DB : Supabase (clés dans NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_KEY)

## Commandes
- npm run dev : serveur local port 3000
- npm run build : build production
- npm run lint : vérification code
