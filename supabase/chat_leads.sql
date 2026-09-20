-- Les demandes de rappel déposées depuis l'assistant.
-- À coller telle quelle dans l'éditeur SQL de Supabase.
--
-- Pourquoi une table de plus plutôt qu'une colonne dans
-- `solution_requests` : une demande née d'une conversation n'a ni slug
-- de solution ni réponses aux questions du catalogue. Elle a une
-- conversation, ce que les deux autres tables n'ont pas.
--
-- `transcript` est en jsonb et non en texte : on veut pouvoir relire
-- qui a dit quoi, pas un bloc aplati. Chaque élément vaut
-- { "role": "user" | "assistant", "content": "..." }.

create table if not exists public.chat_leads (
  id         uuid primary key default gen_random_uuid(),

  -- Le seul champ obligatoire : sans lui, on ne peut pas rappeler.
  email      text not null,
  first_name text,
  need       text,

  -- La conversation qui a mené à la demande, dans l'ordre.
  transcript jsonb not null default '[]'::jsonb,

  -- La page depuis laquelle l'assistant était ouvert.
  page       text,

  created_at timestamptz not null default now()
);

create index if not exists chat_leads_created_at_idx
  on public.chat_leads (created_at desc);

-- RLS activée et AUCUNE policy, comme pour `solution_requests` : `anon`
-- ne doit ni lire ni écrire ici. Seule la route serveur, munie de la
-- clé service_role, y accède — sans quoi un visiteur pourrait lire les
-- conversations déposées par les autres.
alter table public.chat_leads enable row level security;

-- Ces deux GRANT ne sont pas facultatifs.
--
-- `service_role` contourne RLS, mais RLS et les privilèges SQL sont
-- deux mécanismes distincts : sans GRANT, l'insert échoue en 42501
-- (« permission denied for table »), RLS désactivée ou non. C'est
-- exactement ce qui bloque aujourd'hui `project_requests` et
-- `contact_requests`, où service_role n'a même pas le SELECT.
--
-- Le SELECT sert à relire les demandes depuis le serveur ; il n'ouvre
-- rien au navigateur, qui n'a jamais cette clé.
grant insert on public.chat_leads to service_role;
grant select on public.chat_leads to service_role;
