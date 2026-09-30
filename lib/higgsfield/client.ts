import {
  HIGGSFIELD_BASE_URL,
  normalizeEndpoint,
  readHiggsfieldConfig,
  type HiggsfieldConfig,
} from './config';
import { assertWithinBudget } from './costs';
import { HiggsfieldError, errorFromResponse } from './errors';
import { createHiggsfieldLogger, type HiggsfieldLogger } from './logger';
import type {
  GenerationPatch,
  GenerationRecord,
  GenerationStatus,
  GenerationStore,
} from './tracking';
import {
  TERMINAL_STATUSES,
  type HiggsfieldInput,
  type HiggsfieldRequestResponse,
  type HiggsfieldResult,
  type SubmitOptions,
  type WaitOptions,
} from './types';

/**
 * Le client Higgsfield de NASSFLOW, réservé au serveur.
 *
 * Pourquoi pas le SDK officiel `@higgsfield/client` : il a servi de
 * référence pour le contrat HTTP, mais
 * - `subscribe()` réessaie le POST de génération sur un 5xx ou une
 *   coupure réseau, ce qui peut créer — et facturer — deux générations ;
 * - il n'expose pas la lecture du statut d'un request_id existant : le
 *   suivi ne peut pas reprendre après un redémarrage, ni être découpé
 *   entre plusieurs appels courts (fonctions Vercel) ;
 * - il ajoute axios pour ce qu'un `fetch` fait déjà, comme dans
 *   app/api/chat.
 *
 * Ce client reprend donc le contrat vérifié — même hôte, même en-tête
 * `Authorization: Key KEY_ID:KEY_SECRET`, `POST /{model_id}` puis
 * `GET /requests/{request_id}/status` — avec ces règles en plus :
 * 1. HIGGSFIELD_DRY_RUN (actif par défaut) : aucune requête réseau ;
 * 2. une génération n'est JAMAIS renvoyée automatiquement. Si l'état du
 *    premier envoi est inconnu, le request_id est conservé quand il est
 *    connu, le statut se vérifie avec `reconcile()`, et rien n'est
 *    recréé. Seules les lectures de statut, sans effet ni coût, sont
 *    réessayées ;
 * 3. hors dry-run, rien ne part sans clé d'idempotence, ligne de suivi
 *    écrite, endpoint autorisé et coût estimé sous les plafonds ;
 * 4. une clé d'idempotence déjà vue ne crée jamais de deuxième
 *    génération.
 */

export interface HiggsfieldClientDeps {
  config?: HiggsfieldConfig;
  store?: GenerationStore | null;
  logger?: HiggsfieldLogger;
  fetch?: typeof fetch;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
  now?: () => Date;
  randomId?: () => string;
  /** Délai du POST de génération. */
  submitTimeoutMs?: number;
  /** Délai d'une lecture de statut. */
  statusTimeoutMs?: number;
  /** Relances d'une lecture de statut (erreur réseau, 429, 5xx). */
  statusRetries?: number;
  retryBaseDelayMs?: number;
}

/**
 * 120 s, comme le SDK officiel : un délai trop court transforme une
 * génération lente à accepter en génération à l'état inconnu.
 */
export const SUBMIT_TIMEOUT_MS = 120_000;
export const STATUS_TIMEOUT_MS = 30_000;

export interface SubmitResult {
  /** Identifiant de la ligne de suivi, ou null sans stockage (dry-run). */
  generationId: string | null;
  requestId: string;
  status: GenerationStatus;
  dryRun: boolean;
  /** Vrai si la clé d'idempotence a rendu une génération existante. */
  deduplicated: boolean;
}

export interface ReconcileResult {
  record: GenerationRecord;
  /**
   * - `unchanged` : déjà dans un état final, rien n'a été lu ;
   * - `updated` : statut relu chez Higgsfield et ligne mise à jour ;
   * - `manual_check_required` : aucun request_id connu, rien à lire —
   *   vérifier dans la console Higgsfield, sans jamais relancer.
   */
  outcome: 'unchanged' | 'updated' | 'manual_check_required';
}

