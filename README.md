# NASSFLOW AGENCY — site

Le site de l'agence : https://www.nassflow.com

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 : les jetons (couleurs, échelle typographique, mise en
  page) vivent dans `app/globals.css`
- Motion (`motion/react`) pour les animations
- Supabase (demandes de projet et de solution), Resend (notifications
  par e-mail), OpenAI (assistant du site), Higgsfield (génération
  d'images et de vidéos marketing, usage interne)
- Vercel (hébergement et Web Analytics)

## Commandes

```bash
npm install
npm run dev     # serveur de développement, http://localhost:3000
npm run build   # build de production
npm run start   # sert le build de production
npm run lint    # ESLint
npm test        # tests unitaires (node:test + tsx), sans réseau
npx tsc --noEmit
```

## Variables d'environnement

À définir dans `.env.local` en local (modèle : `.env.example`), et dans
le projet Vercel en production. Aucune valeur n'est versionnée.

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase, côté navigateur (`lib/supabase/client.ts`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase, côté navigateur |
| `SUPABASE_URL` | Supabase, côté serveur (`lib/supabase/admin.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase, côté serveur : écrit dans les tables fermées à `anon` |
| `RESEND_API_KEY` | Envoi des notifications (`lib/notifications.ts`) |
| `RESEND_FROM` | Expéditeur des notifications |
| `OPENAI_API_KEY` | Assistant du site (`app/api/chat`) |
| `HF_CREDENTIALS` | Higgsfield, serveur uniquement : `KEY_ID:KEY_SECRET` (`lib/higgsfield`) |
| `HIGGSFIELD_DRY_RUN` | `true` par défaut ; seul `false` autorise un envoi réel |
| `HIGGSFIELD_ALLOWED_ENDPOINTS` | Endpoints autorisés, séparés par des virgules (vide : aucun) |
| `HIGGSFIELD_MAX_CREDITS_PER_REQUEST` | Plafond du coût estimé par génération, obligatoire hors dry-run |
| `HIGGSFIELD_DAILY_CREDIT_BUDGET` | Plafond du coût estimé sur 24 h glissantes, obligatoire hors dry-run |

Les schémas des tables sont dans `supabase/`.

## Higgsfield

Intégration interne, pour les agents IA et les workflows de contenu de
NASSFLOW. **Aucune route publique ne l'expose** : un visiteur ne doit
jamais pouvoir dépenser des crédits. Elle s'importe côté serveur
(script, route protégée, composant serveur) depuis `lib/higgsfield`.

```ts
import { getHiggsfieldClient } from '@/lib/higgsfield';

const higgsfield = getHiggsfieldClient();
const { requestId } = await higgsfield.submit('/v1/text2image/soul', input, {
  estimatedCredits: 2,
  source: 'agent:contenu',
});
const result = await higgsfield.waitForResult(requestId);
// result.imageUrls, result.videoUrl
```

Garde-fous, dans l'ordre :

1. **Dry-run par défaut** : tant que `HIGGSFIELD_DRY_RUN` ne vaut pas
   exactement `false`, aucune requête ne part ; `submit` rend un
   `request_id` `dry-run-…` que `waitForResult` termine sans média.
2. **Liste blanche** : un endpoint absent de `HIGGSFIELD_ALLOWED_ENDPOINTS`
   est refusé, en dry-run comme en réel.
3. **Plafonds** : hors dry-run, `estimatedCredits` est obligatoire et
   comparé aux deux plafonds. L'API ne renvoie pas le coût réel : le
   budget porte sur l'estimation déclarée.
4. **Trace avant dépense** : hors dry-run, une ligne est écrite dans
   `higgsfield_generations` avant l'envoi ; si elle ne s'écrit pas, rien
   ne part.
5. **Jamais de double envoi** : le POST de génération n'est jamais
   réessayé. Sans réponse exploitable (réseau, 5xx), l'erreur
   `submit_outcome_unknown` demande de vérifier le tableau de bord avant
   de relancer. Seules les lectures de statut sont réessayées (réseau,
   429 avec `Retry-After`, 5xx).
6. **Secrets** : `HF_CREDENTIALS` n'est lue que côté serveur, l'hôte de
   l'API est figé dans le code, et le journal masque les identifiants.

Suivi : `waitForResult` interroge `GET /requests/{request_id}/status` à
intervalle croissant (2 s à 15 s) pendant 10 min au plus. Au-delà,
`poll_timeout` rend le `request_id` : la génération continue chez
Higgsfield et se reprend avec `waitForResult`. Pour une vidéo longue
dans une fonction Vercel, découper : `submit` dans un appel,
`getStatus` dans les suivants.

Erreurs : toutes sont des `HiggsfieldError` avec un `code` (`auth`,
`insufficient_credits`, `validation`, `rate_limited`, `poll_timeout`,
`generation_failed`, `nsfw`…) et un booléen `retryable`.

### Sources et points non vérifiés

Le contrat est repris du SDK officiel `@higgsfield/client` v0.2.6
(client v2), la documentation `docs.higgsfield.ai` n'ayant pas pu être
consultée. Le SDK n'est pas utilisé : il réessaie le POST de génération
et n'expose pas la lecture d'un statut par `request_id`. Restent **non
vérifiés**, donc non implémentés :

- les identifiants d'endpoint des modèles actuels (Soul, Kling, Veo…) :
  à confirmer dans la documentation avant de remplir la liste blanche ;
- l'annulation (`cancel_url` : méthode et effets inconnus) ;
- les webhooks (`hf_webhook`) et la vérification de leur signature ;
- le coût réel d'une génération (`actual_credits`, à rapprocher à la
  main) ;
- la durée de validité des URLs de résultat : recopier les médias à
  garder ;
- 402 et 403 sont tous deux traités comme crédits insuffisants.

## Repères

- `app/` : les routes, dont les fiches `solutions/[slug]` générées depuis
  le catalogue
- `components/ui/` : les composants de base (Button, Eyebrow,
  SectionTitle, TextLink)
- `components/sections/` : les sections de page
- `lib/content/` : tous les textes du site, avec leurs règles d'écriture
- `assets/fonts/` : les polices en TTF des images de partage et de
  l'icône (voir son README)
