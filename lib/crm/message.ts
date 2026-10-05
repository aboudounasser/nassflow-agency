import type { ProspectInput } from './types';
import type { NeedCategory, Scoring } from './scoring';

/**
 * Le premier message de prise de contact, adapté au besoin repéré.
 *
 * Mêmes règles d'écriture que le site (lib/content/solutions.ts) : on
 * parle du résultat pour le dirigeant, avec ses mots ; aucun chiffre de
 * performance, aucun délai promis. Le message est court, vouvoie, et
 * finit sur une question à laquelle on répond par oui ou non : c'est
 * un premier contact, pas une proposition.
 *
 * C'est une suggestion à relire : elle part du besoin détecté, pas de
 * ce que le prospect a réellement vécu.
 */

const ANGLES: Record<NeedCategory | 'generique', (company: string) => string> = {
  support: (company) =>
    `J’imagine que ${company} répond chaque jour aux mêmes questions de clients. Nous installons des agents IA qui y répondent à votre place, avec vos mots et vos conditions, et vous passent la main dès que c’est sérieux.`,
  leads: (company) =>
    `Chez ${company}, une demande entrante qui attend est souvent une demande perdue. Nous installons des agents IA qui répondent à chaque demande, posent vos questions de qualification et relancent à votre place.`,
  'rendez-vous': (company) =>
    `Chez ${company}, la prise de rendez-vous passe sans doute encore par des échanges d’e-mails ou d’appels. Nous installons des agents IA qui proposent vos créneaux, confirment et rappellent, sans vous solliciter.`,
  devis: (company) =>
    `Préparer les devis prend sans doute une bonne part de la semaine chez ${company}. Nous automatisons leur préparation à partir de vos tarifs et de vos règles : vous n’avez plus qu’à relire et envoyer.`,
  emails: (company) =>
    `La boîte mail de ${company} doit concentrer beaucoup de demandes à trier. Nous installons des agents IA qui la trient, préparent les réponses et vous signalent ce qui demande votre attention.`,
  outils: (company) =>
    `Chez ${company}, les mêmes informations sont sans doute ressaisies d’un outil à l’autre. Nous connectons vos outils et confions ces tâches répétitives à des agents IA, pour que vos équipes ne recopient plus rien.`,
  generique: (company) =>
    `Nous aidons des entreprises comme ${company} à confier leurs tâches répétitives à des agents IA autonomes : répondre aux clients, qualifier les demandes, relancer, mettre à jour les outils.`,
};

function firstName(contactName: string | null): string | null {
  const first = (contactName ?? '').trim().split(/\s+/)[0];

  return first && first.length > 1 ? first[0].toUpperCase() + first.slice(1) : null;
}

/** L'objet de l'e-mail : court, sans majuscules criardes ni promesse. */
export function suggestSubject(input: ProspectInput, scoring: Scoring): string {
  if (input.source.startsWith('site:')) return 'Votre demande sur nassflow.com';

  return scoring.company.name ? `${scoring.company.name} : une question rapide` : 'Une question rapide';
}

export function suggestFirstMessage(input: ProspectInput, scoring: Scoring): string {
  const name = firstName(input.contactName);
  const company = scoring.company.name ?? 'votre entreprise';
  const angle = ANGLES[scoring.need.categories[0] ?? 'generique'](company);
  const inbound = input.source.startsWith('site:');

  const opening = inbound
    ? 'Merci pour votre demande sur nassflow.com.'
    : 'Je me permets de vous écrire directement.';

  const closing = inbound
    ? 'Avez-vous 15 minutes cette semaine pour en parler de vive voix ?'
    : 'Seriez-vous ouvert à un échange de 15 minutes pour voir si cela peut s’appliquer chez vous ?';

  return [`Bonjour${name ? ` ${name}` : ''},`, `${opening} ${angle}`, closing].join('\n\n');
}
