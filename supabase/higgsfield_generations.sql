-- Suivi des générations Higgsfield (images, vidéos) et de leur coût.
-- À coller telle quelle dans l'éditeur SQL de Supabase.
--
-- Une ligne est écrite AVANT l'envoi à Higgsfield (statut `pending`),
-- puis complétée : request_id, statuts successifs, URLs du résultat. Si
-- l'écriture échoue, lib/higgsfield annule l'envoi — aucune dépense ne
-- doit exister sans trace.
--
-- Les coûts, en dollars (l'API est facturée en dollars, sur un solde
-- distinct des crédits d'abonnement), sont séparés et jamais mélangés :
-- - estimated_cost_usd : notre estimation avant envoi, seule base des
--   plafonds ;
-- - actual_cost_usd : le coût réel, NULL tant qu'aucune source ne l'a
--   donné — l'API, telle que vérifiée, ne le renvoie pas ;
--   actual_cost_source dit d'où il vient ;
-- - cashback_usd : une remise constatée, jamais supposée.
-- Le solde de l'API n'a pas sa place ici : ce n'est pas une propriété
-- d'une génération, et aucun endpoint connu ne permet de le lire.

create table if not exists public.higgsfield_generations (
  id                 uuid primary key,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- Chemin appelé, qui est l'identifiant du modèle :
  -- /higgsfield-ai/soul/v2/standard, /bytedance/seedance-2.0/text-to-video…
  endpoint           text not null,

  -- pending | rejected | submit_unknown | queued | in_progress
  -- | completed | failed | nsfw | canceled
  status             text not null,

  -- Vrai si rien n'est parti chez Higgsfield (HIGGSFIELD_DRY_RUN).
  dry_run            boolean not null,

  -- Identifiant Higgsfield, connu une fois l'envoi accepté — ou conservé
  -- depuis une réponse d'erreur qui le portait.
  request_id         text unique,

  -- Clé choisie par l'appelant : une même clé ne crée jamais deux
  -- générations.
  idempotency_key    text unique,

  estimated_cost_usd numeric check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  actual_cost_usd    numeric check (actual_cost_usd is null or actual_cost_usd >= 0),
  -- 'api' si l'API a donné le coût, 'console' si rapproché à la main.
  actual_cost_source text check (actual_cost_source in ('api', 'console')),
  cashback_usd       numeric check (cashback_usd is null or cashback_usd >= 0),

  -- Qui a déclenché : agent, workflow, script.
  source             text,
  metadata           jsonb not null default '{}'::jsonb,

  -- Les paramètres envoyés (prompt, format…). Jamais d'identifiants.
  input              jsonb not null default '{}'::jsonb,

  -- Les URLs rendues par Higgsfield. Leur durée de validité n'est pas
  -- documentée à ce jour : recopier les médias à garder.
  image_urls         text[] not null default '{}',
  video_url          text,

  error_code         text,
  error_message      text,
  completed_at       timestamptz,

  constraint higgsfield_generations_status_check check (status in (
    'pending', 'rejected', 'submit_unknown', 'queued', 'in_progress',
    'completed', 'failed', 'nsfw', 'canceled'
  )),

  -- Un coût réel sans source, ou une source sans coût, n'a pas de sens.
  constraint higgsfield_generations_actual_cost_check check (
    (actual_cost_usd is null) = (actual_cost_source is null)
  )
);

create index if not exists higgsfield_generations_created_at_idx
  on public.higgsfield_generations (created_at desc);

create index if not exists higgsfield_generations_status_idx
  on public.higgsfield_generations (status);

-- RLS activée et AUCUNE policy, comme solution_requests : seule la clé
-- service_role, qui ne quitte jamais le serveur, lit et écrit ici.
alter table public.higgsfield_generations enable row level security;
