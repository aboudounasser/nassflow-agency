import { HiggsfieldError } from './errors';
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
 * - `submit_unknown` : envoi sans réponse exploitable, peut-être accepté
 *   et facturé — jamais renvoyé, voir `reconcile()` ;
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
 * `pending`, `submit_unknown` et `canceled` (non confirmé) : dans le
 * doute, on compte.
 */
export const NON_BILLED_STATUSES: ReadonlySet<GenerationStatus> = new Set([
  'rejected',
  'failed',
  'nsfw',
]);

/**
 * D'où vient `actualCostUsd`. `api` n'est à utiliser que si l'API finit
 * par renvoyer un coût, ce qu'aucune source vérifiée n'indique ; `console`
 * est un rapprochement manuel avec le tableau de bord Higgsfield.
 */
export type ActualCostSource = 'api' | 'console';

export interface GenerationRecord {
  id: string;
  createdAt: string;
  endpoint: string;
  status: GenerationStatus;
  dryRun: boolean;
  requestId: string | null;
  /** Clé d'idempotence de l'appelant ; unique. */
  idempotencyKey: string | null;
  /** Notre estimation avant envoi. Jamais présentée comme un coût réel. */
  estimatedCostUsd: number | null;
  /** Coût réel, inconnu (null) tant qu'une source ne l'a pas donné. */
  actualCostUsd: number | null;
  actualCostSource: ActualCostSource | null;
  /** Remise ou remboursement constaté ; jamais supposé. */
  cashbackUsd: number | null;
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
    | 'actualCostUsd'
    | 'actualCostSource'
    | 'cashbackUsd'
  >
>;

export interface GenerationStore {
  /**
   * Doit lever si la ligne n'est pas écrite : l'envoi est alors annulé.
   * Une clé d'idempotence déjà prise lève `idempotency_conflict`.
   */
  create(record: GenerationRecord): Promise<void>;
  update(id: string, patch: GenerationPatch): Promise<void>;
  findById(id: string): Promise<GenerationRecord | null>;
  /** Retrouve une ligne par request_id, pour reprendre un suivi. */
  findByRequestId(requestId: string): Promise<GenerationRecord | null>;
  findByIdempotencyKey(key: string): Promise<GenerationRecord | null>;
  /** Somme des coûts estimés, hors dry-run et hors statuts non facturés. */
  sumEstimatedCostUsdSince(since: Date): Promise<number>;
}

export function idempotencyConflict(key: string): HiggsfieldError {
  return new HiggsfieldError(
    'idempotency_conflict',
    `La clé d’idempotence « ${key} » est déjà utilisée.`,
  );
}

/** Stockage en mémoire : tests, et essais locaux en dry-run. */
export function createMemoryGenerationStore(): GenerationStore & {
  records: GenerationRecord[];
} {
  const records: GenerationRecord[] = [];

  return {
    records,
    async create(record) {
      if (
        record.idempotencyKey !== null &&
        records.some((item) => item.idempotencyKey === record.idempotencyKey)
      ) {
        throw idempotencyConflict(record.idempotencyKey);
      }

      records.push({ ...record });
    },
    async update(id, patch) {
      const record = records.find((item) => item.id === id);
      if (record) Object.assign(record, patch);
    },
    async findById(id) {
      return records.find((item) => item.id === id) ?? null;
    },
    async findByRequestId(requestId) {
      return records.find((item) => item.requestId === requestId) ?? null;
    },
    async findByIdempotencyKey(key) {
      return records.find((item) => item.idempotencyKey === key) ?? null;
    },
    async sumEstimatedCostUsdSince(since) {
      return records
        .filter(
          (item) =>
            !item.dryRun &&
            !NON_BILLED_STATUSES.has(item.status) &&
            new Date(item.createdAt) >= since,
        )
        .reduce((total, item) => total + (item.estimatedCostUsd ?? 0), 0);
    },
  };
}
