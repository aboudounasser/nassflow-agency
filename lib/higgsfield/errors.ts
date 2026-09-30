/**
 * Les erreurs du client Higgsfield, toutes sous une même classe.
 *
 * Un appelant (agent, workflow, script) n'a besoin que de deux réponses :
 * « que s'est-il passé » (`code`) et « puis-je réessayer » (`retryable`).
 * Le reste — statut HTTP, request_id — sert au diagnostic.
 *
 * Correspondance des statuts HTTP :
 * - 401 authentification, 403 crédits insuffisants, 422 validation : SDK
 *   officiel `@higgsfield/client` v0.2.6 (client v2), lu dans son code ;
 * - 402 solde insuffisant, 404 requête ou modèle introuvable, 400 aussi
 *   renvoyé quand la limite de requêtes simultanées est atteinte : page
 *   « Errors and retries » de docs.higgsfield.ai, connue par un résumé de
 *   recherche et non lue mot pour mot. Le libellé exact du 400 de
 *   concurrence n'est pas connu : il est reconnu à la présence de
 *   « concurren » dans le détail, à confirmer à la source.
 *
 * Aucun message construit ici ne contient d'identifiant ni de secret :
 * le corps d'erreur de l'API est tronqué, et ne porte de toute façon pas
 * l'en-tête Authorization.
 */

export type HiggsfieldErrorCode =
  /** HF_CREDENTIALS absente ou mal formée, stockage de suivi absent… */
  | 'config'
  /** Endpoint hors de la liste autorisée. */
  | 'endpoint_not_allowed'
  /** Coût estimé absent, ou au-delà d'un plafond. */
  | 'budget_exceeded'
  /**
   * La clé d'idempotence a déjà servi et ne peut pas être reprise : la
   * demande précédente a été refusée, ou son sort est inconnu.
   */
  | 'idempotency_conflict'
  /** 401 : identifiants refusés. */
  | 'auth'
  /** 402 : solde du portefeuille API insuffisant. */
  | 'insufficient_balance'
  /** 403 : crédits insuffisants. */
  | 'insufficient_credits'
  /** 400 : entrée refusée. */
  | 'bad_input'
  /** 400 : limite de requêtes simultanées atteinte. */
  | 'concurrency_limited'
  /** 404 : requête ou modèle introuvable (ou ligne de suivi absente). */
  | 'not_found'
  /** 422 : entrée invalide au regard du schéma du modèle. */
  | 'validation'
  /** 429 : trop de requêtes. */
  | 'rate_limited'
  /** 5xx, ou réponse illisible. */
  | 'upstream'
  /** Réseau coupé, délai de requête dépassé. */
  | 'network'
  /**
   * L'envoi d'une génération a échoué sans réponse exploitable : elle a
   * PEUT-ÊTRE été acceptée, donc facturée. Jamais réessayée d'office.
   */
  | 'submit_outcome_unknown'
  /** Le suivi a dépassé son délai ; la génération continue côté serveur. */
  | 'poll_timeout'
  /** Statut `failed` (crédits remboursés selon le SDK officiel). */
  | 'generation_failed'
  /** Statut `nsfw` : refusée par la modération (crédits remboursés). */
  | 'nsfw'
  /** Attente interrompue par l'appelant (AbortSignal). */
  | 'aborted';

export class HiggsfieldError extends Error {
  readonly code: HiggsfieldErrorCode;
  readonly retryable: boolean;
  readonly status?: number;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(
    code: HiggsfieldErrorCode,
    message: string,
    options: {
      retryable?: boolean;
      status?: number;
      requestId?: string;
      details?: unknown;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'HiggsfieldError';
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.status = options.status;
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

/** Au-delà, un corps d'erreur est un document, pas un diagnostic. */
const MAX_DETAIL_CHARS = 500;

/**
 * Le message lisible d'un corps d'erreur de l'API.
 *
 * Forme vérifiée dans le SDK officiel : `{ detail: string }` ou
 * `{ detail: [{ loc: string[], msg: string }] }` (validation façon
 * FastAPI). Tout le reste est rendu tronqué.
 */
export function describeErrorBody(body: unknown): string {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;

    if (typeof detail === 'string') return detail.slice(0, MAX_DETAIL_CHARS);

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          const { loc, msg } = (item ?? {}) as { loc?: unknown; msg?: unknown };
          const path = Array.isArray(loc) ? loc.join('.') : '';
          return path ? `${path}: ${String(msg)}` : String(msg);
        })
        .join(', ')
        .slice(0, MAX_DETAIL_CHARS);
    }
  }

  if (typeof body === 'string') return body.slice(0, MAX_DETAIL_CHARS);

  try {
    return JSON.stringify(body).slice(0, MAX_DETAIL_CHARS);
  } catch {
    return '';
  }
}

/** Traduit une réponse HTTP en échec en erreur typée. */
export function errorFromResponse(
  status: number,
  body: unknown,
  requestId?: string,
): HiggsfieldError {
  const detail = describeErrorBody(body);
  const base = { status, requestId, details: body };

  switch (status) {
    case 400:
      if (/concurren/i.test(detail)) {
        return new HiggsfieldError(
          'concurrency_limited',
          detail || 'Limite de requêtes simultanées atteinte.',
          { ...base, retryable: true },
        );
      }

      return new HiggsfieldError('bad_input', detail || 'Entrée refusée.', base);
    case 401:
      return new HiggsfieldError(
        'auth',
        'Identifiants Higgsfield refusés (vérifier HF_CREDENTIALS).',
        base,
      );
    case 402:
      return new HiggsfieldError(
        'insufficient_balance',
        'Solde de l’API Higgsfield insuffisant.',
        base,
      );
    case 403:
      return new HiggsfieldError(
        'insufficient_credits',
        'Crédits Higgsfield insuffisants.',
        base,
      );
    case 404:
      return new HiggsfieldError(
        'not_found',
        detail || 'Requête ou modèle introuvable.',
        base,
      );
    case 422:
      return new HiggsfieldError(
        'validation',
        detail || 'Paramètres invalides.',
        base,
      );
    case 429:
      return new HiggsfieldError('rate_limited', 'Trop de requêtes.', {
        ...base,
        retryable: true,
      });
  }

  return new HiggsfieldError(
    'upstream',
    `Higgsfield a répondu ${status}${detail ? ` : ${detail}` : ''}`,
    { ...base, retryable: status >= 500 },
  );
}
