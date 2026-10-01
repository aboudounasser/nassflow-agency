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
 *   const model = HIGGSFIELD_MODELS.soulV2Standard;
 *   const input = model.buildInput({ prompt: '…', resolution: '720p' });
 *   const { requestId } = await higgsfield.submit(model.endpoint, input, {
 *     estimatedCostUsd: model.estimateCost(input).estimatedCostUsd,
 *     idempotencyKey: 'campagne-42/visuel-1',
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

export { createHiggsfieldClient, SUBMIT_TIMEOUT_MS, STATUS_TIMEOUT_MS } from './client';
export type {
  HiggsfieldClient,
  HiggsfieldClientDeps,
  ReconcileResult,
  SubmitResult,
} from './client';
export { readHiggsfieldConfig, HIGGSFIELD_BASE_URL } from './config';
export type { HiggsfieldConfig } from './config';
export { HiggsfieldError } from './errors';
export type { HiggsfieldErrorCode } from './errors';
export { createMemoryGenerationStore } from './tracking';
export type {
  ActualCostSource,
  GenerationPatch,
  GenerationRecord,
  GenerationStatus,
  GenerationStore,
} from './tracking';
export {
  HIGGSFIELD_MODELS,
  SEEDANCE_I2V_PROMPT_FIELD,
  SEEDANCE_I2V_PROMPT_FIELD_CONFIRMED,
  SEEDANCE_25_I2V_RESOLUTION_AUDIO_CONFIRMED,
  seedance20ImageToVideo,
  seedance25ImageToVideo,
  seedance20TextToVideo,
  soulV2Standard,
} from './models';
export type {
  CostEstimate,
  HiggsfieldModel,
  Seedance20ImageToVideoInput,
  Seedance25ImageToVideoInput,
  Seedance20TextToVideoInput,
  SoulV2StandardInput,
} from './models';
export type {
  HiggsfieldInput,
  HiggsfieldResult,
  HiggsfieldStatus,
  SubmitOptions,
  WaitOptions,
} from './types';
