import { normalizeEndpoint } from './config';
import { HiggsfieldError } from './errors';

/**
 * Les modèles de référence de NASSFLOW : schéma d'entrée et estimation
 * de coût.
 *
 * Sources, à relire avant toute génération réelle :
 * - identifiants et noms des paramètres : pages officielles
 *   open.higgsfield.ai/models/<id> et docs.higgsfield.ai, connues par un
 *   résumé de recherche — non lues mot pour mot, l'environnement de
 *   développement n'y ayant pas accès ;
 * - prix : mêmes sources, même réserve.
 *
 * D'où deux règles :
 * - les entrées sont construites EXPLICITEMENT (aucune valeur laissée au
 *   défaut de l'API, qu'on ne connaît pas) et tout paramètre inconnu est
 *   refusé : une faute de frappe ne doit pas partir chez Higgsfield ;
 * - une estimation dit si elle est un plancher (`lowerBound`) : un prix
 *   annoncé « à partir de » ne garantit pas le coût réel.
 */

export interface CostEstimate {
  /** Coût ESTIMÉ, en dollars. Jamais un coût réel. */
  estimatedCostUsd: number;
  /** Vrai si le prix connu est un minimum : le réel peut dépasser. */
  lowerBound: boolean;
  /** Le calcul, lisible, pour le suivi et les journaux. */
  basis: string;
}

export interface HiggsfieldModel<TInput extends Record<string, unknown>> {
  /** L'identifiant officiel, qui est aussi le chemin de l'endpoint. */
  id: string;
  endpoint: string;
  output: 'image' | 'video';
  /** Valide et complète une entrée ; lève `bad_input` sinon. */
  buildInput(input: Partial<TInput> & { prompt: string }): TInput;
  estimateCost(input: TInput): CostEstimate;
}

function fail(model: string, message: string): never {
  throw new HiggsfieldError('bad_input', `${model} : ${message}`);
}

function rejectUnknownKeys(model: string, input: object, known: readonly string[]) {
  const unknown = Object.keys(input).filter((key) => !known.includes(key));

  if (unknown.length > 0) {
    fail(model, `paramètre(s) inconnu(s) ${unknown.join(', ')} ; attendus : ${known.join(', ')}.`);
  }
}

function requirePrompt(model: string, prompt: unknown): string {
  if (typeof prompt !== 'string' || prompt.trim() === '') {
    fail(model, 'prompt obligatoire.');
  }

  return prompt.trim();
}

function optionalString(model: string, name: string, value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') fail(model, `${name} doit être une chaîne.`);

  return value.trim();
}

/** Arrondi au millième de cent : assez pour sommer sans bruit flottant. */
function usd(value: number): number {
  return Math.round(value * 100_000) / 100_000;
}

// ─── Image : Soul v2 standard ─────────────────────────────────────────

const SOUL_ID = 'higgsfield-ai/soul/v2/standard';

/**
 * Prix par image annoncés : 0,0032 $ en 720p, 0,0057 $ en 1080p. Ce sont
 * aussi les deux seules résolutions acceptées ici, faute d'en connaître
 * d'autres.
 */
export const SOUL_V2_PRICE_USD_PER_IMAGE = {
  '720p': 0.0032,
  '1080p': 0.0057,
} as const;

export type SoulV2Resolution = keyof typeof SOUL_V2_PRICE_USD_PER_IMAGE;

export interface SoulV2StandardInput extends Record<string, unknown> {
  prompt: string;
  resolution: SoulV2Resolution;
  /** Nombre d'images : multiplie le coût. */
  batch_size: number;
  aspect_ratio?: string;
  seed?: number;
  enhance_prompt?: boolean;
}

const SOUL_KEYS = ['prompt', 'resolution', 'batch_size', 'aspect_ratio', 'seed', 'enhance_prompt'] as const;

/** Plafond local : au-delà, c'est une série, pas une génération. */
const SOUL_MAX_BATCH = 4;

