import type { HiggsfieldInput, HiggsfieldStatus } from './types';

/**
 * Le suivi des générations : une ligne par génération, écrite AVANT
 * l'envoi à Higgsfield.
 *
 * L'ordre est le garde-fou. Si la ligne ne peut pas être écrite, rien ne
 * part : aucune dépense ne doit exister sans trace. La ligne est ensuite
 * complétée avec le request_id, les statuts successifs et le résultat.
 *
 * Le stockage est une interface : Supabase en production
 * (`supabase-store.ts`), la mémoire dans les tests.
 */

/**
 * Le cycle de vie d'une ligne.
 * - `pending` : écrite, pas encore envoyée (ou envoi interrompu) ;
 * - `rejected` : refusée par l'API avant exécution (4xx) — rien facturé ;
 * - `submit_unknown` : envoi sans réponse, peut-être accepté et facturé ;
 * - les statuts de l'API ensuite.
 */
export type GenerationStatus =
  | 'pending'
  | 'rejected'
  | 'submit_unknown'
  | HiggsfieldStatus;

/**
 * Les statuts qui, à notre connaissance, ne coûtent rien : `failed` et
 * `nsfw` sont remboursés selon le README du SDK officiel, `rejected` n'a
 * jamais été exécuté. Tout le reste compte dans le budget, y compris
 * `pending` et `submit_unknown` : dans le doute, on compte.
 */
export const NON_BILLED_STATUSES: ReadonlySet<GenerationStatus> = new Set([
  'rejected',
  'failed',
  'nsfw',
]);

export interface GenerationRecord {
  id: string;
  createdAt: string;
  endpoint: string;
  status: GenerationStatus;
  dryRun: boolean;
  requestId: string | null;
  estimatedCredits: number | null;
  source: string | null;
  metadata: Record<string, unknown>;
  input: HiggsfieldInput;
  imageUrls: string[];
  videoUrl: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  completedAt: string | null;
}

export type GenerationPatch = Partial<
  Pick<
    GenerationRecord,
    | 'status'
    | 'requestId'
    | 'imageUrls'
    | 'videoUrl'
    | 'errorCode'
    | 'errorMessage'
    | 'completedAt'
  >
>;

export interface GenerationStore {
  /** Doit lever si la ligne n'est pas écrite : l'envoi est alors annulé. */
  create(record: GenerationRecord): Promise<void>;
  update(id: string, patch: GenerationPatch): Promise<void>;
  /** Retrouve une ligne par request_id, pour reprendre un suivi. */
  findByRequestId(requestId: string): Promise<GenerationRecord | null>;
  /** Somme des crédits estimés, hors dry-run et hors statuts non facturés. */
  sumEstimatedCreditsSince(since: Date): Promise<number>;
}

/** Stockage en mémoire : tests, et essais locaux en dry-run. */
export function createMemoryGenerationStore(): GenerationStore & {
  records: GenerationRecord[];
} {
  const records: GenerationRecord[] = [];

  return {
    records,
    async create(record) {
      records.push({ ...record });
    },
    async update(id, patch) {
      const record = records.find((item) => item.id === id);
      if (record) Object.assign(record, patch);
    },
    async findByRequestId(requestId) {
      return records.find((item) => item.requestId === requestId) ?? null;
    },
    async sumEstimatedCreditsSince(since) {
      return records
        .filter(
          (item) =>
            !item.dryRun &&
            !NON_BILLED_STATUSES.has(item.status) &&
            new Date(item.createdAt) >= since,
        )
        .reduce((total, item) => total + (item.estimatedCredits ?? 0), 0);
    },
  };
}
