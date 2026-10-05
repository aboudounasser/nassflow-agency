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
| `CRM_USER` | Identifiant du CRM interne (`/crm`), `nassflow` par défaut |
| `CRM_PASSWORD` | Mot de passe du CRM ; absent, `/crm` répond 404 en production |

Les schémas des tables sont dans `supabase/`.

## CRM de prospection (`/crm`)

Un tableau Kanban interne pour vendre nos agents IA et automatisations.
Six colonnes : **Nouveaux prospects, Contactés, Intéressés, Qualifiés,
Conclus** et **Non pertinent**.

Mise en route : exécuter `supabase/crm_prospects.sql` dans Supabase,
définir `CRM_PASSWORD` (et `CRM_USER` si besoin), ouvrir `/crm`. Sans
Supabase, en local, le tableau tourne en mémoire avec des fiches
d'exemple fictives, perdues au redémarrage.

**Accès.** Authentification HTTP Basic, vérifiée par `proxy.ts`, par
la page et par chaque Server Action (`lib/crm/auth.ts`). Sans
`CRM_PASSWORD`, `/crm` répond 404 en production. La page n'est ni dans
le sitemap ni indexée.

**Fiches.** Ajout à la main, import CSV (séparateur et colonnes
reconnus automatiquement, en français ou en anglais) ou import des
demandes du site (`chat_leads`, `solution_requests`, sans doublon).
Chaque carte affiche l'entreprise, le responsable et ses coordonnées,
le score, la phrase qui le justifie et un premier message à envoyer
(copie ou ouverture dans la messagerie).

**Score sur 10** (`lib/crm/scoring.ts`), calculé sans réseau ni IA,
donc toujours explicable : 1 point de base, plus trois critères notés
sur 3 :

1. Joignable : e-mail pro valide (2), e-mail grand public (1),
   téléphone valide (+1). Adresses jetables, d'exemple et numéros
   factices refusés.
2. Une entreprise : un nom (ou un nom déduit du domaine e-mail), forme
   juridique, site, domaine propre, secteur, effectif, décideur.
3. Besoin d'un agent IA autonome : tâches que nos agents prennent en
   charge (service client, demandes entrantes, rendez-vous, devis,
   e-mails, ressaisie), douleur exprimée, demande venue du site, taille
   et secteur ; « pas de budget », « déjà équipé » font baisser la note.

Plafonds : injoignable → 3 au plus, particulier → 4 au plus. **Sous 5,
la fiche part d'office en « Non pertinent »** et ne peut pas en sortir
à la main ; complétée et repassée à 5, elle revient en « Nouveaux
prospects ». Le score n'est pas stocké comme une vérité : il se
recalcule au chargement, donc une règle modifiée s'applique à toute la
base.

**Actions recommandées** (`lib/crm/cadence.ts`). Chaque colonne a sa
séquence (premier message ; relance, appel, LinkedIn, dernier
message ; appel de découverte ; proposition, relance, appel de
décision ; lancement, point de satisfaction…), puis une action
d'entretien qui se répète. Les dates suivent ce qu'on fait :

- **Fait** : l'action suivante est datée à partir du jour où on l'a
  faite (le premier message fait passe la fiche en « Contactés ») ;
- **Ignorer** : l'action suivante arrive plus tôt, puisque le prospect
  n'a rien reçu ; le premier message, lui, revient le lendemain ;
- **Reporter** : la même action, 1, 3, 7 ou 30 jours plus tard ;
- **rien fait** : l'action passe en retard et tout le plan qui suit
  glisse avec aujourd'hui, jusqu'à ce qu'on agisse.

Déplacer une carte (glisser-déposer, ou « Déplacer vers ») relance la
séquence de sa nouvelle colonne. Les dates sont des jours, à l'heure de
Paris.

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
- `lib/crm/` : le CRM, en fonctions pures testées (score, cadence,
  import) ; `app/crm/` : la page, ses Server Actions et le tableau
- `assets/fonts/` : les polices en TTF des images de partage et de
  l'icône (voir son README)
