import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { solutions } from '@/lib/content/solutions';
import { suggestFirstMessage } from './message';
import { checkEmail, companyFromEmail, isValidPhone, scoreProspect, words } from './scoring';
import type { ProspectInput } from './types';

function input(fields: Partial<ProspectInput>): ProspectInput {
  return {
    company: null,
    contactName: null,
    contactRole: null,
    email: null,
    phone: null,
    website: null,
    sector: null,
    employees: null,
    need: null,
    source: 'manuel',
    ...fields,
  };
}

const IDEAL = input({
  company: 'Duval Immobilier SARL',
  contactName: 'Claire Duval',
  contactRole: 'Gérante',
  email: 'claire@duval-immobilier.fr',
  phone: '06 39 98 12 40',
  website: 'duval-immobilier.fr',
  sector: 'Immobilier',
  employees: 8,
  need: 'On perd du temps à répondre aux mêmes questions et à caler les rendez-vous.',
});

describe('checkEmail', () => {
  it('distingue e-mail pro, messagerie grand public et adresse invalide', () => {
    assert.equal(checkEmail('claire@duval-immobilier.fr'), 'pro');
    assert.equal(checkEmail(' Claire@Gmail.com '), 'webmail');
    assert.equal(checkEmail('jean@orange.fr'), 'webmail');
    assert.equal(checkEmail(null), 'missing');
    assert.equal(checkEmail('   '), 'missing');

    for (const bad of ['claire', 'claire@', '@duval.fr', 'claire@duval', 'a..b@duval.fr', 'x@-duval.fr']) {
      assert.equal(checkEmail(bad), 'invalid', bad);
    }
  });

  it('refuse les adresses jetables et d’exemple', () => {
    assert.equal(checkEmail('qui@yopmail.com'), 'invalid');
    assert.equal(checkEmail('test@duval.fr'), 'invalid');
    assert.equal(checkEmail('contact@example.com'), 'invalid');
  });
});

describe('isValidPhone', () => {
  it('accepte les numéros français et internationaux, quelle que soit la présentation', () => {
    for (const ok of ['06 39 98 12 40', '01.99.00.27.31', '+33 6 39 98 55 10', '0033639981240', '+41 22 123 45 67']) {
      assert.equal(isValidPhone(ok), true, ok);
    }
  });

  it('refuse les numéros incomplets ou factices', () => {
    for (const bad of [null, '', '06 39 98', '0000000000', '0123456789', '0612345678', '+33 0 12 34 56 78', 'appeler le standard']) {
      assert.equal(isValidPhone(bad), false, String(bad));
    }
  });
});

describe('companyFromEmail', () => {
  it('déduit un nom du domaine pro, jamais d’une messagerie grand public', () => {
    assert.equal(companyFromEmail('nadia@formapro-conseil.fr'), 'Formapro Conseil');
    assert.equal(companyFromEmail('nadia@gmail.com'), null);
  });
});

describe('words', () => {
  it('cherche des mots entiers quand le mot-clé est entouré d’espaces', () => {
    assert.equal(words('Savoir-faire').includes(' sav '), false);
    assert.equal(words('Le SAV déborde').includes(' sav '), true);
    assert.equal(words('Écrire à l’équipe').includes('ecrire a l equipe'), true);
  });
});

describe('scoreProspect', () => {
  it('note 10 une entreprise documentée, joignable et qui exprime un besoin', () => {
    const scoring = scoreProspect(IDEAL);

    assert.equal(scoring.score, 10);
    assert.equal(scoring.relevant, true);
    assert.deepEqual(scoring.need.categories, ['support', 'rendez-vous']);
    assert.match(scoring.reason, /^Entreprise identifiée \(SARL, site web, domaine propre\)/);
    assert.match(scoring.reason, /joignable par e-mail pro et téléphone/);
  });

  it('plafonne à 3 un prospect injoignable, quel que soit le reste', () => {
    const scoring = scoreProspect({ ...IDEAL, email: 'pas-un-mail', phone: '0000000000' });

    assert.equal(scoring.score, 3);
    assert.equal(scoring.relevant, false);
    assert.match(scoring.reason, /^Coordonnées invalides/);
  });

  it('plafonne à 4 un particulier, même joignable et avec un besoin', () => {
    const scoring = scoreProspect(
      input({
        company: 'Particulier',
        email: 'paul@gmail.com',
        phone: '06 39 98 12 40',
        need: 'Je suis un particulier, je veux automatiser mes e-mails.',
      }),
    );

    assert.equal(scoring.company.isCompany, false);
    assert.ok(scoring.score <= 4);
    assert.match(scoring.reason, /particulier/);
  });

  it('ne prend pas « nos clients particuliers » pour un particulier', () => {
    const scoring = scoreProspect({ ...IDEAL, need: 'Nos clients particuliers posent toujours les mêmes questions.' });

    assert.equal(scoring.company.isCompany, true);
  });

  it('écarte un profil sans besoin exprimé ni signe d’entreprise', () => {
    const scoring = scoreProspect(input({ company: 'Studio', email: 'contact@gmail.com' }));

    assert.equal(scoring.relevant, false);
    assert.ok(scoring.score < 5);
  });

  it('fait baisser un « pas de budget »', () => {
    const before = scoreProspect(IDEAL).need.points;
    const after = scoreProspect({ ...IDEAL, need: `${IDEAL.need} Mais pas de budget cette année.` }).need.points;

    assert.ok(after < before);
  });

  it('retient une demande du site même sans nom d’entreprise, grâce au domaine', () => {
    const scoring = scoreProspect(
      input({
        contactName: 'Nadia',
        email: 'nadia@formapro-conseil.fr',
        need: 'Beaucoup de demandes d’inscription, qualification manuelle.',
        source: 'site:assistant',
      }),
    );

    assert.equal(scoring.company.name, 'Formapro Conseil');
    assert.equal(scoring.relevant, true);
    assert.match(scoring.reason, /demande entrante/);
  });

  it('reconnaît le besoin de chaque solution du catalogue', () => {
    for (const solution of solutions) {
      const scoring = scoreProspect(input({ need: `Demande « ${solution.categoryLabel} » : ${solution.title}.` }));

      assert.ok(scoring.need.categories.length > 0, solution.slug);
    }
  });

  it('reste entre 1 et 10', () => {
    assert.equal(scoreProspect(input({})).score, 1);
  });
});

describe('suggestFirstMessage', () => {
  it('salue le contact par son prénom et part du besoin repéré', () => {
    const message = suggestFirstMessage(IDEAL, scoreProspect(IDEAL));

    assert.match(message, /^Bonjour Claire,/);
    assert.match(message, /Duval Immobilier SARL/);
    assert.match(message, /mêmes questions/);
    assert.match(message, /\?$/);
  });

  it('remercie une demande venue du site au lieu de se présenter', () => {
    const lead = input({ email: 'nadia@formapro.fr', source: 'site:assistant' });
    const message = suggestFirstMessage(lead, scoreProspect(lead));

    assert.match(message, /^Bonjour,/);
    assert.match(message, /Merci pour votre demande/);
  });

  it('ne promet ni chiffre ni délai', () => {
    for (const need of ['questions clients', 'devis', 'rendez-vous', 'mails', 'excel', 'leads', null]) {
      const prospect = { ...IDEAL, need };
      const message = suggestFirstMessage(prospect, scoreProspect(prospect));

      // Seule durée permise : celle de l'échange proposé.
      assert.doesNotMatch(message.replace('15 minutes', ''), /\d|%|heure|minute/);
    }
  });
});
