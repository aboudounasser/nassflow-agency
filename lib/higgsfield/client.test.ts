import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  SUBMIT_TIMEOUT_MS,
  createHiggsfieldClient,
  type HiggsfieldClientDeps,
} from './client';
import { readHiggsfieldConfig } from './config';
import { HiggsfieldError, type HiggsfieldErrorCode } from './errors';
import { createHiggsfieldLogger, type HiggsfieldLogEntry } from './logger';
import {
  createMemoryGenerationStore,
  type GenerationRecord,
  type GenerationStore,
} from './tracking';

/**
 * Tous ces tests passent par un `fetch` simulé : aucun ne peut joindre
 * Higgsfield. Les identifiants sont factices.
 */

const ENDPOINT = '/higgsfield-ai/soul/v2/standard';
const VIDEO_ENDPOINT = '/bytedance/seedance-2.0/text-to-video';
const REQUEST_ID = 'd7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff';
const KEY_ID = 'test-key-id';
const KEY_SECRET = 'test-key-secret';

type Step = Response | Error;
type MemoryStore = ReturnType<typeof createMemoryGenerationStore>;

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function mockFetch(steps: Step[]) {
  const calls: Call[] = [];

  const fetch = (async (input: string | URL | Request, init: RequestInit = {}) => {
    calls.push({
      url: String(input),
      method: init.method ?? 'GET',
      headers: init.headers as Record<string, string>,
      body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
    });

    const step = steps.shift();

    if (!step) throw new Error('fetch appelé plus que prévu');
    if (step instanceof Error) throw step;

    return step;
  }) as typeof globalThis.fetch;

  return { fetch, calls };
}

/** Horloge factice : `sleep` avance le temps au lieu d'attendre. */
function fakeClock() {
  let time = Date.parse('2026-09-30T12:00:00Z');
  const sleeps: number[] = [];

  return {
    sleeps,
    now: () => new Date(time),
    sleep: async (ms: number, signal?: AbortSignal) => {
      if (signal?.aborted) throw new HiggsfieldError('aborted', 'interrompu');
      sleeps.push(ms);
      time += ms;
    },
  };
}

function realEnv(overrides: Record<string, string> = {}) {
  return readHiggsfieldConfig({
    HF_CREDENTIALS: `${KEY_ID}:${KEY_SECRET}`,
    HIGGSFIELD_DRY_RUN: 'false',
    HIGGSFIELD_ALLOWED_ENDPOINTS: `${ENDPOINT},${VIDEO_ENDPOINT}`,
    HIGGSFIELD_MAX_COST_USD_PER_REQUEST: '2',
    HIGGSFIELD_DAILY_BUDGET_USD: '5',
    ...overrides,
  });
}

function setup(
  steps: Step[],
  {
    env,
    store = createMemoryGenerationStore(),
    ...deps
  }: { env?: Record<string, string>; store?: GenerationStore | null } & HiggsfieldClientDeps = {},
) {
  const { fetch, calls } = mockFetch(steps);
  const clock = fakeClock();
  const logs: HiggsfieldLogEntry[] = [];
  let counter = 0;

  const client = createHiggsfieldClient({
    config: realEnv(env),
    store,
    fetch,
    now: clock.now,
    sleep: clock.sleep,
    randomId: () => `id-${++counter}`,
    retryBaseDelayMs: 10,
    logger: createHiggsfieldLogger({
      secrets: [KEY_ID, KEY_SECRET],
      sink: (entry) => logs.push(entry),
    }),
    ...deps,
  });

  return { client, calls, clock, logs, store: store as MemoryStore };
}

/** Options d'un envoi réel valide. */
function real(key = 'cle-1', estimatedCostUsd = 0.01) {
  return { estimatedCostUsd, idempotencyKey: key };
}