export const soulV2Standard: HiggsfieldModel<SoulV2StandardInput> = {
  id: SOUL_ID,
  endpoint: normalizeEndpoint(SOUL_ID),
  output: 'image',

  buildInput(input) {
    rejectUnknownKeys(SOUL_ID, input, SOUL_KEYS);

    const resolution = input.resolution ?? '720p';
    if (!(resolution in SOUL_V2_PRICE_USD_PER_IMAGE)) {
      fail(SOUL_ID, `resolution doit valoir ${Object.keys(SOUL_V2_PRICE_USD_PER_IMAGE).join(' ou ')}.`);
    }

    const batchSize = input.batch_size ?? 1;
    if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > SOUL_MAX_BATCH) {
      fail(SOUL_ID, `batch_size doit être un entier de 1 à ${SOUL_MAX_BATCH}.`);
    }

    if (input.seed !== undefined && !Number.isInteger(input.seed)) {
      fail(SOUL_ID, 'seed doit être un entier.');
    }

    if (input.enhance_prompt !== undefined && typeof input.enhance_prompt !== 'boolean') {
      fail(SOUL_ID, 'enhance_prompt doit être un booléen.');
    }

    const aspectRatio = optionalString(SOUL_ID, 'aspect_ratio', input.aspect_ratio);

    return {
      prompt: requirePrompt(SOUL_ID, input.prompt),
      resolution,
      batch_size: batchSize,
      ...(aspectRatio === undefined ? {} : { aspect_ratio: aspectRatio }),
      ...(input.seed === undefined ? {} : { seed: input.seed }),
      ...(input.enhance_prompt === undefined ? {} : { enhance_prompt: input.enhance_prompt }),
    };
  },

  estimateCost(input) {
    const unit = SOUL_V2_PRICE_USD_PER_IMAGE[input.resolution];

    return {
      estimatedCostUsd: usd(unit * input.batch_size),
      lowerBound: false,
      basis: `${input.batch_size} image(s) × ${unit} $ (${input.resolution}, prix annoncé non vérifié)`,
    };
  },
};

// ─── Vidéo : Seedance 2.0 text-to-video ───────────────────────────────

const SEEDANCE_ID = 'bytedance/seedance-2.0/text-to-video';

/**
 * Prix annoncé « à partir de » 0,0985 $ par seconde. Le tarif selon la
 * résolution et le son n'est pas connu : l'estimation est donc un
 * PLANCHER, et les plafonds doivent garder de la marge.
 */
export const SEEDANCE_2_0_MIN_PRICE_USD_PER_SECOND = 0.0985;

/** Durée maximale annoncée. */
export const SEEDANCE_2_0_MAX_DURATION_S = 15;

export interface Seedance20TextToVideoInput extends Record<string, unknown> {
  prompt: string;
  /** Secondes : multiplie le coût. */
  duration: number;
  resolution: string;
  generate_audio: boolean;
  aspect_ratio?: string;
}

const SEEDANCE_KEYS = ['prompt', 'duration', 'resolution', 'generate_audio', 'aspect_ratio'] as const;

export const seedance20TextToVideo: HiggsfieldModel<Seedance20TextToVideoInput> = {
  id: SEEDANCE_ID,
  endpoint: normalizeEndpoint(SEEDANCE_ID),
  output: 'video',

  buildInput(input) {
    rejectUnknownKeys(SEEDANCE_ID, input, SEEDANCE_KEYS);

    const duration = input.duration ?? 5;
    if (
      typeof duration !== 'number' ||
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > SEEDANCE_2_0_MAX_DURATION_S
    ) {
      fail(SEEDANCE_ID, `duration doit être un entier de 1 à ${SEEDANCE_2_0_MAX_DURATION_S} secondes.`);
    }

    // Valeurs acceptées par l'API non vérifiées (« de 480p à 4K ») :
    // transmise telle quelle, toujours explicite (480p par défaut).
    const resolution = optionalString(SEEDANCE_ID, 'resolution', input.resolution) ?? '480p';

    const generateAudio = input.generate_audio ?? false;
    if (typeof generateAudio !== 'boolean') {
      fail(SEEDANCE_ID, 'generate_audio doit être un booléen.');
    }

    const aspectRatio = optionalString(SEEDANCE_ID, 'aspect_ratio', input.aspect_ratio);

    return {
      prompt: requirePrompt(SEEDANCE_ID, input.prompt),
      duration,
      resolution,
      generate_audio: generateAudio,
      ...(aspectRatio === undefined ? {} : { aspect_ratio: aspectRatio }),
    };
  },

  estimateCost(input) {
    return {
      estimatedCostUsd: usd(SEEDANCE_2_0_MIN_PRICE_USD_PER_SECOND * input.duration),
      lowerBound: true,
      basis: `${input.duration} s × ${SEEDANCE_2_0_MIN_PRICE_USD_PER_SECOND} $/s minimum (${input.resolution}, son ${input.generate_audio ? 'oui' : 'non'}) — plancher, prix non vérifié`,
    };
  },
};

export const HIGGSFIELD_MODELS = {
  soulV2Standard,
  seedance20TextToVideo,
} as const;
