/**
 * Le contrat de l'API Higgsfield tel qu'il est vérifié.
 *
 * Source : le SDK officiel `@higgsfield/client` v0.2.6 (client v2, publié
 * le 2026-09-17 par Higgsfield), README et code. La documentation
 * docs.higgsfield.ai n'a pas pu être consultée au moment de l'écriture ;
 * tout ce qui n'apparaît pas dans le SDK est absent d'ici plutôt que
 * deviné. Voir la section Higgsfield du README pour la liste des points
 * non vérifiés.
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
   * Coût estimé en crédits, fourni par l'appelant.
   *
   * L'API, telle que vérifiée, ne renvoie aucun coût : c'est donc ce
   * chiffre qui alimente les plafonds et le suivi. Obligatoire hors
   * dry-run.
   */
  estimatedCredits?: number;
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
