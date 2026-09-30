import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HiggsfieldError } from './errors';
import { HIGGSFIELD_MODELS, seedance20TextToVideo, soulV2Standard } from './models';

function badInput(fn: () => unknown, pattern: RegExp) {
  assert.throws(fn, (error: unknown) => {
    assert.ok(error instanceof HiggsfieldError);
    assert.equal(error.code, 'bad_input');
    assert.match(error.message, pattern);
    return true;
  });
}

describe('identifiants de référence', () => {
  it('l’identifiant du modèle est le chemin de l’endpoint', () => {
    assert.equal(HIGGSFIELD_MODELS.soulV2Standard.id, 'higgsfield-ai/soul/v2/standard');
    assert.equal(HIGGSFIELD_MODELS.soulV2Standard.endpoint, '/higgsfield-ai/soul/v2/standard');
    assert.equal(HIGGSFIELD_MODELS.seedance20TextToVideo.id, 'bytedance/seedance-2.0/text-to-video');
    assert.equal(
      HIGGSFIELD_MODELS.seedance20TextToVideo.endpoint,
      '/bytedance/seedance-2.0/text-to-video',
    );
  });
});

describe('Soul v2 standard', () => {
  it('rend chaque valeur explicite, sans compter sur les défauts de l’API', () => {
    assert.deepEqual(soulV2Standard.buildInput({ prompt: '  Un bureau lumineux ' }), {
      prompt: 'Un bureau lumineux',
      resolution: '720p',
      batch_size: 1,
    });
  });

  it('garde les options fournies', () => {
    assert.deepEqual(
      soulV2Standard.buildInput({
        prompt: 'x',
        resolution: '1080p',
        batch_size: 4,
        aspect_ratio: '16:9',
        seed: 42,
        enhance_prompt: false,
      }),
      {
        prompt: 'x',
        resolution: '1080p',
        batch_size: 4,
        aspect_ratio: '16:9',
        seed: 42,
        enhance_prompt: false,
      },
    );
  });

  it('refuse ce qui n’est pas connu ou pas valide', () => {
    badInput(() => soulV2Standard.buildInput({ prompt: '' }), /prompt/);
    badInput(() => soulV2Standard.buildInput({ prompt: 'x', resolution: '4k' as '720p' }), /resolution/);
    badInput(() => soulV2Standard.buildInput({ prompt: 'x', batch_size: 5 }), /batch_size/);
    badInput(() => soulV2Standard.buildInput({ prompt: 'x', batch_size: 1.5 }), /batch_size/);
    badInput(() => soulV2Standard.buildInput({ prompt: 'x', seed: 1.2 }), /seed/);
    badInput(
      () => soulV2Standard.buildInput({ prompt: 'x', width_and_height: '1536x1536' } as never),
      /inconnu\(s\) width_and_height/,
    );
  });

  it('estime le coût par image, multiplié par batch_size', () => {
    const one = soulV2Standard.estimateCost(soulV2Standard.buildInput({ prompt: 'x' }));
    const four = soulV2Standard.estimateCost(
      soulV2Standard.buildInput({ prompt: 'x', resolution: '1080p', batch_size: 4 }),
    );

    assert.equal(one.estimatedCostUsd, 0.0032);
    assert.equal(one.lowerBound, false);
    assert.equal(four.estimatedCostUsd, 0.0228);
    assert.match(four.basis, /non vérifié/);
  });
});

describe('Seedance 2.0 text-to-video', () => {
  it('rend chaque valeur explicite', () => {
    assert.deepEqual(seedance20TextToVideo.buildInput({ prompt: 'Un travelling' }), {
      prompt: 'Un travelling',
      duration: 5,
      resolution: '480p',
      generate_audio: false,
    });
  });

  it('refuse une durée hors bornes et les paramètres inconnus', () => {
    badInput(() => seedance20TextToVideo.buildInput({ prompt: 'x', duration: 16 }), /duration/);
    badInput(() => seedance20TextToVideo.buildInput({ prompt: 'x', duration: 0 }), /duration/);
    badInput(() => seedance20TextToVideo.buildInput({ prompt: 'x', duration: 2.5 }), /duration/);
    badInput(
      () => seedance20TextToVideo.buildInput({ prompt: 'x', generate_audio: 'oui' as never }),
      /generate_audio/,
    );
    badInput(
      () => seedance20TextToVideo.buildInput({ prompt: 'x', input_images: [] } as never),
      /inconnu\(s\) input_images/,
    );
  });

  it('estime un plancher, à la seconde', () => {
    const estimate = seedance20TextToVideo.estimateCost(
      seedance20TextToVideo.buildInput({ prompt: 'x', duration: 10, resolution: '1080p' }),
    );

    assert.equal(estimate.estimatedCostUsd, 0.985);
    assert.equal(estimate.lowerBound, true);
    assert.match(estimate.basis, /plancher/);
  });
});