function record(overrides: Partial<GenerationRecord>): GenerationRecord {
  return {
    id: 'r',
    createdAt: '2026-09-30T08:00:00Z',
    endpoint: ENDPOINT,
    status: 'completed',
    dryRun: false,
    requestId: null,
    idempotencyKey: null,
    estimatedCostUsd: null,
    actualCostUsd: null,
    actualCostSource: null,
    cashbackUsd: null,
    source: null,
    metadata: {},
    input: {},
    imageUrls: [],
    videoUrl: null,
    errorCode: null,
    errorMessage: null,
    completedAt: null,
    ...overrides,
  };
}

async function rejectsWith(promise: Promise<unknown>, code: HiggsfieldErrorCode) {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof HiggsfieldError, String(error));
    assert.equal(error.code, code, error.message);
    return true;
  });
}

describe('dry-run', () => {
  const dryEnv = { HIGGSFIELD_DRY_RUN: 'true' };

  it('est actif par défaut et n’émet aucune requête', async () => {
    const store = createMemoryGenerationStore();
    const { fetch, calls } = mockFetch([]);
    const client = createHiggsfieldClient({
      config: readHiggsfieldConfig({ HIGGSFIELD_ALLOWED_ENDPOINTS: ENDPOINT }),
      store,
      fetch,
      logger: createHiggsfieldLogger({ sink: () => {} }),
    });

    assert.equal(client.dryRun, true);

    const result = await client.generate(ENDPOINT, { prompt: 'Un bureau lumineux' });

    assert.equal(calls.length, 0);
    assert.equal(result.dryRun, true);
    assert.equal(result.status, 'completed');
    assert.deepEqual(result.imageUrls, []);
    assert.equal(store.records[0].dryRun, true);
    assert.equal(store.records[0].status, 'completed');
  });

  it('ne fait aucun POST, même avec identifiants, clé et estimation valides', async () => {
    const { client, calls } = setup([], { env: dryEnv });

    const submitted = await client.submit(ENDPOINT, { prompt: 'x' }, real());
    await client.waitForResult(submitted.requestId);
    await client.reconcile(submitted.generationId!);

    assert.equal(submitted.dryRun, true);
    assert.equal(calls.length, 0);
  });

  it('fonctionne sans identifiants, sans stockage, sans clé ni estimation', async () => {
    const { client, calls } = setup([], {
      env: { ...dryEnv, HF_CREDENTIALS: '' },
      store: null,
    });

    const submitted = await client.submit(ENDPOINT, { prompt: 'x' });

    assert.equal(submitted.dryRun, true);
    assert.equal(submitted.generationId, null);
    assert.match(submitted.requestId, /^dry-run-/);
    assert.equal(calls.length, 0);
  });

  it('refuse quand même un endpoint non autorisé', async () => {
    const { client, calls } = setup([], { env: dryEnv });

    await rejectsWith(client.submit('/v1/text2image/soul', { prompt: 'x' }), 'endpoint_not_allowed');
    assert.equal(calls.length, 0);
  });

  it('ne lit pas le statut d’une vraie requête', async () => {
    const { client, calls } = setup([], { env: dryEnv });

    await rejectsWith(client.getStatus(REQUEST_ID), 'config');
    assert.equal(calls.length, 0);
  });
});

