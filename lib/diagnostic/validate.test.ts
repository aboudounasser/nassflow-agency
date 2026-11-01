import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isValidEmail,
  isValidPhone,
  MIN_ELAPSED_MS,
  readSubmission,
  stepOf,
  validateStep,
  emptyFields,
} from './validate';
import { buildEmail, buildRow } from './record';

const valid = {
  submissionId: '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e',
  elapsedMs: 45_000,
  reference: '',
  company: 'Exemple SAS',
  sector: 'industrie',
  companySize: '10-49',
  problem: 'relances',
  problemDetails: 'Nos devis partent par e-mail, personne ne relance.',
  tools: ['gmail', 'hubspot'],
  monthlyVolume: '50-200',
  expectedOutcome: 'devis',
  firstName: 'Camille',
  lastName: 'Martin',
  email: 'camille@exemple.fr',
  phone: '+33 6 12 34 56 78',
  consent: true,
};

const read = (patch: Record<string, unknown>) => readSubmission({ ...valid, ...patch });

describe('readSubmission', () => {
  it('accepte un envoi complet et enregistre les libellés', () => {
    const result = readSubmission(valid);
    assert.equal(result.kind, 'ok');
    if (result.kind !== 'ok') return;

    assert.equal(result.submissionId, valid.submissionId);
    assert.deepEqual(result.request, {
      company: 'Exemple SAS',
      sector: 'Industrie',
      companySize: '10 à 49 salariés',
      problem: 'Des devis ne sont jamais relancés',
      problemDetails: 'Nos devis partent par e-mail, personne ne relance.',
      tools: ['Gmail', 'HubSpot'],
      monthlyVolume: '50 à 200',
      expectedOutcome: 'Ne plus perdre de devis',
      firstName: 'Camille',
      lastName: 'Martin',
      email: 'camille@exemple.fr',
      phone: '+33 6 12 34 56 78',
    });
  });

  it('accepte le minimum : entreprise, problème, prénom, e-mail, consentement', () => {
    const result = readSubmission({
      submissionId: valid.submissionId,
      elapsedMs: valid.elapsedMs,
      company: 'Exemple',
      problem: 'autre',
      firstName: 'Camille',
      email: 'c@exemple.fr',
      consent: true,
    });
    assert.equal(result.kind, 'ok');
    if (result.kind !== 'ok') return;
    assert.equal(result.request.sector, null);
    assert.deepEqual(result.request.tools, []);
    assert.equal(result.request.problem, 'Autre chose');
  });

  it('signale un robot quand le champ piège est rempli', () => {
    assert.deepEqual(read({ reference: 'http://spam.example' }), { kind: 'bot' });
  });

  it('refuse un envoi plus rapide que le délai minimal', () => {
    assert.deepEqual(read({ elapsedMs: MIN_ELAPSED_MS - 1 }), { kind: 'too-fast' });
    assert.deepEqual(read({ elapsedMs: undefined }), { kind: 'too-fast' });
    assert.deepEqual(read({ elapsedMs: '9999' }), { kind: 'too-fast' });
    assert.equal(read({ elapsedMs: MIN_ELAPSED_MS }).kind, 'ok');
  });

  it('exige un identifiant d’envoi au format UUID', () => {
    assert.equal(read({ submissionId: undefined }).kind, 'invalid');
    assert.equal(read({ submissionId: 'abc' }).kind, 'invalid');
  });

  const invalid: [string, Record<string, unknown>, string][] = [
    ['secteur hors liste', { sector: 'agriculture' }, 'sector'],
    ['taille hors liste', { companySize: '5000' }, 'companySize'],
    ['problème hors liste', { problem: 'tout' }, 'problem'],
    ['problème absent', { problem: '' }, 'problem'],
    ['outil hors liste', { tools: ['gmail', 'teams'] }, 'tools'],
    ['outil en double', { tools: ['gmail', 'gmail'] }, 'tools'],
    ['outils pas en tableau', { tools: 'gmail' }, 'tools'],
    ['volume hors liste', { monthlyVolume: '10' }, 'monthlyVolume'],
    ['priorité hors liste', { expectedOutcome: 'tout' }, 'expectedOutcome'],
    ['entreprise absente', { company: '   ' }, 'company'],
    ['entreprise trop longue', { company: 'x'.repeat(151) }, 'company'],
    ['précisions trop longues', { problemDetails: 'x'.repeat(1001) }, 'problemDetails'],
    ['prénom absent', { firstName: '' }, 'firstName'],
    ['nom trop long', { lastName: 'x'.repeat(101) }, 'lastName'],
    ['e-mail invalide', { email: 'camille@exemple' }, 'email'],
    ['e-mail absent', { email: '' }, 'email'],
    ['téléphone invalide', { phone: 'appelez-moi' }, 'phone'],
    ['consentement absent', { consent: false }, 'consent'],
    ['consentement en texte', { consent: 'true' }, 'consent'],
    ['champ texte d’un autre type', { company: 42 }, 'company'],
  ];

  for (const [name, patch, field] of invalid) {
    it(`refuse : ${name}`, () => {
      const result = read(patch);
      assert.equal(result.kind, 'invalid');
      if (result.kind === 'invalid') assert.equal(result.field, field);
    });
  }

  it('refuse un corps qui n’est pas un objet', () => {
    assert.equal(readSubmission(null).kind, 'invalid');
    assert.equal(readSubmission([valid]).kind, 'invalid');
    assert.equal(readSubmission('texte').kind, 'invalid');
  });
});

