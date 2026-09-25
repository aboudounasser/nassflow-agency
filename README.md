# NASSFLOW AGENCY — site

Le site de l'agence : https://www.nassflow.com

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 : les jetons (couleurs, échelle typographique, mise en
  page) vivent dans `app/globals.css`
- Motion (`motion/react`) pour les animations
- Supabase (demandes de projet et de solution), Resend (notifications
  par e-mail), OpenAI (assistant du site)
- Vercel (hébergement et Web Analytics)

## Commandes

```bash
npm install
npm run dev     # serveur de développement, http://localhost:3000
npm run build   # build de production
npm run start   # sert le build de production
npm run lint    # ESLint
npx tsc --noEmit
```

## Variables d'environnement

À définir dans `.env.local` en local, et dans le projet Vercel en
production. Aucune valeur n'est versionnée.

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase, côté navigateur (`lib/supabase/client.ts`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase, côté navigateur |
| `SUPABASE_URL` | Supabase, côté serveur (`lib/supabase/admin.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase, côté serveur : écrit dans les tables fermées à `anon` |
| `RESEND_API_KEY` | Envoi des notifications (`lib/notifications.ts`) |
| `RESEND_FROM` | Expéditeur des notifications |
| `OPENAI_API_KEY` | Assistant du site (`app/api/chat`) |

Les schémas des tables sont dans `supabase/`.

## Repères

- `app/` : les routes, dont les fiches `solutions/[slug]` générées depuis
  le catalogue
- `components/ui/` : les composants de base (Button, Eyebrow,
  SectionTitle, TextLink)
- `components/sections/` : les sections de page
- `lib/content/` : tous les textes du site, avec leurs règles d'écriture
- `assets/fonts/` : les polices en TTF des images de partage et de
  l'icône (voir son README)