describe('garde-fous avant envoi réel', () => {
  it('exige un stockage de suivi', async () => {
    const { client, calls } = setup([], { store: null });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'config');
    assert.equal(calls.length, 0);
  });

  it('exige des identifiants', async () => {
    const { client, calls } = setup([], { env: { HF_CREDENTIALS: '' } });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'config');
    assert.equal(calls.length, 0);
  });

  it('exige une clé d’idempotence', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCostUsd: 0.01 }), 'bad_input');
    await rejectsWith(
      client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCostUsd: 0.01, idempotencyKey: '  ' }),
      'bad_input',
    );
    assert.equal(calls.length, 0);
  });

  it('exige une estimation de coût en dollars', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { idempotencyKey: 'k' }), 'budget_exceeded');
    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k', 0)), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('exige les deux plafonds', async () => {
    const { client, calls } = setup([], { env: { HIGGSFIELD_DAILY_BUDGET_USD: '' } });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'config');
    assert.equal(calls.length, 0);
  });

  it('refuse au-delà du plafond par génération', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k', 2.01)), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('refuse au-delà du budget estimé sur 24 h, hors statuts remboursés', async () => {
    const store = createMemoryGenerationStore();

    store.records.push(
      record({ id: 'a', estimatedCostUsd: 4.5 }),
      // Ni le dry-run, ni un échec remboursé, ni une ligne de plus de 24 h
      // ne comptent.
      record({ id: 'b', dryRun: true, estimatedCostUsd: 100 }),
      record({ id: 'c', status: 'failed', estimatedCostUsd: 100 }),
      record({ id: 'd', estimatedCostUsd: 100, createdAt: '2026-09-28T08:00:00Z' }),
    );

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k', 0.6)), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('n’envoie rien si la ligne de suivi ne s’écrit pas', async () => {
    const store = createMemoryGenerationStore();
    store.create = async () => {
      throw new Error('base indisponible');
    };

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'config');
    assert.equal(calls.length, 0);
  });

  it('n’envoie rien si la clé d’idempotence ne peut pas être vérifiée', async () => {
    const store = createMemoryGenerationStore();
    store.findByIdempotencyKey = async () => {
      throw new Error('base indisponible');
    };

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'config');
    assert.equal(calls.length, 0);
  });

  it('refuse un input qui n’est pas un objet', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(
      client.submit(ENDPOINT, ['x'] as unknown as Record<string, unknown>, real()),
      'bad_input',
    );
    assert.equal(calls.length, 0);
  });
});

describe('idempotence', () => {
  it('ne crée jamais une deuxième génération pour la même clé', async () => {
    const { client, calls, store } = setup([json({ status: 'queued', request_id: REQUEST_ID })]);

    const first = await client.submit(ENDPOINT, { prompt: 'x' }, real('campagne/1'));
    const second = await client.submit(ENDPOINT, { prompt: 'x' }, real('campagne/1'));

    assert.equal(calls.length, 1);
    assert.equal(store.records.length, 1);
    assert.equal(first.deduplicated, false);
    assert.deepEqual(second, { ...first, deduplicated: true });
  });

  it('rend le request_id conservé d’un envoi à l’état inconnu, sans renvoyer', async () => {
    const { client, calls } = setup([json({ detail: 'boom', request_id: REQUEST_ID }, 502)]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k')), 'submit_outcome_unknown');

    const again = await client.submit(ENDPOINT, { prompt: 'x' }, real('k'));

    assert.equal(calls.length, 1);
    assert.equal(again.requestId, REQUEST_ID);
    assert.equal(again.status, 'submit_unknown');
    assert.equal(again.deduplicated, true);
  });

  it('refuse de renvoyer un envoi à l’état inconnu sans request_id', async () => {
    const { client, calls } = setup([new TypeError('fetch failed')]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k')), 'submit_outcome_unknown');
    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k')), 'submit_outcome_unknown');

    assert.equal(calls.length, 1);
  });

  it('demande une nouvelle clé après un refus', async () => {
    const { client, calls } = setup([json({ detail: 'prompt manquant' }, 422)]);

    await rejectsWith(client.submit(ENDPOINT, {}, real('k')), 'validation');
    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k')), 'idempotency_conflict');

    assert.equal(calls.length, 1);
  });

  it('refuse une clé reprise pour un autre modèle', async () => {
    const { client, calls } = setup([json({ status: 'queued', request_id: REQUEST_ID })]);

    await client.submit(ENDPOINT, { prompt: 'x' }, real('k'));
    await rejectsWith(client.submit(VIDEO_ENDPOINT, { prompt: 'x' }, real('k')), 'idempotency_conflict');

    assert.equal(calls.length, 1);
  });

  it('arrête le second de deux envois simultanés à l’écriture', async () => {
    const store = createMemoryGenerationStore();
    // La lecture ne voit rien (course) ; l'écriture, elle, bute sur la
    // contrainte d'unicité.
    store.findByIdempotencyKey = async () => null;
    store.records.push(record({ id: 'x', idempotencyKey: 'k', requestId: REQUEST_ID }));

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real('k')), 'idempotency_conflict');
    assert.equal(calls.length, 0);
  });
});

