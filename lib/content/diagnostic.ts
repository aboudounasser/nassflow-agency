import { problemsContent } from '@/lib/content/problems';

/**
 * Le formulaire de diagnostic (/demarrer-un-projet) : la seule source de
 * ses textes et de ses listes de choix.
 *
 * Les listes sont FERMÉES : la route serveur (lib/diagnostic/validate.ts)
 * refuse toute valeur absente d'ici. `value` est ce qui circule entre le
 * navigateur et le serveur ; c'est le libellé qui est enregistré en base
 * et envoyé dans l'e-mail, pour qu'une ligne se lise sans table de
 * correspondance.
 *
 * Les problèmes sont ceux de l'accueil, lus à leur source
 * (lib/content/problems.ts) : réécrire une carte suffit à la mettre à
 * jour ici.
 */

export type Choice = { value: string; label: string };

export const sectors = [
  { value: 'industrie', label: 'Industrie' },
  { value: 'negoce', label: 'Négoce / distribution' },
  { value: 'services', label: 'Services aux entreprises' },
  { value: 'btp', label: 'BTP' },
  { value: 'transport', label: 'Transport / logistique' },
  { value: 'sante', label: 'Santé' },
  { value: 'tech', label: 'Tech / logiciel' },
  { value: 'autre', label: 'Autre' },
] as const satisfies readonly Choice[];

export const companySizes = [
  { value: '1-9', label: '1 à 9 salariés' },
  { value: '10-49', label: '10 à 49 salariés' },
  { value: '50-249', label: '50 à 249 salariés' },
  { value: '250+', label: '250 salariés et plus' },
] as const satisfies readonly Choice[];

export const problemChoices: readonly (Choice & { description?: string })[] = [
  ...problemsContent.items.map((item) => ({
    value: item.id,
    label: item.title,
    description: item.description,
  })),
  { value: 'autre', label: 'Autre chose' },
];

export const tools = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'google-sheets', label: 'Google Sheets' },
  { value: 'excel', label: 'Excel' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'pipedrive', label: 'Pipedrive' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'slack', label: 'Slack' },
  { value: 'notion', label: 'Notion' },
  { value: 'autre', label: 'Autre / aucun' },
] as const satisfies readonly Choice[];

export const monthlyVolumes = [
  { value: 'moins-50', label: 'Moins de 50' },
  { value: '50-200', label: '50 à 200' },
  { value: '200-1000', label: '200 à 1 000' },
  { value: 'plus-1000', label: 'Plus de 1 000' },
  { value: 'inconnu', label: 'Je ne sais pas' },
] as const satisfies readonly Choice[];

export const expectedOutcomes = [
  { value: 'repondre', label: 'Répondre plus vite' },
  { value: 'devis', label: 'Ne plus perdre de devis' },
  { value: 'saisie', label: 'Moins de saisie' },
  { value: 'visibilite', label: 'Voir où ça bloque' },
  { value: 'autre', label: 'Autre' },
] as const satisfies readonly Choice[];

/** Longueurs maximales, partagées par le navigateur et le serveur. */
export const limits = {
  company: 150,
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 30,
  problemDetails: 1000,
} as const;

export const diagnosticContent = {
  page: {
    title: 'Demander un diagnostic | NASSFLOW AGENCY',
    shareTitle: 'Demander un diagnostic — NASSFLOW AGENCY',
    description:
      '4 étapes, environ 2 minutes. Nous étudions votre situation avant de vous proposer quoi que ce soit.',
    eyebrow: 'Demander un diagnostic',
    h1: 'Parlons de ce qui ralentit vos ventes.',
    intro:
      '4 étapes, environ 2 minutes. Nous étudions votre situation avant de vous proposer quoi que ce soit.',
  },

  steps: [
    { title: 'Votre entreprise' },
    { title: 'Votre problème' },
    { title: 'Vos outils et votre volume' },
    { title: 'Vos coordonnées' },
  ],

  fields: {
    company: 'Nom de l’entreprise',
    sector: 'Secteur',
    sectorPlaceholder: 'Sélectionnez votre secteur',
    companySize: 'Taille de l’entreprise',
    problem: 'Qu’est-ce qui vous coûte le plus aujourd’hui ?',
    problemDetails: 'Précisions',
    problemDetailsHint:
      'Ce qui se passe concrètement, les outils en jeu, ce que vous avez déjà essayé.',
    tools: 'Les outils que vous utilisez',
    toolsHint: 'Plusieurs choix possibles.',
    monthlyVolume: 'Demandes commerciales reçues par mois',
    expectedOutcome: 'Ce que vous attendez en priorité',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail professionnel',
    phone: 'Téléphone',
    consent:
      'J’accepte que NASSFLOW utilise ces informations pour me recontacter au sujet de ma demande.',
    consentLink: 'Politique de confidentialité',
    optional: '(facultatif)',
  },

  progress: (step: number, total: number) => `Étape ${step} sur ${total}`,

  actions: {
    back: 'Retour',
    next: 'Continuer',
    submit: 'Envoyer ma demande',
    submitting: 'Envoi en cours…',
  },

  errors: {
    company: 'Indiquez le nom de votre entreprise.',
    companyTooLong: `Le nom de l’entreprise ne doit pas dépasser ${limits.company} caractères.`,
    sector: 'Choisissez un secteur dans la liste.',
    companySize: 'Choisissez la taille de votre entreprise.',
    problem: 'Choisissez ce qui vous coûte le plus.',
    problemDetailsTooLong: `Les précisions ne doivent pas dépasser ${limits.problemDetails} caractères.`,
    tools: 'Cochez au moins un outil, ou « Autre / aucun ».',
    monthlyVolume: 'Choisissez un volume, ou « Je ne sais pas ».',
    expectedOutcome: 'Choisissez ce que vous attendez en priorité.',
    firstName: 'Indiquez votre prénom.',
    firstNameTooLong: `Le prénom ne doit pas dépasser ${limits.firstName} caractères.`,
    lastNameTooLong: `Le nom ne doit pas dépasser ${limits.lastName} caractères.`,
    email: 'Indiquez une adresse e-mail valide, par exemple nom@entreprise.fr.',
    phone: 'Indiquez un numéro de téléphone valide (chiffres, espaces, +, points ou tirets).',
    consent: 'Cochez la case pour que nous puissions vous recontacter.',
  },

  confirmation: {
    title: (firstName: string) =>
      `Merci ${firstName}, votre demande est bien reçue.`,
    text: 'Nous l’étudions et revenons vers vous rapidement.',
    booking: 'Réserver directement un appel de 15 minutes',
  },

  failure: {
    text: 'L’envoi n’a pas abouti. Vos réponses sont conservées : vous pouvez réessayer, ou nous écrire à',
  },
};
