import { DEFAULT_CHANNEL, type DemoChannel } from '@/lib/demo/channels';

/**
 * La démonstration interactive de l'accueil : la seule source de ses
 * textes (components/sections/Demo.tsx, components/demo/).
 *
 * Le visiteur écrit comme un prospect ; l'agent (app/api/chat/demo)
 * analyse la demande et renvoie une fiche. Rien n'est envoyé ni
 * enregistré : chaque action affichée est préfixée « Simulé : ».
 *
 * Le visiteur choisit aussi le canal d'arrivée (WhatsApp, e-mail,
 * formulaire) : sur WhatsApp, l'assistant répond tout de suite, en
 * bulle ; ailleurs, il prépare un brouillon qu'un commercial valide.
 * WhatsApp n'est qu'un mot ici — ni logo, ni imitation de son interface.
 *
 * Les exemples sont fictifs et marqués comme tels : les entreprises
 * s'appellent toutes « Exemple », aucun ne contient de coordonnées.
 * Chacun sélectionne son canal.
 */

export type DemoExample = {
  id: string;
  channel: DemoChannel;
  /** Le libellé du bouton, après le nom du canal. */
  label: string;
  text: string;
};

export const demoContent = {
  /** L'ancre du CTA « Voir une démonstration » (lib/content/hero.ts). */
  anchor: 'demonstration',

  eyebrow: 'Démonstration en direct',

  title: {
    lead: 'Écrivez une demande.',
    voice: 'Regardez-la être traitée.',
  },

  intro:
    'Mettez-vous à la place d’un prospect qui écrit à votre entreprise. L’agent l’analyse comme il le ferait sur vos vraies demandes.',

  field: {
    label: 'La demande du prospect',
    placeholder: 'Bonjour, nous sommes une PME de…',
    /** Sans JavaScript, le champ le dit à la place de l'exemple. */
    noScript: 'La démonstration nécessite JavaScript.',
    min: 10,
    max: 600,
  },

  /** Sous le champ. */
  notice:
    'Simulation : rien n’est envoyé ni enregistré. N’indiquez pas de données personnelles réelles. Réponse générée par une IA.',

  /** Le sélecteur de canal, au-dessus du champ. */
  channelLegend: 'Canal de la demande',
  defaultChannel: DEFAULT_CHANNEL,

  examplesLabel: 'Exemples fictifs',

  examples: [
    {
      id: 'devis-urgent',
      channel: 'whatsapp',
      label: 'Devis urgent',
      text: 'Bonjour, Karim, responsable achats chez Transports Exemple (80 camions). On doit remplacer environ 120 pneus poids lourds avant fin novembre. Vous pouvez m’envoyer un tarif et vos délais ? Je suis dispo demain matin pour en parler.',
    },
    {
      id: 'appel-offres',
      channel: 'email',
      label: 'Appel d’offres',
      text: 'Bonjour, dans le cadre du renouvellement des 45 postes informatiques de nos trois sites, la Clinique Exemple lance une consultation. Le cahier des charges est joint. Date limite de réponse : 15 novembre. Pouvez-vous nous confirmer votre intérêt et nous indiquer un interlocuteur dédié ? Sophie Martin, service achats',
    },
    {
      id: 'relance',
      channel: 'formulaire',
      label: 'Relance client',
      text: 'Nous avons reçu votre devis D-2026-118 il y a 10 jours. Notre comité de direction valide le budget vendredi, mais il nous manque vos conditions de maintenance. Pouvez-vous nous les transmettre avant jeudi ? Julien, directeur des opérations, Atelier Exemple',
    },
    {
      id: 'demarchage',
      channel: 'whatsapp',
      label: 'Démarchage',
      text: 'Bonjour ! Nous aidons les entreprises comme la vôtre à doubler leur visibilité sur Google en 30 jours. Je peux vous présenter notre offre en 10 minutes cette semaine ?',
    },
  ] satisfies DemoExample[],

  submit: 'Traiter cette demande',
  submitting: 'Traitement en cours…',

  /** Les quatre étapes, dans l'ordre, et ce qu'elles montrent au repos. */
  steps: {
    reception: { label: 'Réception', idle: 'La demande, telle qu’elle arrive.' },
    analysis: { label: 'Analyse', idle: 'Type, entreprise, besoin, priorité.' },
    actions: { label: 'Actions', idle: 'Ce que l’agent déclencherait dans vos outils.' },
    result: { label: 'Résultat', idle: 'Une réponse immédiate ou un brouillon, selon le canal.' },
  },

  /** Les intitulés de la fiche. */
  fields: {
    type: 'Type',
    company: 'Entreprise',
    contact: 'Contact',
    need: 'Besoin',
    deadline: 'Échéance',
    priority: 'Priorité',
  },

  /** E-mail et formulaire : un brouillon, qu'un commercial valide. */
  draftLabel: 'Brouillon de réponse',
  draftNote: 'Brouillon — à valider par un commercial',

  /** WhatsApp : l'assistant répond tout de suite. */
  instantLabel: 'Réponse immédiate de l’assistant (simulée)',

  /** L'en-tête du message reçu, à l'étape Réception. */
  receivedVia: 'Reçu par',

  followUp: {
    question: 'Vous voulez ça sur vos vraies demandes ?',
    cta: { label: 'Demander un diagnostic', href: '/demarrer-un-projet' },
    retry: 'Essayer une autre demande',
  },

  errors: {
    tooShort: 'Écrivez au moins 10 caractères.',
    rateLimited: 'Trop d’essais d’un coup. Réessayez dans une minute.',
    unavailable: 'La démonstration est momentanément indisponible.',
  },
} as const;
