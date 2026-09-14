-- Table des demandes envoyées depuis une fiche solution.
-- À coller telle quelle dans l'éditeur SQL de Supabase.
--
-- Pourquoi `answers` est en jsonb plutôt qu'en colonnes :
-- chaque solution pose ses propres questions (voir `questions` dans
-- lib/content/solutions.ts), et le catalogue est fait pour grandir.
-- Ajouter une septième solution, ou une question de plus à une solution
-- existante, ne doit jamais demander une migration de schéma ni un
-- déploiement coordonné entre le contenu et la base. Les clés de l'objet
-- sont les `id` des questions, ce qui garde le lien avec le contenu sans
-- que la base ait à connaître le catalogue.
--
-- Les champs communs à toutes les demandes (identité, contact, secteur)
-- restent en colonnes : on les filtre et on les trie, eux.

create table if not exists public.solution_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Le slug de la solution demandée, tel qu'il apparaît dans solutions.ts.
  solution_slug text not null,

  company       text,
  contact_name  text,
  email         text not null,
  phone         text,
  sector        text,

  -- Réponses aux questions propres à la solution : { "<question.id>": "..." }.
  answers       jsonb not null default '{}'::jsonb,

  -- D'où vient la demande (page, campagne, etc.).
  source        text
);

create index if not exists solution_requests_solution_slug_idx
  on public.solution_requests (solution_slug);

create index if not exists solution_requests_created_at_idx
  on public.solution_requests (created_at desc);

-- RLS activée et AUCUNE policy créée, volontairement.
--
-- Sans policy, RLS refuse tout à `anon` et à `authenticated` : ni select,
-- ni insert. Le formulaire public n'écrit donc jamais dans la table
-- directement — il passe par une route serveur qui utilise la clé
-- service_role, laquelle contourne RLS. C'est ce qui permet de valider et
-- de nettoyer la demande côté serveur, et d'éviter qu'un visiteur puisse
-- lire les coordonnées déposées par un autre.
--
-- La clé service_role ne doit exister que dans les variables
-- d'environnement du serveur, jamais dans un fichier exposé au client.
alter table public.solution_requests enable row level security;
