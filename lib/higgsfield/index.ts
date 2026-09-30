import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { createHiggsfieldClient, type HiggsfieldClient, type HiggsfieldClientDeps } from './client';
import { createSupabaseGenerationStore } from './supabase-store';

/**
 * Point d'entrée de l'intégration Higgsfield, côté serveur uniquement.
 *
 * À importer depuis un script, une route protégée ou un composant
 * serveur — jamais depuis un fichier `'use client'`. Aucune route
 * publique ne l'expose : un visiteur ne doit jamais pouvoir dépenser des
 * crédits.
 *
 * Usage :
 *
 *   const higgsfield = getHiggsfieldClient();
 *   const { requestId } = await higgsfield.submit(endpoint, input, {
 *     estimatedCredits: 2,
 *     source: 'agent:contenu',
 *   });
 *   const result = await higgsfield.waitForResult(requestId);
 */

export function getHiggsfieldClient(deps: HiggsfieldClientDeps = {}): HiggsfieldClient {
  const supabase = getSupabaseAdminClient();

  return createHiggsfieldClient({
    store: supabase ? createSupabaseGenerationStore(supabase) : null,
    ...deps,
  });
}

export { createHiggsfieldClient } from './client';
export type { HiggsfieldClient, HiggsfieldClientDeps, SubmitResult } from './client';
export { readHiggsfieldConfig, HIGGSFIELD_BASE_URL } from './config';
export type { HiggsfieldConfig } from './config';
export { HiggsfieldError } from './errors';
export type { HiggsfieldErrorCode } from './errors';
export { createMemoryGenerationStore } from './tracking';
export type { GenerationRecord, GenerationStore, GenerationStatus } from './tracking';
export type {
  HiggsfieldInput,
  HiggsfieldResult,
  HiggsfieldStatus,
  SubmitOptions,
  WaitOptions,
} from './types';
