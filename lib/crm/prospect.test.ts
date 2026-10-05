import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkCrmAccess } from './auth';
import { readProspectCsv } from './csv';
import { addDays } from './dates';
import { demoProspects } from './demo';
import { readEmployees, readProspectInput } from './input';
import { applyStepAction, createProspect, moveProspect, reconcile, updateProspect, viewProspect } from './prospect';
import { fromChatLead, fromSolutionRequest } from './site-leads';
import type { ProspectInput } from './types';

const DAY = '2026-10-05';
const META = { id: 'p1', today: DAY, createdAt: `${DAY}T08:00:00Z` };

const GOOD: ProspectInput = {
  company: 'Maison Nova SAS',
  contactName: 'Yanis Haddad',
  contactRole: 'CEO',
  email: 'yanis@maison-nova.fr',
  phone: '06 39 98 55 10',
  website: 'maison-nova.fr',
  sector: 'E-commerce',
  employees: 35,
  need: 'Service client débordé : questions de suivi de commande.',
  source: 'manuel',
};

const WEAK: ProspectInput = { ...GOOD, email: null, phone: null };

describe('createProspect', () => {
  it('range une fiche pertinente dans « Nouveaux prospects », premier message dû aujourd’hui', () => {
    const prospect = createProspect(GOOD, META);

    assert.equal(prospect.stage, 'nouveaux');
    assert.equal(prospect.excludedBy, null);
    assert.equal(prospect.dueOn, DAY);
  });

  it('exclut automatiquement une fiche sous 5', () => {
    const prospect = createProspect(WEAK, META);

    assert.equal(prospect.stage, 'non_pertinent');
    assert.equal(prospect.excludedBy, 'auto');
    assert.equal(prospect.activity.at(-1)?.kind, 'exclu');
  });
});

describe('updateProspect', () => {
  it('réintègre une fiche exclue par le score quand elle est complétée', () => {
    const excluded = createProspect(WEAK, META);
    const fixed = updateProspect(excluded, GOOD, '2026-10-07');

    assert.equal(fixed.stage, 'nouveaux');
    assert.equal(fixed.excludedBy, null);
    assert.equal(fixed.dueOn, '2026-10-07');
    assert.deepEqual(
      fixed.activity.slice(-2).map((entry) => entry.kind),
      ['modifie', 'reintegre'],
    );
  });

  it('exclut une fiche du pipeline dont le score tombe sous 5', () => {
    const moved = moveProspect(createProspect(GOOD, META), 'qualifies', DAY);
    assert.ok(moved.ok);

    const degraded = updateProspect(moved.prospect, WEAK, DAY);

    assert.equal(degraded.stage, 'non_pertinent');
    assert.equal(degraded.excludedBy, 'auto');
  });

  it('ne sort pas une fiche que l’utilisateur a lui-même classée non pertinente', () => {
    const moved = moveProspect(createProspect(GOOD, META), 'non_pertinent', DAY);
    assert.ok(moved.ok);
    assert.equal(moved.prospect.excludedBy, 'manual');

    assert.equal(reconcile(moved.prospect, DAY), moved.prospect);
  });

  it('garde la provenance d’origine', () => {
    const lead = createProspect({ ...GOOD, source: 'site:assistant' }, META);

    assert.equal(updateProspect(lead, GOOD, DAY).source, 'site:assistant');
  });
});

describe('moveProspect', () => {
  it('refuse de sortir de « Non pertinent » une fiche sous 5', () => {
    const result = moveProspect(createProspect(WEAK, META), 'contactes', DAY);

    assert.equal(result.ok, false);
  });

  it('relance la séquence de la colonne d’arrivée', () => {
    const result = moveProspect(createProspect(GOOD, META), 'interesses', '2026-10-06');
    assert.ok(result.ok);

    assert.equal(result.prospect.stepIndex, 0);
    assert.equal(result.prospect.dueOn, '2026-10-06');
    assert.equal(viewProspect(result.prospect, '2026-10-06').plan[0].id, 'proposer-decouverte');
  });
});

describe('applyStepAction', () => {
  it('passe en « Contactés » après le premier message, relance datée du jour de l’envoi', () => {
    const sent = applyStepAction(createProspect(GOOD, META), { type: 'fait' }, '2026-10-08');

    assert.equal(sent.stage, 'contactes');
    assert.equal(sent.dueOn, addDays('2026-10-08', 3));
    assert.deepEqual(
      sent.activity.slice(-2).map((entry) => entry.kind),
      ['fait', 'deplace'],
    );
  });

  it('ignorer avance plus tôt que faire', () => {
    const contacted = applyStepAction(createProspect(GOOD, META), { type: 'fait' }, DAY);
    const done = applyStepAction(contacted, { type: 'fait' }, contacted.dueOn);
    const skipped = applyStepAction(contacted, { type: 'ignore' }, contacted.dueOn);

    assert.equal(done.stepIndex, skipped.stepIndex);
    assert.ok(skipped.dueOn < done.dueOn);
  });

  it('reporter garde l’action et décale l’échéance', () => {
    const prospect = createProspect(GOOD, META);
    const later = applyStepAction(prospect, { type: 'reporter', days: 3 }, DAY);

    assert.equal(later.stepIndex, prospect.stepIndex);
    assert.equal(later.dueOn, '2026-10-08');
  });
});