describe('génération (API simulée)', () => {
  it('envoie, suit le request_id et enregistre le résultat', async () => {
    const { client, calls, clock, logs, store } = setup([
      json({ status: 'queued', request_id: REQUEST_ID }),
      json({ status: 'queued', request_id: REQUEST_ID }),
      json({ status: 'in_progress', request_id: REQUEST_ID }),
      json({ status: 'in_progress', request_id: REQUEST_ID }),
      json({
        status: 'completed',
        request_id: REQUEST_ID,
        images: [{ url: 'https://cdn.example/a.png' }],
      }),
    ]);

    const result = await client.generate(
      ENDPOINT,
      { prompt: 'Un bureau lumineux', resolution: '720p', batch_size: 1 },
      {
        ...real('k', 0.0032),
        source: 'test',
        initialIntervalMs: 1000,
        maxIntervalMs: 2000,
      },
    );

    assert.deepEqual(result, {
      requestId: REQUEST_ID,
      status: 'completed',
      imageUrls: ['https://cdn.example/a.png'],
      videoUrl: null,
      dryRun: false,
    });

    // Le contrat : POST sur l'identifiant du modèle, puis lecture du statut.
    assert.equal(calls[0].url, `https://api.higgsfield.ai${ENDPOINT}`);
    assert.equal(calls[0].method, 'POST');
    assert.equal(calls[0].headers.Authorization, `Key ${KEY_ID}:${KEY_SECRET}`);
    assert.deepEqual(calls[0].body, { prompt: 'Un bureau lumineux', resolution: '720p', batch_size: 1 });
    assert.equal(calls[1].url, `https://api.higgsfield.ai/requests/${REQUEST_ID}/status`);
    assert.equal(calls[1].method, 'GET');
    assert.equal(calls.length, 5);

    // Intervalle croissant, plafonné.
    assert.deepEqual(clock.sleeps, [1000, 1500, 2000]);

    const [row] = store.records;
    assert.equal(row.requestId, REQUEST_ID);
    assert.equal(row.idempotencyKey, 'k');
    assert.equal(row.status, 'completed');
    assert.equal(row.estimatedCostUsd, 0.0032);
    // Le coût réel et le cashback ne sont jamais inventés.
    assert.equal(row.actualCostUsd, null);
    assert.equal(row.actualCostSource, null);
    assert.equal(row.cashbackUsd, null);
    assert.equal(row.source, 'test');
    assert.deepEqual(row.imageUrls, ['https://cdn.example/a.png']);
    assert.ok(row.completedAt);

    // Rien dans les journaux ne contient les identifiants.
    const text = JSON.stringify(logs);
    assert.ok(!text.includes(KEY_SECRET));
    assert.ok(!text.includes(KEY_ID));
    assert.ok(!text.includes('Un bureau lumineux'), 'le prompt n’est pas journalisé');
  });

  it('donne 120 s au POST de génération', () => {
    assert.equal(SUBMIT_TIMEOUT_MS, 120_000);
  });

  it('rend l’URL d’une vidéo', async () => {
    const { client } = setup([
      json({ status: 'completed', request_id: REQUEST_ID, video: { url: 'https://cdn.example/v.mp4' } }),
    ]);

    const result = await client.waitForResult(REQUEST_ID);

    assert.equal(result.videoUrl, 'https://cdn.example/v.mp4');
  });

  for (const [label, step] of [
    ['un 5xx', json({ detail: 'boom' }, 502)],
    ['une coupure réseau', new TypeError('fetch failed')],
    ['un délai dépassé', new DOMException('timeout', 'TimeoutError')],
    ['une réponse illisible', new Response('<html>', { status: 200 })],
  ] as const) {
    it(`ne renvoie jamais la génération après ${label}`, async () => {
      const { client, calls, store } = setup([step, json({ status: 'queued', request_id: REQUEST_ID })]);

      await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'submit_outcome_unknown');

      assert.equal(calls.length, 1);
      assert.equal(store.records[0].status, 'submit_unknown');
      assert.equal(store.records[0].requestId, null);
    });
  }

  it('conserve le request_id porté par une réponse 5xx', async () => {
    const { client, calls, store } = setup([json({ detail: 'boom', request_id: REQUEST_ID }, 503)]);

    await assert.rejects(
      client.submit(ENDPOINT, { prompt: 'x' }, real()),
      (error: unknown) =>
        error instanceof HiggsfieldError &&
        error.code === 'submit_outcome_unknown' &&
        error.requestId === REQUEST_ID &&
        error.message.includes('reconcile()'),
    );

    assert.equal(calls.length, 1);
    assert.equal(store.records[0].status, 'submit_unknown');
    assert.equal(store.records[0].requestId, REQUEST_ID);
  });

  for (const [status, body, code] of [
    [400, { detail: 'invalid aspect_ratio' }, 'bad_input'],
    [400, { detail: 'Concurrency limit reached' }, 'concurrency_limited'],
    [401, { detail: 'unauthorized' }, 'auth'],
    [402, { detail: 'Your wallet does not have enough balance' }, 'insufficient_balance'],
    [403, { detail: 'not enough credits' }, 'insufficient_credits'],
    [404, { detail: 'model not found' }, 'not_found'],
    [422, { detail: [{ loc: ['body', 'prompt'], msg: 'field required' }] }, 'validation'],
    [429, { detail: 'rate limit' }, 'rate_limited'],
  ] as const) {
    it(`traduit un ${status} (${code}) à l’envoi, sans relance`, async () => {
      const { client, calls, store } = setup([json(body, status)]);

      await rejectsWith(client.submit(ENDPOINT, {}, real()), code);
      assert.equal(calls.length, 1);
      assert.equal(store.records[0].status, 'rejected');
      assert.equal(store.records[0].errorCode, code);
    });
  }

  it('lit le détail d’une erreur de validation', async () => {
    const { client } = setup([json({ detail: [{ loc: ['body', 'prompt'], msg: 'field required' }] }, 422)]);

    await assert.rejects(client.submit(ENDPOINT, {}, real()), /body\.prompt: field required/);
  });
});

