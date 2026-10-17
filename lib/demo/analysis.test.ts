import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildDemoRequest,
  capWords,
  instantReply,
  parseDemoAnalysis,
  readDemoBody,
  readDemoResponse,
  validateDemoText,
} from './analysis';

const valid = {
  type: 'Demande commerciale',
  entreprise: 'non précisé',
  contact: 'non précisé',
  besoin: 'Automatiser le suivi des devis.',
  echeance: 'non précisé',
  priorite: 'Haute',
  raison_priorite: 'Rappel demandé cette semaine.',
  actions: ['Fiche créée dans le CRM', 'Simulé : Alerte envoyée au commercial sur Slack'],
  reponse: 'Bonjour, merci pour votre message.',
};

const response = (text: string, status = 'completed') => ({
  status,
  output: [
    { type: 'reasoning', summary: [] },
    { type: 'message', content: [{ type: 'output_text', text }] },
  ],
});

describe('validateDemoText', () => {
  it('refuse ce qui n’est pas une chaîne, trop court ou trop long', () => {
    assert.ok(validateDemoText(undefined));
    assert.ok(validateDemoText(42));
    assert.ok(validateDemoText('   court   '));
    assert.ok(validateDemoText('a'.repeat(601)));
  });

  it('accepte de 10 à 600 caractères, espaces de bord exclus', () => {
    assert.equal(validateDemoText('  ' + 'a'.repeat(10) + '  '), null);
    assert.equal(validateDemoText('a'.repeat(600)), null);
  });
});

describe('readDemoBody', () => {
  it('accepte les trois canaux, et le formulaire par défaut', () => {
    for (const channel of ['whatsapp', 'email', 'formulaire']) {
      assert.deepEqual(readDemoBody({ text: ' Bonjour, un devis ? ', channel }), {
        text: 'Bonjour, un devis ?',
        channel,
      });
    }

    assert.deepEqual(readDemoBody({ text: 'Bonjour, un devis ?' }), {
      text: 'Bonjour, un devis ?',
      channel: 'formulaire',
    });
  });

  it('refuse un canal hors de la liste', () => {
    for (const channel of ['sms', 'WhatsApp', '', 1, null, ['email']]) {
      assert.ok('error' in readDemoBody({ text: 'Bonjour, un devis ?', channel }), String(channel));
    }
  });
});

describe('buildDemoRequest', () => {
  it('pose le canal hors du cadre du message', () => {
    const content = buildDemoRequest('Bonjour, un devis ?', 'whatsapp').input[0].content;

    assert.ok(content.startsWith('Canal : WhatsApp\n'));
  });

  it('ne conserve rien chez OpenAI et impose le schéma strict', () => {
    const body = buildDemoRequest('Bonjour, un devis ?');

    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    assert.ok(body.max_output_tokens <= 500);
    assert.equal(body.reasoning.effort, 'none');
  });
});

describe('parseDemoAnalysis', () => {
  it('préfixe chaque action une seule fois', () => {
    const result = parseDemoAnalysis(valid);

    assert.deepEqual(result?.actions, [
      'Simulé : Fiche créée dans le CRM',
      'Simulé : Alerte envoyée au commercial sur Slack',
    ]);
  });

  it('retire tout balisage', () => {
    const result = parseDemoAnalysis({ ...valid, reponse: '<b>Bonjour</b> <a href="x">ici</a>' });

    assert.equal(result?.reponse, 'Bonjour ici');
  });

  it('retire les résidus de ponctuation CJK du modèle', () => {
    const result = parseDemoAnalysis({ ...valid, reponse: 'Comme vous le proposez.】【。' });

    assert.equal(result?.reponse, 'Comme vous le proposez.');
  });

  it('rejette un type, une priorité ou un nombre d’actions hors schéma', () => {
    assert.equal(parseDemoAnalysis({ ...valid, type: 'Poème' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, priorite: 'Urgente' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, actions: ['Une seule'] }), null);
    assert.equal(parseDemoAnalysis({ ...valid, actions: ['a', 'b', 'c', 'd', 'e'] }), null);
    assert.equal(parseDemoAnalysis({ ...valid, besoin: '' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, echeance: undefined }), null);
    assert.equal(parseDemoAnalysis({ ...valid, extra: 'non' }), null);
    assert.equal(parseDemoAnalysis([valid]), null);
  });
});

describe('parseDemoAnalysis, canal WhatsApp', () => {
  it('reprend le canal et nettoie la réponse immédiate', () => {
    const result = parseDemoAnalysis(
      { ...valid, reponse: 'Bonjour Karim 👋, bien reçu.\n\nBien cordialement,\nL’équipe' },
      'whatsapp',
    );

    assert.equal(result?.canal, 'whatsapp');
    assert.equal(result?.reponse, 'Bonjour Karim, bien reçu.');
  });
});

describe('instantReply', () => {
  it('ne dépasse jamais 40 mots', () => {
    const long = Array.from({ length: 60 }, (_, i) => `mot${i}`).join(' ');

    assert.ok(instantReply(long).split(/\s+/).length <= 40);
  });
});

describe('capWords', () => {
  it('laisse un texte court intact', () => {
    assert.equal(capWords('Un deux trois.', 5), 'Un deux trois.');
  });

  it('coupe à la dernière phrase complète', () => {
    assert.equal(capWords('Un deux trois. Quatre cinq six sept.', 5), 'Un deux trois.');
  });
});

describe('readDemoResponse', () => {
  it('lit la fiche dans la sortie de type message', () => {
    assert.equal(readDemoResponse(response(JSON.stringify(valid)))?.type, 'Demande commerciale');
  });

  it('rejette une réponse incomplète ou illisible', () => {
    assert.equal(readDemoResponse(response(JSON.stringify(valid), 'incomplete')), null);
    assert.equal(readDemoResponse(response('{"type":')), null);
    assert.equal(readDemoResponse(null), null);
  });
});
