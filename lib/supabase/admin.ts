import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase à privilèges, réservé au serveur.
 *
 * Séparé de `lib/supabase/client.ts` à dessein : ce module lit
 * `SUPABASE_SERVICE_ROLE_KEY`, une clé qui contourne RLS et qui ne doit
 * donc jamais partir dans un bundle client. La variable n'a volontairement
 * pas le préfixe `NEXT_PUBLIC_`, ce qui empêche Next de l'inliner ; ce
 * fichier ne doit être importé que depuis une route ou un composant
 * serveur, jamais depuis un fichier marqué `'use client'`.
 *
 * Instancié à la première utilisation, comme le client public : une
 * variable absente doit échouer à l'appel, pas à l'import, sans quoi la
 * collecte des routes pendant `next build` tomberait avec elle.
 */

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient;

  // L'ordre compte, et il n'est pas celui qu'on croit.
  //
  // Ce projet n'a qu'UNE base Supabase : celle que déclare
  // `NEXT_PUBLIC_SUPABASE_URL`. Elle passe donc en premier, et
  // `SUPABASE_URL` ne sert que de repli.
  //
  // L'inverse a cassé le formulaire en production. Une intégration
  // Supabase de la place de marché Vercel injecte sa propre
  // `SUPABASE_URL`, qui pointe vers une autre base. Quand elle primait,
  // le navigateur écrivait dans la bonne base et le serveur dans la
  // mauvaise — d'où des 500 sur /api/solution-requests. Une variable
  // posée par un tiers ne doit jamais supplanter l'URL du projet, sous
  // peine que le client et le serveur ne parlent plus à la même base.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      // Aucune session à conserver : chaque requête serveur est isolée.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
