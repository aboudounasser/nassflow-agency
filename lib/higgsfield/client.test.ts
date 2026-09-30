import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createHiggsfieldClient, type HiggsfieldClientDeps } from './client';
import { readHiggsfieldConfig } from './config';
import { HiggsfieldError, type HiggsfieldErrorCode } from './errors';
import { createHiggsfieldLogger, type HiggsfieldLogEntry } from './logger';
import { createMemoryGenerationStore, type GenerationStore } from './tracking';

/**
 * Tous ces tests passent par un `fetch` simulé : aucun ne peut joindre
 * Higgsfield. Les identifiants sont factices.
 */

const ENDPOINT = '/v1/text2image/soul';
const REQUEST_ID = 'd7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff';
const KEY_ID = 'test-key-id';
const KEY_SECRET = 'test-key-secret';

type Step = Response | Error;

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
    HIGGSFIELD_ALLOWED_ENDPOINTS: ENDPOINT,
    HIGGSFIELD_MAX_CREDITS_PER_REQUEST: '10',
    HIGGSFIELD_DAILY_CREDIT_BUDGET: '50',
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

  return { client, calls, clock, logs, store };
}

async function rejectsWith(promise: Promise<unknown>, code: HiggsfieldErrorCode) {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof HiggsfieldError, String(error));
    assert.equal(error.code, code);
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

  it('fonctionne sans identifiants, sans stockage ni estimation', async () => {
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

    await rejectsWith(client.submit('/v1/autre', { prompt: 'x' }), 'endpoint_not_allowed');
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

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 1 }), 'config');
    assert.equal(calls.length, 0);
  });

  it('exige des identifiants', async () => {
    const { client, calls } = setup([], { env: { HF_CREDENTIALS: '' } });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 1 }), 'config');
    assert.equal(calls.length, 0);
  });

  it('exige une estimation de coût', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }), 'budget_exceeded');
    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 0 }), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('exige les deux plafonds', async () => {
    const { client, calls } = setup([], { env: { HIGGSFIELD_DAILY_CREDIT_BUDGET: '' } });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 1 }), 'config');
    assert.equal(calls.length, 0);
  });

  it('refuse au-delà du plafond par génération', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 11 }), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('refuse au-delà du budget des dernières 24 h, hors statuts remboursés', async () => {
    const store = createMemoryGenerationStore();
    const base = {
      endpoint: ENDPOINT,
      requestId: null,
      source: null,
      metadata: {},
      input: {},
      imageUrls: [],
      videoUrl: null,
      errorCode: null,
      errorMessage: null,
      completedAt: null,
      createdAt: '2026-09-30T08:00:00Z',
    };

    store.records.push(
      { ...base, id: 'a', status: 'completed', dryRun: false, estimatedCredits: 45 },
      // Ni le dry-run, ni un échec remboursé, ni une ligne de plus de 24 h
      // ne comptent.
      { ...base, id: 'b', status: 'completed', dryRun: true, estimatedCredits: 100 },
      { ...base, id: 'c', status: 'failed', dryRun: false, estimatedCredits: 100 },
      { ...base, id: 'd', status: 'completed', dryRun: false, estimatedCredits: 100, createdAt: '2026-09-28T08:00:00Z' },
    );

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 6 }), 'budget_exceeded');
    assert.equal(calls.length, 0);
  });

  it('n’envoie rien si la ligne de suivi ne s’écrit pas', async () => {
    const store = createMemoryGenerationStore();
    store.create = async () => {
      throw new Error('base indisponible');
    };

    const { client, calls } = setup([], { store });

    await rejectsWith(client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 1 }), 'config');
    assert.equal(calls.length, 0);
  });

  it('refuse un input qui n’est pas un objet', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(
      client.submit(ENDPOINT, ['x'] as unknown as Record<string, unknown>, { estimatedCredits: 1 }),
      'bad_input',
    );
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
      { prompt: 'Un bureau lumineux', aspect_ratio: '16:9' },
      { estimatedCredits: 2, source: 'test', initialIntervalMs: 1000, maxIntervalMs: 2000 },
    );

    assert.deepEqual(result, {
      requestId: REQUEST_ID,
      status: 'completed',
      imageUrls: ['https://cdn.example/a.png'],
      videoUrl: null,
      dryRun: false,
    });

    // Le contrat vérifié dans le SDK officiel.
    assert.equal(calls[0].url, `https://api.higgsfield.ai${ENDPOINT}`);
    assert.equal(calls[0].method, 'POST');
    assert.equal(calls[0].headers.Authorization, `Key ${KEY_ID}:${KEY_SECRET}`);
    assert.deepEqual(calls[0].body, { prompt: 'Un bureau lumineux', aspect_ratio: '16:9' });
    assert.equal(calls[1].url, `https://api.higgsfield.ai/requests/${REQUEST_ID}/status`);
    assert.equal(calls[1].method, 'GET');
    assert.equal(calls.length, 5);

    // Intervalle croissant, plafonné.
    assert.deepEqual(clock.sleeps, [1000, 1500, 2000]);

    const [record] = (store as ReturnType<typeof createMemoryGenerationStore>).records;
    assert.equal(record.requestId, REQUEST_ID);
    assert.equal(record.status, 'completed');
    assert.equal(record.estimatedCredits, 2);
    assert.equal(record.source, 'test');
    assert.deepEqual(record.imageUrls, ['https://cdn.example/a.png']);
    assert.ok(record.completedAt);

    // Rien dans les journaux ne contient les identifiants.
    const text = JSON.stringify(logs);
    assert.ok(!text.includes(KEY_SECRET));
    assert.ok(!text.includes(KEY_ID));
    assert.ok(!text.includes('Un bureau lumineux'), 'le prompt n’est pas journalisé');
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
    ['une réponse illisible', new Response('<html>', { status: 200 })],
  ] as const) {
    it(`ne renvoie jamais la génération après ${label}`, async () => {
      const { client, calls, store } = setup([step, json({ status: 'queued', request_id: REQUEST_ID })]);

      await rejectsWith(
        client.submit(ENDPOINT, { prompt: 'x' }, { estimatedCredits: 1 }),
        'submit_outcome_unknown',
      );

      assert.equal(calls.length, 1);
      assert.equal(
        (store as ReturnType<typeof createMemoryGenerationStore>).records[0].status,
        'submit_unknown',
      );
    });
  }

  for (const [status, code] of [
    [400, 'bad_input'],
    [401, 'auth'],
    [402, 'insufficient_credits'],
    [403, 'insufficient_credits'],
    [422, 'validation'],
    [429, 'rate_limited'],
  ] as const) {
    it(`traduit un ${status} à l’envoi en ${code}, sans relance`, async () => {
      const { client, calls, store } = setup([
        json({ detail: [{ loc: ['body', 'prompt'], msg: 'field required' }] }, status),
      ]);

      await rejectsWith(client.submit(ENDPOINT, {}, { estimatedCredits: 1 }), code);
      assert.equal(calls.length, 1);
      assert.equal(
        (store as ReturnType<typeof createMemoryGenerationStore>).records[0].status,
        'rejected',
      );
    });
  }

  it('lit le détail d’une erreur de validation', async () => {
    const { client } = setup([json({ detail: [{ loc: ['body', 'prompt'], msg: 'field required' }] }, 422)]);

    await assert.rejects(client.submit(ENDPOINT, {}, { estimatedCredits: 1 }), /body\.prompt: field required/);
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

  it('ne réessaie pas une erreur définitive', async () => {
    const { client, calls } = setup([json({ detail: 'not found' }, 404)]);

    await rejectsWith(client.getStatus(REQUEST_ID), 'upstream');
    assert.equal(calls.length, 1);
  });

  it('refuse un request_id qui sortirait du chemin', async () => {
    const { client, calls } = setup([]);

    await rejectsWith(client.getStatus('../credits'), 'bad_input');
    await rejectsWith(client.getStatus('abc?x=1'), 'bad_input');
    assert.equal(calls.length, 0);
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
    const { client } = setup(steps);

    await assert.rejects(
      client.waitForResult(REQUEST_ID, { initialIntervalMs: 1000, maxIntervalMs: 1000, maxWaitMs: 5000 }),
      (error: unknown) =>
        error instanceof HiggsfieldError &&
        error.code === 'poll_timeout' &&
        error.retryable &&
        error.requestId === REQUEST_ID,
    );
  });

  it('s’arrête quand l’appelant annule', async () => {
    const controller = new AbortController();
    controller.abort();

    const { client, calls } = setup([]);

    await rejectsWith(client.waitForResult(REQUEST_ID, { signal: controller.signal }), 'aborted');
    assert.equal(calls.length, 0);
  });
});
