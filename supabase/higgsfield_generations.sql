-- Suivi des générations Higgsfield (images, vidéos) et de leur coût.
-- À coller telle quelle dans l'éditeur SQL de Supabase.
--
-- Une ligne est écrite AVANT l'envoi à Higgsfield (statut `pending`),
-- puis complétée : request_id, statuts successifs, URLs du résultat. Si
-- l'écriture échoue, lib/higgsfield annule l'envoi — aucune dépense ne
-- doit exister sans trace.
--
-- Le coût est une ESTIMATION déclarée par l'appelant : l'API, telle que
-- vérifiée, ne renvoie pas le nombre de crédits consommés. Le montant réel
-- se lit dans le tableau de bord Higgsfield ; `actual_credits` est là pour
-- le rapprochement, à la main pour l'instant.

create table if not exists public.higgsfield_generations (
  id                uuid primary key,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Chemin appelé, ex. /v1/text2image/soul.
  endpoint          text not null,

  -- pending | rejected | submit_unknown | queued | in_progress
  -- | completed | failed | nsfw | canceled
  status            text not null,

  -- Vrai si rien n'est parti chez Higgsfield (HIGGSFIELD_DRY_RUN).
  dry_run           boolean not null,

  -- Identifiant Higgsfield, connu une fois l'envoi accepté.
  request_id        text unique,

  estimated_credits numeric,
  actual_credits    numeric,

  -- Qui a déclenché : agent, workflow, script.
  source            text,
  metadata          jsonb not null default '{}'::jsonb,

  -- Les paramètres envoyés (prompt, format…). Jamais d'identifiants.
  input             jsonb not null default '{}'::jsonb,

  -- Les URLs rendues par Higgsfield. Leur durée de validité n'est pas
  -- documentée à ce jour : recopier les médias à garder.
  image_urls        text[] not null default '{}',
  video_url         text,

  error_code        text,
  error_message     text,
  completed_at      timestamptz,

  constraint higgsfield_generations_status_check check (status in (
    'pending', 'rejected', 'submit_unknown', 'queued', 'in_progress',
    'completed', 'failed', 'nsfw', 'canceled'
  ))
);

create index if not exists higgsfield_generations_created_at_idx
  on public.higgsfield_generations (created_at desc);

create index if not exists higgsfield_generations_status_idx
  on public.higgsfield_generations (status);

-- RLS activée et AUCUNE policy, comme solution_requests : seule la clé
-- service_role, qui ne quitte jamais le serveur, lit et écrit ici.
alter table public.higgsfield_generations enable row level security;
