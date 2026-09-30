import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeEndpoint, parseCredentials, readHiggsfieldConfig } from './config';
import { HiggsfieldError } from './errors';
import { createHiggsfieldLogger, redact, type HiggsfieldLogEntry } from './logger';

// Valeurs factices : aucun identifiant réel n'apparaît dans les tests.
const FAKE = 'test-key-id:test-key-secret';

describe('readHiggsfieldConfig', () => {
  it('reste en dry-run sans variable', () => {
    assert.equal(readHiggsfieldConfig({}).dryRun, true);
  });

  it('ne quitte le dry-run que sur la valeur exacte « false »', () => {
    assert.equal(readHiggsfieldConfig({ HIGGSFIELD_DRY_RUN: 'false' }).dryRun, false);
    assert.equal(readHiggsfieldConfig({ HIGGSFIELD_DRY_RUN: ' FALSE ' }).dryRun, false);

    for (const value of ['true', '0', 'no', 'off', 'fals', '']) {
      assert.equal(readHiggsfieldConfig({ HIGGSFIELD_DRY_RUN: value }).dryRun, true, value);
    }
  });

  it('n’autorise aucun endpoint par défaut, et normalise la liste', () => {
    assert.equal(readHiggsfieldConfig({}).allowedEndpoints.size, 0);

    const config = readHiggsfieldConfig({
      HIGGSFIELD_ALLOWED_ENDPOINTS:
        'higgsfield-ai/soul/v2/standard, /bytedance/seedance-2.0/text-to-video/ ,,',
    });

    assert.deepEqual(
      [...config.allowedEndpoints],
      ['/higgsfield-ai/soul/v2/standard', '/bytedance/seedance-2.0/text-to-video'],
    );
  });

  it('lit les plafonds en dollars, et refuse une valeur illisible', () => {
    const config = readHiggsfieldConfig({
      HIGGSFIELD_MAX_COST_USD_PER_REQUEST: '1.5',
      HIGGSFIELD_DAILY_BUDGET_USD: '10',
    });

    assert.equal(config.maxCostUsdPerRequest, 1.5);
    assert.equal(config.dailyBudgetUsd, 10);
    assert.equal(readHiggsfieldConfig({}).maxCostUsdPerRequest, null);
    assert.throws(
      () => readHiggsfieldConfig({ HIGGSFIELD_DAILY_BUDGET_USD: 'beaucoup' }),
      HiggsfieldError,
    );
  });
});

describe('parseCredentials', () => {
  it('découpe KEY_ID:KEY_SECRET', () => {
    assert.deepEqual(parseCredentials(FAKE), {
      keyId: 'test-key-id',
      keySecret: 'test-key-secret',
    });
    assert.equal(parseCredentials(undefined), null);
    assert.equal(parseCredentials('  '), null);
  });

  it('refuse une forme invalide sans jamais citer la valeur', () => {
    for (const raw of ['sans-separateur-secret', 'a:b:c-secret', ':seul-secret', 'seul-secret:']) {
      assert.throws(
        () => parseCredentials(raw),
        (error: unknown) =>
          error instanceof HiggsfieldError &&
          error.code === 'config' &&
          !error.message.includes('secret'),
      );
    }
  });
});

describe('normalizeEndpoint', () => {
  it('pose un seul / en tête et aucun en fin', () => {
    assert.equal(normalizeEndpoint('higgsfield-ai/soul/v2/standard'), '/higgsfield-ai/soul/v2/standard');
    assert.equal(normalizeEndpoint('//v1/x//'), '/v1/x');
  });
});

describe('redact', () => {
  it('masque les secrets connus, les clés sensibles et l’en-tête Key', () => {
    const out = redact(
      {
        message: 'échec avec test-key-secret dans le texte',
        headers: { Authorization: 'Key test-key-id:test-key-secret' },
        nested: [{ raw: 'Authorization: Key abc:def123' }],
        apiKey: 'quoi qu’il arrive',
      },
      ['test-key-id', 'test-key-secret'],
    );

    const text = JSON.stringify(out);

    assert.ok(!text.includes('test-key-secret'));
    assert.ok(!text.includes('test-key-id'));
    assert.ok(!text.includes('def123'));
    assert.ok(!text.includes('quoi qu’il arrive'));
  });

  it('traite les erreurs sans perdre leur message', () => {
    const entries: HiggsfieldLogEntry[] = [];
    const logger = createHiggsfieldLogger({
      secrets: ['test-key-secret'],
      sink: (entry) => entries.push(entry),
    });

    logger.error('x', { error: new Error('boom test-key-secret') });

    assert.deepEqual(entries[0], {
      level: 'error',
      event: 'x',
      error: { name: 'Error', message: 'boom [redacted]' },
    });
  });
});