describe('readProspectInput', () => {
  it('nettoie les champs et lit l’effectif', () => {
    const read = readProspectInput({ company: '  Acme   SAS ', email: '', employees: '10 à 50' }, 'manuel');

    assert.ok(read.ok);
    assert.equal(read.input.company, 'Acme SAS');
    assert.equal(read.input.email, null);
    assert.equal(read.input.employees, 10);
  });

  it('refuse une fiche qui n’identifie personne', () => {
    assert.equal(readProspectInput({ sector: 'BTP' }, 'manuel').ok, false);
  });

  it('refuse une valeur trop longue au lieu de la tronquer', () => {
    assert.equal(readProspectInput({ company: 'x'.repeat(201) }, 'manuel').ok, false);
  });

  it('lit les effectifs écrits à la française', () => {
    assert.equal(readEmployees('1 200 salariés'), 1200);
    assert.equal(readEmployees('inconnu'), null);
    assert.equal(readEmployees(12.7), 12);
  });
});

describe('readProspectCsv', () => {
  it('lit un export Excel français (point-virgule, BOM, guillemets)', () => {
    const csv =
      '﻿Nom de l’entreprise;Responsable;E-mail;Téléphone;Notes;Couleur\r\n' +
      '"Duval; Immobilier";Claire Duval;claire@duval.fr;06 39 98 12 40;"Dit ""débordée"""\r\n' +
      '\r\n' +
      'Atelier Brun;Marc;marc@brun.fr;;\r\n';
    const read = readProspectCsv(csv);

    assert.ok(read.ok);
    assert.equal(read.rows.length, 2);
    assert.deepEqual(read.rows[0], {
      company: 'Duval; Immobilier',
      contactName: 'Claire Duval',
      email: 'claire@duval.fr',
      phone: '06 39 98 12 40',
      need: 'Dit "débordée"',
    });
    assert.deepEqual(read.ignoredColumns, ['Couleur']);
  });

  it('lit un export anglais à virgules, avec un retour à la ligne dans une cellule', () => {
    const read = readProspectCsv('Company,Email,Notes\nAcme,a@acme.io,"ligne 1\nligne 2"\n');

    assert.ok(read.ok);
    assert.equal(read.rows[0].need, 'ligne 1\nligne 2');
  });

  it('explique un fichier sans en-tête reconnu', () => {
    assert.equal(readProspectCsv('foo;bar\n1;2').ok, false);
  });
});

describe('demandes du site', () => {
  it('traduit une demande de l’assistant', () => {
    const lead = fromChatLead({
      id: 'abc',
      created_at: '2026-10-01T10:00:00Z',
      email: 'nadia@formapro.fr',
      first_name: 'Nadia',
      need: 'Relances oubliées',
      page: '/solutions/devis',
    });

    assert.equal(lead?.ref, 'chat_leads:abc');
    assert.equal(lead?.input.source, 'site:assistant');
    assert.equal(lead?.input.need, 'Relances oubliées (depuis /solutions/devis)');
  });

  it('traduit une demande de solution avec ses réponses et la catégorie', () => {
    const lead = fromSolutionRequest({
      id: 'xyz',
      created_at: '2026-10-01T10:00:00Z',
      solution_slug: 'reponse-clients',
      company: 'Maison Nova',
      contact_name: 'Yanis',
      email: 'yanis@maison-nova.fr',
      phone: null,
      sector: 'E-commerce',
      answers: { volume_demandes: 'Plus de 100' },
    });

    assert.equal(lead?.ref, 'solution_requests:xyz');
    assert.match(lead?.input.need ?? '', /Service client/);
    assert.match(lead?.input.need ?? '', /Plus de 100/);
  });
});

describe('demoProspects', () => {
  it('couvre toutes les colonnes, exclusions comprises', () => {
    const stages = new Set(demoProspects(DAY).map((prospect) => prospect.stage));

    for (const stage of ['nouveaux', 'contactes', 'interesses', 'qualifies', 'conclus', 'non_pertinent']) {
      assert.ok(stages.has(stage as never), stage);
    }
  });
});

describe('checkCrmAccess', () => {
  const basic = (user: string, password: string) => `Basic ${btoa(`${user}:${password}`)}`;
  const env = { CRM_PASSWORD: 's3cret', NODE_ENV: 'production' };

  it('ferme le CRM en production sans mot de passe, l’ouvre en développement', () => {
    assert.equal(checkCrmAccess(null, { NODE_ENV: 'production' }), 'disabled');
    assert.equal(checkCrmAccess(null, { NODE_ENV: 'development' }), 'granted');
  });

  it('exige les bons identifiants dès qu’un mot de passe est défini', () => {
    assert.equal(checkCrmAccess(null, env), 'challenge');
    assert.equal(checkCrmAccess(basic('nassflow', 'faux'), env), 'challenge');
    assert.equal(checkCrmAccess(basic('autre', 's3cret'), env), 'challenge');
    assert.equal(checkCrmAccess('Bearer s3cret', env), 'challenge');
    assert.equal(checkCrmAccess(basic('nassflow', 's3cret'), env), 'granted');
    assert.equal(checkCrmAccess(basic('moi', 's3cret'), { ...env, CRM_USER: 'moi' }), 'granted');
    assert.equal(checkCrmAccess(basic('nassflow', 's3cret'), { ...env, NODE_ENV: 'development' }), 'granted');
  });

  it('accepte un mot de passe contenant « : »', () => {
    assert.equal(checkCrmAccess(basic('nassflow', 'a:b'), { CRM_PASSWORD: 'a:b' }), 'granted');
  });
});
