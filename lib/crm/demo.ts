import { addDays, todayInParis } from './dates';
import { applyStepAction, createProspect, moveProspect } from './prospect';
import type { Prospect, ProspectInput, Stage } from './types';

/**
 * Des fiches d'exemple, pour le seul stockage en mémoire du
 * développement (lib/crm/store.ts). Tout est fictif : domaines en
 * `.example` (réservé, RFC 2606) et numéros de la plage que l'ARCEP
 * réserve à la fiction (01 99 00…, 06 39 98…).
 */

type Seed = Partial<ProspectInput> & {
  /** Colonne cible, et il y a combien de jours on y est entré. */
  stage?: Stage;
  daysAgo?: number;
  /** Actions faites depuis l'entrée dans la colonne. */
  done?: number;
};

const SEEDS: Seed[] = [
  {
    company: 'Duval Immobilier SARL',
    contactName: 'Claire Duval',
    contactRole: 'Gérante',
    email: 'claire@duval-immobilier.example',
    phone: '06 39 98 12 40',
    website: 'duval-immobilier.example',
    sector: 'Immobilier',
    employees: 8,
    need: 'Les demandes de visite arrivent par le site et par téléphone, on perd du temps à répondre aux mêmes questions et à caler les rendez-vous.',
  },
  {
    company: 'Atelier Brun Rénovation',
    contactName: 'Marc Brun',
    contactRole: 'Fondateur',
    email: 'marc@brun-renovation.example',
    phone: '01 99 00 27 31',
    sector: 'BTP',
    employees: 14,
    need: 'Devis faits à la main sur Excel, relances clients oubliées.',
    stage: 'contactes',
    daysAgo: 6,
  },
  {
    company: 'Cabinet Lefort & Associés',
    contactName: 'Sophie Lefort',
    contactRole: 'Associée',
    email: 's.lefort@cabinet-lefort.example',
    sector: 'Expertise comptable',
    employees: 22,
    need: 'Boîte mail saturée de pièces clients, ressaisie dans le logiciel comptable.',
    stage: 'interesses',
    daysAgo: 1,
  },
  {
    company: 'Maison Nova SAS',
    contactName: 'Yanis Haddad',
    contactRole: 'CEO',
    email: 'yanis@maison-nova.example',
    phone: '+33 6 39 98 55 10',
    website: 'https://maison-nova.example',
    sector: 'E-commerce',
    employees: 35,
    need: 'Service client débordé en période de soldes : questions de suivi de commande, retours, SAV sur WhatsApp.',
    stage: 'qualifies',
    daysAgo: 4,
    done: 1,
  },
  {
    company: 'Clinique Vétérinaire des Alpes',
    contactName: 'Dr Julien Morel',
    contactRole: 'Directeur',
    email: 'direction@clinique-alpes.example',
    phone: '04 99 00 61 22',
    sector: 'Santé animale',
    employees: 12,
    need: 'Standard téléphonique saturé, prise de rendez-vous à automatiser.',
    stage: 'conclus',
    daysAgo: 10,
    done: 1,
  },
  {
    company: 'Transports Garnier',
    contactName: 'Hélène Garnier',
    email: 'h.garnier@transports-garnier.example',
    sector: 'Transport',
    employees: 60,
    stage: 'contactes',
    daysAgo: 12,
    done: 1,
  },
  {
    company: 'Particulier',
    contactName: 'Paul Martin',
    email: 'paul.martin@gmail.com',
    need: 'Je suis un particulier, je voudrais un assistant pour mes mails perso.',
  },
  {
    company: 'Studio Pixel',
    contactName: 'Inès',
    email: 'test@example.com',
    phone: '0000000000',
    need: 'Juste curieux, pas de budget.',
  },
  {
    company: 'Boulangerie Les Blés d’Or',
    contactName: 'Thomas Petit',
    email: 'lesblesdor@orange.fr',
    sector: 'Commerce de proximité',
    employees: 4,
  },
  {
    contactName: 'Nadia Benali',
    email: 'nadia@formapro-conseil.example',
    phone: '06 39 98 77 03',
    need: 'Organisme de formation : on reçoit beaucoup de demandes d’inscription, qualification manuelle, relances oubliées.',
    source: 'site:assistant',
  },
];

export function demoProspects(today: string = todayInParis()): Prospect[] {
  return SEEDS.map((seed, index) => {
    const { stage, daysAgo = 0, done = 0, ...fields } = seed;
    const start = addDays(today, -daysAgo - 2);
    const input: ProspectInput = {
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

    let prospect = createProspect(input, {
      id: `demo-${index + 1}`,
      today: start,
      createdAt: `${start}T09:00:00.000Z`,
    });

    if (stage && stage !== prospect.stage) {
      const moved = moveProspect(prospect, stage, addDays(today, -daysAgo));
      if (moved.ok) prospect = moved.prospect;
    }

    for (let i = 0; i < done; i++) {
      prospect = applyStepAction(prospect, { type: 'fait' }, addDays(today, -daysAgo + i + 1));
    }

    return prospect;
  });
}