describe('isValidEmail', () => {
  it('accepte les formes courantes', () => {
    for (const email of ['a@b.fr', 'prenom.nom+tag@sous.domaine.com', 'delivered@resend.dev']) {
      assert.equal(isValidEmail(email), true, email);
    }
  });

  it('refuse le reste', () => {
    for (const email of ['', 'a@b', 'a b@c.fr', 'a@@b.fr', 'a@b..fr', '<a@b.fr>', 'a@b.f', `${'a'.repeat(250)}@b.fr`]) {
      assert.equal(isValidEmail(email), false, email);
    }
  });
});

describe('isValidPhone', () => {
  it('accepte les formats français et internationaux', () => {
    for (const phone of ['06 12 34 56 78', '+33 6 12 34 56 78', '05.49.00.00.00', '(0)549-000000']) {
      assert.equal(isValidPhone(phone), true, phone);
    }
  });

  it('refuse les lettres et les numéros trop courts', () => {
    for (const phone of ['12345', 'zéro six', '06 12 34 56 78 ext 4', '+'.repeat(31)]) {
      assert.equal(isValidPhone(phone), false, phone);
    }
  });
});

describe('validateStep', () => {
  it('bloque chaque étape sur ses seuls champs requis', () => {
    assert.deepEqual(Object.keys(validateStep(0, emptyFields)), ['company']);
    assert.deepEqual(Object.keys(validateStep(1, emptyFields)), ['problem']);
    assert.deepEqual(Object.keys(validateStep(2, emptyFields)), []);
    assert.deepEqual(Object.keys(validateStep(3, emptyFields)), ['firstName', 'email', 'consent']);
  });

  it('situe chaque champ dans son étape', () => {
    assert.equal(stepOf('sector'), 0);
    assert.equal(stepOf('problemDetails'), 1);
    assert.equal(stepOf('tools'), 2);
    assert.equal(stepOf('consent'), 3);
  });
});

describe('buildRow et buildEmail', () => {
  const result = readSubmission(valid);
  if (result.kind !== 'ok') throw new Error('envoi de référence invalide');
  const now = new Date('2026-11-01T10:00:00Z');

  it('remplit les nouvelles colonnes et les anciennes', () => {
    const row = buildRow(result.request, result.submissionId, now);
    assert.equal(row.submission_id, valid.submissionId);
    assert.equal(row.consent_at, '2026-11-01T10:00:00.000Z');
    assert.deepEqual(row.tools, ['Gmail', 'HubSpot']);
    assert.equal(row.professional_email, 'camille@exemple.fr');
    assert.equal(row.current_tools, 'Gmail, HubSpot');
    assert.equal(row.main_need, 'Des devis ne sont jamais relancés');
    assert.equal(row.source, 'diagnostic');
  });

  it('ne laisse jamais project_description vide', () => {
    const row = buildRow({ ...result.request, problemDetails: null, tools: [] }, result.submissionId, now);
    assert.equal(row.project_description, 'Des devis ne sont jamais relancés');
    assert.equal(row.tools, null);
  });

  it('échappe chaque valeur dans l’e-mail', () => {
    const email = buildEmail({ ...result.request, company: '<b>Ex</b>\nSAS', problemDetails: '<script>x</script>' }, now);
    assert.ok(!email.html.includes('<script>'));
    assert.ok(email.html.includes('&lt;script&gt;'));
    assert.ok(!email.subject.includes('\n'));
    assert.equal(email.replyTo, 'camille@exemple.fr');
  });
});
