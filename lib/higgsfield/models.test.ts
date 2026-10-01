import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HiggsfieldError } from './errors';
import {
  HIGGSFIELD_MODELS,
  SEEDANCE_I2V_PROMPT_FIELD,
  SEEDANCE_I2V_PROMPT_FIELD_CONFIRMED,
  SEEDANCE_25_I2V_RESOLUTION_AUDIO_CONFIRMED,
  seedance20ImageToVideo,
  seedance25ImageToVideo,
  seedance20TextToVideo,
  soulV2Standard,
} from './models';

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

describe('Seedance 2.0 image-to-video', () => {
  const IMG = 'https://cdn.example/reference.png';

  it('envoie image_url et les champs confirmés, toujours explicites', () => {
    assert.equal(seedance20ImageToVideo.endpoint, '/bytedance/seedance-2.0/image-to-video');
    assert.deepEqual(seedance20ImageToVideo.buildInput({ prompt: ' Il repose le téléphone ', image_url: IMG }), {
      image_url: IMG,
      prompt: 'Il repose le téléphone',
      duration: 5,
      resolution: '480p',
      generate_audio: false,
    });
  });

  it('signale que le champ de description n’est pas encore confirmé', () => {
    assert.equal(SEEDANCE_I2V_PROMPT_FIELD, 'prompt');
    assert.equal(SEEDANCE_I2V_PROMPT_FIELD_CONFIRMED, false);
  });

  it('refuse une image non https, un format ou un paramètre inconnu', () => {
    badInput(() => seedance20ImageToVideo.buildInput({ prompt: 'x', image_url: 'http://cdn.example/a.png' }), /image_url/);
    badInput(() => seedance20ImageToVideo.buildInput({ prompt: 'x', image_url: 'pas une url' }), /image_url/);
    badInput(
      () => seedance20ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, aspect_ratio: '9:16' } as never),
      /inconnu\(s\) aspect_ratio/,
    );
  });

  it('nomme le bon modèle dans les erreurs communes', () => {
    badInput(
      () => seedance20ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, duration: 20 }),
      /^bytedance\/seedance-2\.0\/image-to-video : duration/,
    );
  });

  it('estime un plancher, à la seconde', () => {
    const estimate = seedance20ImageToVideo.estimateCost(
      seedance20ImageToVideo.buildInput({ prompt: 'x', image_url: IMG }),
    );
    assert.equal(estimate.estimatedCostUsd, 0.4925);
    assert.equal(estimate.lowerBound, true);
  });
});

describe('Seedance 2.5 image-to-video', () => {
  const IMG = 'https://cdn.example/reference.png';

  it('envoie prompt, image_url et des valeurs explicites', () => {
    assert.equal(seedance25ImageToVideo.endpoint, '/bytedance/seedance-2.5/image-to-video');
    assert.deepEqual(seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, generate_audio: true }), {
      image_url: IMG,
      prompt: 'x',
      duration: 5,
      resolution: '480p',
      generate_audio: true,
    });
  });

  it('respecte les bornes confirmées de duration (4 à 30)', () => {
    badInput(() => seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, duration: 3 }), /duration/);
    badInput(() => seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, duration: 31 }), /duration/);
    assert.equal(seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, duration: 30 }).duration, 30);
  });

  it('refuse une résolution au prix inconnu, une image non https, un champ inconnu', () => {
    badInput(() => seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, resolution: '720p' as '480p' }), /480p/);
    badInput(() => seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: 'http://cdn.example/a.png' }), /image_url/);
    badInput(() => seedance25ImageToVideo.buildInput({ prompt: '', image_url: IMG }), /prompt/);
    badInput(
      () => seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG, aspect_ratio: '9:16' } as never),
      /inconnu\(s\) aspect_ratio/,
    );
  });

  it('estime 1,10 $ pour 5 s en 480p', () => {
    const estimate = seedance25ImageToVideo.estimateCost(seedance25ImageToVideo.buildInput({ prompt: 'x', image_url: IMG }));
    assert.equal(estimate.estimatedCostUsd, 1.1);
    assert.equal(estimate.lowerBound, false);
  });

  it('signale que resolution et generate_audio restent à confirmer', () => {
    assert.equal(SEEDANCE_25_I2V_RESOLUTION_AUDIO_CONFIRMED, false);
  });
});