export interface HiggsfieldClient {
  readonly dryRun: boolean;
  submit(endpoint: string, input: HiggsfieldInput, options?: SubmitOptions): Promise<SubmitResult>;
  getStatus(requestId: string): Promise<HiggsfieldRequestResponse>;
  waitForResult(requestId: string, options?: WaitOptions): Promise<HiggsfieldResult>;
  /**
   * Relit l'état d'une génération suivie, une fois, sans jamais rien
   * envoyer de nouveau. À utiliser après `submit_outcome_unknown` ou
   * `poll_timeout`, ou pour rattraper une ligne restée en cours.
   */
  reconcile(generationId: string): Promise<ReconcileResult>;
  /**
   * `submit` puis `waitForResult`. Après une erreur portant un
   * request_id, ne pas rappeler `generate` : reprendre avec
   * `waitForResult` ou `reconcile`.
   */
  generate(
    endpoint: string,
    input: HiggsfieldInput,
    options?: SubmitOptions & WaitOptions,
  ): Promise<HiggsfieldResult>;
}

const DRY_RUN_PREFIX = 'dry-run-';

/** Un request_id finit dans une URL : rien d'autre que [A-Za-z0-9_-]. */
const REQUEST_ID = /^[A-Za-z0-9_-]{1,128}$/;

const MAX_IDEMPOTENCY_KEY = 200;

const STATUSES: ReadonlySet<string> = new Set([
  'queued',
  'in_progress',
  'completed',
  'failed',
  'nsfw',
  'canceled',
]);

/** États d'une ligne après lesquels `reconcile` n'a plus rien à lire. */
const FINAL_RECORD_STATUSES: ReadonlySet<GenerationStatus> = new Set([
  'completed',
  'failed',
  'nsfw',
  'canceled',
  'rejected',
]);

function defaultSleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function abortError(requestId?: string) {
  return new HiggsfieldError('aborted', 'Attente interrompue par l’appelant.', {
    requestId,
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Le request_id d'un corps quelconque, s'il en porte un valide. */
function extractRequestId(body: unknown): string | null {
  if (!isPlainObject(body)) return null;

  const { request_id } = body;

  return typeof request_id === 'string' && REQUEST_ID.test(request_id) ? request_id : null;
}

function parseResponse(body: unknown): HiggsfieldRequestResponse | null {
  if (extractRequestId(body) === null) return null;

  const { status } = body as Record<string, unknown>;

  if (typeof status !== 'string' || !STATUSES.has(status)) return null;

  return body as unknown as HiggsfieldRequestResponse;
}

function toResult(response: HiggsfieldRequestResponse, dryRun: boolean): HiggsfieldResult {
  return {
    requestId: response.request_id,
    status: response.status,
    imageUrls: (response.images ?? [])
      .map((image) => image?.url)
      .filter((url): url is string => typeof url === 'string'),
    videoUrl: typeof response.video?.url === 'string' ? response.video.url : null,
    dryRun,
  };
}

/** Ce qu'un statut lu chez Higgsfield change dans la ligne de suivi. */
function patchFromResponse(
  response: HiggsfieldRequestResponse,
  completedAt: string,
): GenerationPatch {
  switch (response.status) {
    case 'completed': {
      const result = toResult(response, false);

      return {
        status: 'completed',
        imageUrls: result.imageUrls,
        videoUrl: result.videoUrl,
        completedAt,
      };
    }
    case 'nsfw':
      return {
        status: 'nsfw',
        errorCode: 'nsfw',
        errorMessage: 'Génération refusée par la modération Higgsfield.',
        completedAt,
      };
    case 'failed':
    case 'canceled':
      return {
        status: response.status,
        errorCode: 'generation_failed',
        errorMessage: `Génération terminée au statut ${response.status}.`,
        completedAt,
      };
    default:
      return { status: response.status };
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => '');

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createHiggsfieldClient(deps: HiggsfieldClientDeps = {}): HiggsfieldClient {
  if (typeof (globalThis as { window?: unknown }).window !== 'undefined') {
    throw new HiggsfieldError(
      'config',
      'Le client Higgsfield est réservé au serveur : HF_CREDENTIALS ne doit jamais atteindre un navigateur.',
    );
  }

  const config = deps.config ?? readHiggsfieldConfig();
  const store = deps.store ?? null;
  const doFetch = deps.fetch ?? globalThis.fetch;
  const sleep = deps.sleep ?? defaultSleep;
  const now = deps.now ?? (() => new Date());
  const randomId = deps.randomId ?? (() => crypto.randomUUID());
  const submitTimeoutMs = deps.submitTimeoutMs ?? SUBMIT_TIMEOUT_MS;
  const statusTimeoutMs = deps.statusTimeoutMs ?? STATUS_TIMEOUT_MS;
  const statusRetries = deps.statusRetries ?? 3;
  const retryBaseDelayMs = deps.retryBaseDelayMs ?? 1_000;

  const logger =
    deps.logger ??
    createHiggsfieldLogger({
      secrets: config.credentials
        ? [config.credentials.keyId, config.credentials.keySecret]
        : [],
    });

  function authorization(): string {
    if (!config.credentials) {
      throw new HiggsfieldError('config', 'HF_CREDENTIALS absente.');
    }

    return `Key ${config.credentials.keyId}:${config.credentials.keySecret}`;
  }

  async function safeUpdate(id: string | null, patch: GenerationPatch, requestId?: string) {
    if (!store || !id) return;

    try {
      await store.update(id, patch);
    } catch (error) {
      // La génération existe déjà : perdre la mise à jour est un ennui à
      // rattraper à la main, pas une raison de perdre le résultat.
      logger.error('tracking.update_failed', { generationId: id, requestId, error });
    }
  }

  async function send(method: 'GET' | 'POST', path: string, timeoutMs: number, body?: unknown) {
    return doFetch(`${HIGGSFIELD_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: authorization(),
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    });
  }

  /**
   * Une clé d'idempotence déjà vue. Ne crée jamais rien : rend la
   * génération existante si elle a un request_id, lève sinon.
   */
  function reuseExisting(existing: GenerationRecord, path: string, key: string): SubmitResult {
    if (existing.endpoint !== path || existing.dryRun !== config.dryRun) {
      throw new HiggsfieldError(
        'idempotency_conflict',
        `La clé d’idempotence « ${key} » a déjà servi pour une autre demande (${existing.endpoint}${existing.dryRun ? ', dry-run' : ''}).`,
      );
    }

    if (existing.requestId) {
      logger.info('submit.deduplicated', {
        endpoint: path,
        generationId: existing.id,
        requestId: existing.requestId,
        status: existing.status,
      });

      return {
        generationId: existing.id,
        requestId: existing.requestId,
        status: existing.status,
        dryRun: existing.dryRun,
        deduplicated: true,
      };
    }

    if (existing.status === 'rejected') {
      throw new HiggsfieldError(
        'idempotency_conflict',
        `La demande « ${key} » a été refusée par Higgsfield (${existing.errorCode ?? 'erreur'}) : corriger et envoyer avec une nouvelle clé.`,
      );
    }

    // `pending` ou `submit_unknown` sans request_id : le premier envoi a
    // peut-être abouti. On ne renvoie pas.
    throw new HiggsfieldError(
      'submit_outcome_unknown',
      `La demande « ${key} » a un état inconnu (${existing.status}) et aucun request_id : vérifier dans la console Higgsfield. Elle ne sera pas renvoyée.`,
    );
  }

  async function submit(
    endpoint: string,
    input: HiggsfieldInput,
    options: SubmitOptions = {},
  ): Promise<SubmitResult> {
    const path = normalizeEndpoint(endpoint);

    // Vérifié en dry-run aussi : un essai à blanc doit refuser ce que
    // l'envoi réel refuserait.
    if (!config.allowedEndpoints.has(path)) {
      throw new HiggsfieldError(
        'endpoint_not_allowed',
        `Endpoint ${path} absent de HIGGSFIELD_ALLOWED_ENDPOINTS.`,
      );
    }

    if (!isPlainObject(input)) {
      throw new HiggsfieldError('bad_input', 'input doit être un objet.');
    }

    const key = options.idempotencyKey?.trim() || null;

    if (key !== null && key.length > MAX_IDEMPOTENCY_KEY) {
      throw new HiggsfieldError('bad_input', `idempotencyKey dépasse ${MAX_IDEMPOTENCY_KEY} caractères.`);
    }

    if (!config.dryRun) {
      authorization();

      if (!store) {
        throw new HiggsfieldError(
          'config',
          'Aucun stockage de suivi : hors dry-run, une génération ne part jamais sans trace.',
        );
      }

      if (key === null) {
        throw new HiggsfieldError(
          'bad_input',
          'idempotencyKey est obligatoire hors dry-run : c’est elle qui empêche une deuxième génération.',
        );
      }
    }

    // La clé d'abord : une demande déjà faite ne consomme pas de budget.
    if (store && key !== null) {
      let existing: GenerationRecord | null = null;

      try {
        existing = await store.findByIdempotencyKey(key);
      } catch (error) {
        if (!config.dryRun) {
          throw new HiggsfieldError(
            'config',
            'Clé d’idempotence invérifiable : génération annulée avant envoi.',
            { cause: error },
          );
        }

        logger.warn('tracking.lookup_failed', { endpoint: path, error });
      }

      if (existing) return reuseExisting(existing, path, key);
    }

    if (!config.dryRun) {
      await assertWithinBudget({
        config,
        estimatedCostUsd: options.estimatedCostUsd,
        store: store!,
        now: now(),
      });
    }

    const generationId = store ? randomId() : null;

    if (store && generationId) {
      try {
        await store.create({
          id: generationId,
          createdAt: now().toISOString(),
          endpoint: path,
          status: 'pending',
          dryRun: config.dryRun,
          requestId: null,
          idempotencyKey: key,
          estimatedCostUsd: options.estimatedCostUsd ?? null,
          actualCostUsd: null,
          actualCostSource: null,
          cashbackUsd: null,
          source: options.source ?? null,
          metadata: options.metadata ?? {},
          input,
          imageUrls: [],
          videoUrl: null,
          errorCode: null,
          errorMessage: null,
          completedAt: null,
        });
      } catch (error) {
        // Deux appels simultanés avec la même clé : le second s'arrête là.
        if (error instanceof HiggsfieldError && error.code === 'idempotency_conflict') {
          throw error;
        }

        if (!config.dryRun) {
          throw new HiggsfieldError(
            'config',
            'Ligne de suivi non écrite : génération annulée avant envoi.',
            { cause: error },
          );
        }

        logger.warn('tracking.create_failed', { endpoint: path, error });
      }
    }

    if (config.dryRun) {
      const requestId = `${DRY_RUN_PREFIX}${randomId()}`;

      await safeUpdate(generationId, { status: 'queued', requestId }, requestId);
      logger.info('submit.dry_run', {
        endpoint: path,
        requestId,
        inputKeys: Object.keys(input),
        estimatedCostUsd: options.estimatedCostUsd ?? null,
      });

      return { generationId, requestId, status: 'queued', dryRun: true, deduplicated: false };
    }

    let response: Response;

    try {
      response = await send('POST', path, submitTimeoutMs, input);
    } catch (error) {
      return unknownOutcome(generationId, path, 'Aucune réponse de Higgsfield.', error, null);
    }

    const body = await readBody(response);

    if (!response.ok) {
      if (response.status >= 500) {
        return unknownOutcome(
          generationId,
          path,
          `Higgsfield a répondu ${response.status}.`,
          body,
          extractRequestId(body),
        );
      }

      const error = errorFromResponse(response.status, body);

      await safeUpdate(generationId, {
        status: 'rejected',
        errorCode: error.code,
        errorMessage: error.message,
      });
      logger.warn('submit.rejected', {
        endpoint: path,
        status: response.status,
        code: error.code,
        message: error.message,
      });

      throw error;
    }

    const parsed = parseResponse(body);

    if (!parsed) {
      return unknownOutcome(
        generationId,
        path,
        'Réponse de Higgsfield illisible.',
        body,
        extractRequestId(body),
      );
    }

    await safeUpdate(
      generationId,
      { status: parsed.status, requestId: parsed.request_id },
      parsed.request_id,
    );
    logger.info('submit.accepted', {
      endpoint: path,
      requestId: parsed.request_id,
      status: parsed.status,
      estimatedCostUsd: options.estimatedCostUsd ?? null,
      source: options.source ?? null,
    });

    return {
      generationId,
      requestId: parsed.request_id,
      status: parsed.status,
      dryRun: false,
      deduplicated: false,
    };
  }

  /**
   * L'envoi n'a pas de réponse exploitable. La génération a pu être
   * acceptée : on garde le request_id s'il est connu, on le consigne et
   * on lève. Jamais de renvoi.
   */
  async function unknownOutcome(
    generationId: string | null,
    path: string,
    message: string,
    cause: unknown,
    requestId: string | null,
  ): Promise<never> {
    const next = requestId
      ? `request_id ${requestId} conservé : vérifier avec reconcile(), ne pas relancer.`
      : 'Aucun request_id : vérifier dans la console Higgsfield avant toute nouvelle demande.';

    const error = new HiggsfieldError(
      'submit_outcome_unknown',
      `${message} La génération a peut-être été acceptée et facturée. ${next}`,
      { cause, requestId: requestId ?? undefined },
    );

    await safeUpdate(
      generationId,
      {
        status: 'submit_unknown',
        errorCode: error.code,
        errorMessage: message,
        ...(requestId ? { requestId } : {}),
      },
      requestId ?? undefined,
    );
    logger.error('submit.outcome_unknown', {
      endpoint: path,
      generationId,
      requestId,
      message,
      cause,
    });

    throw error;
  }

  async function getStatus(requestId: string): Promise<HiggsfieldRequestResponse> {
    if (!REQUEST_ID.test(requestId)) {
      throw new HiggsfieldError('bad_input', 'request_id invalide.');
    }

    if (requestId.startsWith(DRY_RUN_PREFIX)) {
      // Une génération à blanc « aboutit » tout de suite, sans média.
      return { status: 'completed', request_id: requestId, images: [] };
    }

    if (config.dryRun) {
      throw new HiggsfieldError(
        'config',
        'HIGGSFIELD_DRY_RUN est actif : aucune requête n’est envoyée à Higgsfield.',
        { requestId },
      );
    }

    const path = `/requests/${requestId}/status`;
    let lastError: HiggsfieldError | undefined;
    // Délai imposé par un 429 (en-tête Retry-After, en secondes), s'il y
    // en a un : il prime sur le backoff.
    let retryAfterMs = 0;

    for (let attempt = 0; attempt <= statusRetries; attempt++) {
      if (attempt > 0) {
        const backoff = Math.min(
          retryBaseDelayMs * 2 ** (attempt - 1) + Math.random() * retryBaseDelayMs,
          30_000,
        );
        const delay = retryAfterMs > 0 ? Math.min(retryAfterMs, 60_000) : backoff;

        logger.warn('status.retry', {
          requestId,
          attempt,
          delayMs: Math.round(delay),
          code: lastError?.code,
        });
        await sleep(delay);
        retryAfterMs = 0;
      }

      let response: Response;

      try {
        response = await send('GET', path, statusTimeoutMs);
      } catch (error) {
        lastError = new HiggsfieldError('network', 'Lecture du statut impossible.', {
          retryable: true,
          requestId,
          cause: error,
        });
        continue;
      }

      const body = await readBody(response);

      if (!response.ok) {
        const error = errorFromResponse(response.status, body, requestId);

        if (!error.retryable) throw error;

        if (response.status === 429) {
          const seconds = Number(response.headers.get('retry-after'));
          if (Number.isFinite(seconds) && seconds > 0) retryAfterMs = seconds * 1000;
        }

        lastError = error;
        continue;
      }

      const parsed = parseResponse(body);

      if (!parsed) {
        throw new HiggsfieldError('upstream', 'Statut illisible.', {
          requestId,
          details: body,
        });
      }

      return parsed;
    }

    throw lastError ?? new HiggsfieldError('upstream', 'Statut indisponible.', { requestId });
  }

  async function waitForResult(
    requestId: string,
    options: WaitOptions = {},
  ): Promise<HiggsfieldResult> {
    const initialIntervalMs = options.initialIntervalMs ?? 2_000;
    const maxIntervalMs = options.maxIntervalMs ?? 15_000;
    const maxWaitMs = options.maxWaitMs ?? 10 * 60_000;
    const started = now().getTime();
    const dryRun = requestId.startsWith(DRY_RUN_PREFIX);

    let generationId: string | null = null;

    if (store) {
      try {
        generationId = (await store.findByRequestId(requestId))?.id ?? null;
      } catch (error) {
        logger.warn('tracking.lookup_failed', { requestId, error });
      }
    }

    let interval = initialIntervalMs;
    let lastStatus: string | null = null;

    for (;;) {
      if (options.signal?.aborted) throw abortError(requestId);

      const response = await getStatus(requestId);

      if (response.status !== lastStatus && !TERMINAL_STATUSES.has(response.status)) {
        lastStatus = response.status;
        await safeUpdate(generationId, { status: response.status }, requestId);
      }

      if (TERMINAL_STATUSES.has(response.status)) {
        const patch = patchFromResponse(response, now().toISOString());

        await safeUpdate(generationId, patch, requestId);

        if (response.status === 'completed') {
          const result = toResult(response, dryRun);

          logger.info('generation.completed', {
            requestId,
            images: result.imageUrls.length,
            video: result.videoUrl !== null,
            dryRun,
            durationMs: now().getTime() - started,
          });

          return result;
        }

        logger.warn('generation.failed', { requestId, status: response.status });

        throw new HiggsfieldError(
          response.status === 'nsfw' ? 'nsfw' : 'generation_failed',
          patch.errorMessage ?? `Génération terminée au statut ${response.status}.`,
          { requestId },
        );
      }

      const elapsed = now().getTime() - started;

      if (elapsed >= maxWaitMs) {
        logger.warn('poll.timeout', { requestId, elapsedMs: elapsed, status: response.status });

        throw new HiggsfieldError(
          'poll_timeout',
          `Toujours ${response.status} après ${Math.round(elapsed / 1000)} s. La génération continue chez Higgsfield : reprendre avec waitForResult(request_id) ou reconcile(), sans relancer.`,
          { retryable: true, requestId },
        );
      }

      await sleep(Math.min(interval, maxWaitMs - elapsed), options.signal);
      interval = Math.min(Math.round(interval * 1.5), maxIntervalMs);
    }
  }

  async function reconcile(generationId: string): Promise<ReconcileResult> {
    if (!store) {
      throw new HiggsfieldError('config', 'reconcile() demande un stockage de suivi.');
    }

    const record = await store.findById(generationId);

    if (!record) {
      throw new HiggsfieldError('not_found', `Aucune ligne de suivi ${generationId}.`);
    }

    if (FINAL_RECORD_STATUSES.has(record.status)) {
      return { record, outcome: 'unchanged' };
    }

    if (!record.requestId) {
      logger.warn('reconcile.manual_check_required', {
        generationId,
        status: record.status,
      });

      return { record, outcome: 'manual_check_required' };
    }

    // Une seule lecture de statut, jamais d'envoi.
    const response = await getStatus(record.requestId);
    const patch = patchFromResponse(response, now().toISOString());

    await safeUpdate(record.id, patch, record.requestId);
    logger.info('reconcile.updated', {
      generationId,
      requestId: record.requestId,
      from: record.status,
      to: response.status,
    });

    return { record: { ...record, ...patch }, outcome: 'updated' };
  }

  return {
    dryRun: config.dryRun,
    submit,
    getStatus,
    waitForResult,
    reconcile,
    async generate(endpoint, input, options = {}) {
      const { requestId } = await submit(endpoint, input, options);
      return waitForResult(requestId, options);
    },
  };
}
