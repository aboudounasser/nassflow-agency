-- Le formulaire de diagnostic (/demarrer-un-projet).
-- À coller telle quelle dans l'éditeur SQL de Supabase. Rejouable sans
-- risque : chaque instruction est idempotente.
--
-- La table existe déjà : on n'y fait qu'AJOUTER des colonnes, toutes
-- nullables. Aucune colonne n'est supprimée ni renommée — les anciennes
-- demandes restent lisibles telles quelles, et la route serveur continue
-- de remplir les anciennes colonnes utiles (company, first_name,
-- last_name, professional_email, phone, main_need, current_tools,
-- project_description).

alter table public.project_requests
  add column if not exists sector           text,
  add column if not exists company_size     text,
  add column if not exists problem          text,
  add column if not exists problem_details  text,
  add column if not exists tools            text[],
  add column if not exists monthly_volume   text,
  add column if not exists expected_outcome text,
  add column if not exists consent_at       timestamptz,
  -- Déjà présente si l'ancien formulaire l'a créée (« comment nous
  -- avez-vous connus ») : `if not exists` la laisse alors intacte.
  add column if not exists source           text,
  -- L'identifiant d'envoi, tiré au hasard par le navigateur à
  -- l'affichage du formulaire. L'index unique ci-dessous garantit qu'un
  -- même envoi rejoué (double clic, réseau qui relance) ne crée qu'une
  -- ligne.
  add column if not exists submission_id    uuid;

create unique index if not exists project_requests_submission_id_key
  on public.project_requests (submission_id);

-- Sans GRANT, service_role reçoit « permission denied for table »
-- (42501), même s'il contourne RLS : ce sont deux mécanismes distincts.
-- Pas de SELECT : la route n'en a pas besoin (elle insère sans relire).
grant insert on public.project_requests to service_role;

-- Si `id` est tiré d'une séquence (serial / identity), l'insertion a
-- aussi besoin de l'usage de cette séquence. Sans séquence (uuid par
-- défaut), ce bloc ne fait rien.
do $$
declare
  seq text := pg_get_serial_sequence('public.project_requests', 'id');
begin
  if seq is not null then
    execute format('grant usage on sequence %s to service_role', seq);
  end if;
end $$;
