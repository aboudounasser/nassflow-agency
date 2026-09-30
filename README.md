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
| `HIGGSFIELD_ALLOWED_ENDPOINTS` | Identifiants de modèle autorisés, séparés par des virgules (vide : aucun) |
| `HIGGSFIELD_MAX_COST_USD_PER_REQUEST` | Plafond du coût estimé par génération, en dollars, obligatoire hors dry-run |
| `HIGGSFIELD_DAILY_BUDGET_USD` | Plafond du coût estimé sur 24 h glissantes, en dollars, obligatoire hors dry-run |

Les schémas des tables sont dans `supabase/`.

## Higgsfield

Intégration interne, pour les agents IA et les workflows de contenu de
NASSFLOW. **Aucune route publique ne l'expose** : un visiteur ne doit
jamais pouvoir dépenser quoi que ce soit. Elle s'importe côté serveur
(script, route protégée, composant serveur) depuis `lib/higgsfield`.

```ts
import { getHiggsfieldClient, HIGGSFIELD_MODELS } from '@/lib/higgsfield';

const higgsfield = getHiggsfieldClient();
const model = HIGGSFIELD_MODELS.soulV2Standard;
const input = model.buildInput({ prompt: '…', resolution: '720p', batch_size: 1 });

const { generationId, requestId } = await higgsfield.submit(model.endpoint, input, {
  estimatedCostUsd: model.estimateCost(input).estimatedCostUsd,
  idempotencyKey: 'campagne-42/visuel-1',
  source: 'agent:contenu',
});
const result = await higgsfield.waitForResult(requestId);
// result.imageUrls, result.videoUrl
```

Modèles de référence (`lib/higgsfield/models.ts`) : l'identifiant du
modèle est le chemin de l'endpoint.

| Modèle | Endpoint | Estimation |
|---|---|---|
| Soul v2 standard (image) | `/higgsfield-ai/soul/v2/standard` | 0,0032 $ (720p) ou 0,0057 $ (1080p) × `batch_size` |
| Seedance 2.0 text-to-video | `/bytedance/seedance-2.0/text-to-video` | 0,0985 $ × secondes — **plancher** (`lowerBound`) |

`buildInput` rend chaque paramètre explicite et refuse tout paramètre
inconnu ; `estimateCost` dit si l'estimation est un plancher.

Garde-fous, dans l'ordre :

1. **Dry-run par défaut** : tant que `HIGGSFIELD_DRY_RUN` ne vaut pas
   exactement `false`, aucune requête ne part ; `submit` rend un
   `request_id` `dry-run-…` que `waitForResult` termine sans média.
2. **Liste blanche** : un endpoint absent de `HIGGSFIELD_ALLOWED_ENDPOINTS`
   est refusé, en dry-run comme en réel.
3. **Idempotence** : hors dry-run, `idempotencyKey` est obligatoire. Une
   clé déjà vue ne crée jamais de deuxième génération : `submit` rend la
   première (`deduplicated: true`) si elle a un `request_id`, et lève
   sinon (`idempotency_conflict` après un refus, `submit_outcome_unknown`
   si son sort est inconnu).
4. **Plafonds** : hors dry-run, `estimatedCostUsd` est obligatoire et
   comparé aux deux plafonds. Le budget porte sur l'estimation déclarée.
5. **Trace avant dépense** : hors dry-run, une ligne est écrite dans
   `higgsfield_generations` avant l'envoi ; si elle ne s'écrit pas, rien
   ne part.
6. **Jamais de double envoi** : le POST de génération (délai : 120 s)
   n'est jamais réessayé. Sans réponse exploitable (délai dépassé,
   réseau, 5xx, corps illisible), l'erreur `submit_outcome_unknown`
   conserve le `request_id` s'il est connu, et `reconcile(generationId)`
   relit alors une fois le statut — sans jamais rien renvoyer. Sans
   `request_id`, `reconcile` rend `manual_check_required` : vérifier dans
   la console Higgsfield. Seules les lectures de statut sont réessayées
   (réseau, 429 avec `Retry-After`, 5xx).
7. **Secrets** : `HF_CREDENTIALS` n'est lue que côté serveur, l'hôte de
   l'API est figé dans le code, et le journal masque les identifiants.

Suivi : `waitForResult` interroge `GET /requests/{request_id}/status` à
intervalle croissant (2 s à 15 s) pendant 10 min au plus. Au-delà,
`poll_timeout` rend le `request_id` : la génération continue chez
Higgsfield et se reprend avec `waitForResult` ou `reconcile`, jamais en
rappelant `generate`. Pour une vidéo longue dans une fonction Vercel,
découper : `submit` dans un appel, `reconcile` dans les suivants.

Erreurs : toutes sont des `HiggsfieldError` avec un `code` et un booléen
`retryable` — `auth` (401), `insufficient_balance` (402),
`insufficient_credits` (403), `not_found` (404), `bad_input` et
`concurrency_limited` (400), `validation` (422), `rate_limited` (429),
`submit_outcome_unknown`, `poll_timeout`, `generation_failed`, `nsfw`,
`idempotency_conflict`…

Coûts, en dollars, jamais mélangés (table `higgsfield_generations`) :

- `estimated_cost_usd` : notre estimation avant envoi, seule base des
  plafonds ;
- `actual_cost_usd` + `actual_cost_source` : le coût réel, `NULL` tant
  qu'aucune source ne l'a donné (`api` si l'API le renvoie un jour,
  `console` si rapproché à la main) ;
- `cashback_usd` : une remise constatée, jamais supposée ;
- le solde de l'API n'est stocké nulle part : aucun endpoint connu ne
  le rend, il se lit dans la console Higgsfield.

### Sources et points non vérifiés

Le contrat HTTP (hôte, authentification, `POST /{model_id}`, lecture du
statut, statuts, `images` / `video`, 401 / 403 / 422) est repris du code
du SDK officiel `@higgsfield/client` v0.2.6. Le SDK n'est pas utilisé :
`subscribe()` réessaie le POST de génération et il n'expose ni la
lecture d'un statut par `request_id`, ni l'annulation.

Viennent de pages officielles (docs.higgsfield.ai, open.higgsfield.ai)
connues **par un résumé de recherche**, non lues mot pour mot faute
d'accès réseau : les identifiants et paramètres des deux modèles, leurs
prix, la facturation en dollars, les codes 400 (concurrence), 402 et
404, l'absence d'endpoint de solde. À relire à la source avant la
première génération réelle.

Restent **non vérifiés, donc non implémentés** :

- l'annulation (méthode HTTP de `cancel_url` non confirmée) ;
- les webhooks (`hf_webhook`) et la vérification de leur signature ;
- le libellé exact du 400 de concurrence (reconnu à « concurren ») ;
- les valeurs acceptées de `resolution` et `aspect_ratio` ;
- le tarif de Seedance selon la résolution et le son ;
- l'existence d'un cashback ;
- la durée de validité des URLs de résultat : recopier les médias à
  garder.

## Repères

- `app/` : les routes, dont les fiches `solutions/[slug]` générées depuis
  le catalogue
- `components/ui/` : les composants de base (Button, Eyebrow,
  SectionTitle, TextLink)
- `components/sections/` : les sections de page
- `lib/content/` : tous les textes du site, avec leurs règles d'écriture
- `assets/fonts/` : les polices en TTF des images de partage et de
  l'icône (voir son README)
