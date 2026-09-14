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

  // `SUPABASE_URL` prime si elle existe, sinon on réutilise l'URL
  // publique : c'est le même projet, seule la clé diffère.
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

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
