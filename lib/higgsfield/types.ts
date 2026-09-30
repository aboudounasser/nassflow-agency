/**
 * Le contrat de l'API Higgsfield tel qu'il est vérifié.
 *
 * Source : le code du SDK officiel `@higgsfield/client` v0.2.6 (client
 * v2, publié le 2026-09-17 par Higgsfield). Les pages docs.higgsfield.ai
 * et open.higgsfield.ai ne sont connues que par un résumé de recherche ;
 * voir la section Higgsfield du README pour ce qui en dépend et ce qui
 * reste non vérifié.
 */

/**
 * Statuts d'une requête. `queued`, `in_progress`, `completed`, `failed`
 * et `nsfw` sont documentés dans le README du SDK ; `canceled` figure
 * dans ses types v1 et dans la gestion des statuts — il est toléré ici
 * comme terminal, sans qu'on sache encore l'obtenir.
 */
export type HiggsfieldStatus =
  | 'queued'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'nsfw'
  | 'canceled';

/** Statuts après lesquels plus rien ne bougera. */
export const TERMINAL_STATUSES: ReadonlySet<HiggsfieldStatus> = new Set([
  'completed',
  'failed',
  'nsfw',
  'canceled',
]);

/**
 * La réponse de `POST /{endpoint}` comme de
 * `GET /requests/{request_id}/status`.
 */
export interface HiggsfieldRequestResponse {
  status: HiggsfieldStatus;
  request_id: string;
  status_url?: string;
  cancel_url?: string;
  images?: Array<{ url: string }>;
  video?: { url: string };
}

/** Ce qu'une génération rend à l'appelant, une fois normalisée. */
export interface HiggsfieldResult {
  requestId: string;
  status: HiggsfieldStatus;
  imageUrls: string[];
  videoUrl: string | null;
  /** Vrai si rien n'est parti chez Higgsfield (HIGGSFIELD_DRY_RUN). */
  dryRun: boolean;
}

/** Les entrées d'un modèle : leur schéma dépend de l'endpoint appelé. */
export type HiggsfieldInput = Record<string, unknown>;

export interface SubmitOptions {
  /**
   * Coût ESTIMÉ en dollars, déclaré par l'appelant (voir `models.ts`
   * pour les estimateurs). Obligatoire hors dry-run.
   *
   * L'API, telle que vérifiée, ne renvoie pas le coût d'une génération :
   * ce chiffre sert aux plafonds, jamais de coût réel.
   */
  estimatedCostUsd?: number;
  /**
   * Clé d'idempotence choisie par l'appelant, unique par génération
   * voulue. Obligatoire hors dry-run.
   *
   * Un second `submit` avec la même clé ne crée jamais une deuxième
   * génération : il rend la première si elle a un request_id, et lève
   * sinon. C'est ce qui protège d'un agent qui relance après une erreur.
   */
  idempotencyKey?: string;
  /** Qui déclenche : nom d'agent, de workflow, de script. Pour le suivi. */
  source?: string;
  /** Contexte libre conservé avec la génération (campagne, client…). */
  metadata?: Record<string, unknown>;
}

export interface WaitOptions {
  /** Premier intervalle entre deux lectures du statut. */
  initialIntervalMs?: number;
  /** Plafond de l'intervalle, qui croît à chaque lecture. */
  maxIntervalMs?: number;
  /** Durée maximale d'attente avant `poll_timeout`. */
  maxWaitMs?: number;
  signal?: AbortSignal;
}