describe('lecture du statut', () => {
  it('réessaie sur 5xx et coupure réseau', async () => {
    const { client, calls } = setup([
      json({}, 503),
      new TypeError('fetch failed'),
      json({ status: 'in_progress', request_id: REQUEST_ID }),
    ]);

    const status = await client.getStatus(REQUEST_ID);

    assert.equal(status.status, 'in_progress');
    assert.equal(calls.length, 3);
    assert.ok(calls.every((call) => call.method === 'GET'));
  });

  it('respecte Retry-After sur un 429', async () => {
    const { client, clock } = setup([
      json({}, 429, { 'Retry-After': '3' }),
      json({ status: 'queued', request_id: REQUEST_ID }),
    ]);

    await client.getStatus(REQUEST_ID);

    assert.deepEqual(clock.sleeps, [3000]);
  });

  it('abandonne après le nombre de relances prévu', async () => {
    const { client, calls } = setup([json({}, 500), json({}, 500), json({}, 500)], {
      statusRetries: 2,
    });

    await rejectsWith(client.getStatus(REQUEST_ID), 'upstream');
    assert.equal(calls.length, 3);
  });

  it('ne réessaie pas un 404', async () => {
    const { client, calls } = setup([json({ detail: 'request not found' }, 404)]);

    await rejectsWith(client.getStatus(REQUEST_ID), 'not_found');
    assert.equal(calls.length, 1);
  });

  it('refuse un request_id qui sortirait du chemin', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.getStatus('../credits'), 'bad_input');
    await rejectsWith(client.getStatus('abc?x=1'), 'bad_input');
    assert.equal(calls.length, 0);
  });
});

