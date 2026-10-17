import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildDemoRequest,
  capWords,
  parseDemoAnalysis,
  readDemoResponse,
  validateDemoText,
} from './analysis';

const valid = {
  type: 'Demande commerciale',
  entreprise: 'non précisé',
  contact: 'non précisé',
  besoin: 'Automatiser le suivi des devis.',
  priorite: 'Haute',
  raison_priorite: 'Rappel demandé cette semaine.',
  actions: ['Fiche créée dans le CRM', 'Simulé : Alerte envoyée au commercial sur Slack'],
  brouillon: 'Bonjour, merci pour votre message.',
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

describe('buildDemoRequest', () => {
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
    const result = parseDemoAnalysis({ ...valid, brouillon: '<b>Bonjour</b> <a href="x">ici</a>' });

    assert.equal(result?.brouillon, 'Bonjour ici');
  });

  it('rejette un type, une priorité ou un nombre d’actions hors schéma', () => {
    assert.equal(parseDemoAnalysis({ ...valid, type: 'Poème' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, priorite: 'Urgente' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, actions: ['Une seule'] }), null);
    assert.equal(parseDemoAnalysis({ ...valid, actions: ['a', 'b', 'c', 'd', 'e'] }), null);
    assert.equal(parseDemoAnalysis({ ...valid, besoin: '' }), null);
    assert.equal(parseDemoAnalysis({ ...valid, extra: 'non' }), null);
    assert.equal(parseDemoAnalysis([valid]), null);
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
