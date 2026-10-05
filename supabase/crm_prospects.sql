-- Le CRM de prospection interne (/crm).
-- À coller telle quelle dans l'éditeur SQL de Supabase.
--
-- Une ligne par prospect. Le score, sa justification et le premier
-- message ne sont PAS stockés : lib/crm/scoring.ts les recalcule à
-- chaque chargement depuis les colonnes de la fiche. Une règle de
-- scoring qui change s'applique ainsi à toute la base sans migration.
-- `score` est une copie, écrite à chaque enregistrement, pour trier ou
-- filtrer depuis l'éditeur SQL — jamais lue par l'application.
--
-- `activity` est l'historique (actions faites, ignorées, reportées,
-- déplacements), en jsonb : il se relit, il ne se requête pas.

create table if not exists public.crm_prospects (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Ce qu'on sait du prospect.
  company       text,
  contact_name  text,
  contact_role  text,
  email         text,
  phone         text,
  website       text,
  sector        text,
  employees     integer check (employees is null or employees >= 0),
  need          text,

  -- manuel | csv | site:assistant | site:solution
  source        text not null,
  -- La ligne d'origine d'une fiche importée du site (chat_leads:<id>,
  -- solution_requests:<id>) : un import relancé ne la duplique pas.
  source_ref    text unique,

  -- Où on en est.
  stage         text not null,
  excluded_by   text check (excluded_by in ('auto', 'manual')),
  step_index    integer not null default 0 check (step_index >= 0),
  due_on        date not null,
  score         integer check (score between 1 and 10),
  activity      jsonb not null default '[]'::jsonb,

  constraint crm_prospects_stage_check check (stage in (
    'nouveaux', 'contactes', 'interesses', 'qualifies', 'conclus', 'non_pertinent'
  ))
);

create index if not exists crm_prospects_stage_due_idx
  on public.crm_prospects (stage, due_on);

-- RLS activée et AUCUNE policy, comme les autres tables : seule la clé
-- service_role, qui ne quitte jamais le serveur, lit et écrit ici. Le
-- navigateur ne touche jamais la table : il passe par les Server
-- Actions de app/crm, protégées par CRM_PASSWORD.
alter table public.crm_prospects enable row level security;

-- Sans GRANT, service_role échoue en 42501 même RLS contournée (voir
-- chat_leads.sql).
grant select, insert, update, delete on public.crm_prospects to service_role;

-- L'import des demandes du site relit ces deux tables. chat_leads a
-- déjà son SELECT ; solution_requests a été créée sans GRANT explicite.
grant select on public.solution_requests to service_role;
grant select on public.chat_leads to service_role;