describe('reconcile', () => {
  it('relit une fois le statut d’un envoi inconnu dont le request_id est conservé', async () => {
    const { client, calls, store } = setup([
      json({ detail: 'boom', request_id: REQUEST_ID }, 502),
      json({ status: 'completed', request_id: REQUEST_ID, images: [{ url: 'https://cdn.example/a.png' }] }),
    ]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'submit_outcome_unknown');

    const { outcome, record: row } = await client.reconcile(store.records[0].id);

    assert.equal(outcome, 'updated');
    assert.equal(row.status, 'completed');
    assert.deepEqual(store.records[0].imageUrls, ['https://cdn.example/a.png']);
    // Un POST, un GET : jamais de second envoi.
    assert.deepEqual(calls.map((call) => call.method), ['POST', 'GET']);
  });

  it('ne lit rien et ne renvoie rien sans request_id', async () => {
    const { client, calls, store } = setup([new TypeError('fetch failed')]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, real()), 'submit_outcome_unknown');

    const { outcome } = await client.reconcile(store.records[0].id);

    assert.equal(outcome, 'manual_check_required');
    assert.equal(calls.length, 1);
  });

  it('ne relit pas une ligne déjà terminée', async () => {
    const store = createMemoryGenerationStore();
    store.records.push(record({ id: 'fini', requestId: REQUEST_ID, status: 'completed' }));

    const { client, calls } = setup([], { store });

    assert.equal((await client.reconcile('fini')).outcome, 'unchanged');
    assert.equal(calls.length, 0);
  });

  it('signale une ligne inconnue', async () => {
    const { client } = setup([]);

    await rejectsWith(client.reconcile('absente'), 'not_found');
  });

  it('exige un stockage', async () => {
    const { client } = setup([], { store: null });

    await rejectsWith(client.reconcile('x'), 'config');
  });
});

describe('fin de génération', () => {
  it('lève generation_failed sur failed', async () => {
    const { client } = setup([json({ status: 'failed', request_id: REQUEST_ID })]);

    await rejectsWith(client.waitForResult(REQUEST_ID), 'generation_failed');
  });

  it('lève nsfw sur nsfw', async () => {
    const { client } = setup([json({ status: 'nsfw', request_id: REQUEST_ID })]);

    await rejectsWith(client.waitForResult(REQUEST_ID), 'nsfw');
  });

  it('lève poll_timeout, avec le request_id pour reprendre', async () => {
    const steps = Array.from({ length: 20 }, () => json({ status: 'in_progress', request_id: REQUEST_ID }));
    const { client, calls } = setup(steps);

    await assert.rejects(
      client.waitForResult(REQUEST_ID, { initialIntervalMs: 1000, maxIntervalMs: 1000, maxWaitMs: 5000 }),
      (error: unknown) =>
        error instanceof HiggsfieldError &&
        error.code === 'poll_timeout' &&
        error.retryable &&
        error.requestId === REQUEST_ID,
    );
    assert.ok(calls.every((call) => call.method === 'GET'));
  });

  it('s’arrête quand l’appelant annule', async () => {
    const controller = new AbortController();
    controller.abort();

    const { client, calls } = setup([]);

    await rejectsWith(client.waitForResult(REQUEST_ID, { signal: controller.signal }), 'aborted');
    assert.equal(calls.length, 0);
  });
});
