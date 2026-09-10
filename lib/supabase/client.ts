import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Client Supabase créé à la première utilisation.
 *
 * L'ancienne version instanciait le client — et jetait une erreur en cas
 * de variable manquante — au moment de l'import du module. Next évaluant
 * ces modules pendant le prerender, une seule variable absente faisait
 * échouer le build entier au lieu de dégrader la page.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error('Configuration Supabase indisponible.');
  }

  client = createClient(url, publishableKey);

  return client;
}
