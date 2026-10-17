/**
 * La démonstration interactive de l'accueil : la seule source de ses
 * textes (components/sections/Demo.tsx, components/demo/).
 *
 * Le visiteur écrit comme un prospect ; l'agent (app/api/chat/demo)
 * analyse la demande et renvoie une fiche. Rien n'est envoyé ni
 * enregistré : chaque action affichée est préfixée « Simulé : ».
 *
 * Les exemples sont fictifs et marqués comme tels. Aucun n'est une
 * vraie entreprise, aucun ne contient de coordonnées.
 */

export type DemoExample = {
  id: string;
  /** Le libellé du bouton. */
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

  examplesLabel: 'Exemples',

  examples: [
    {
      id: 'devis',
      label: 'Demande de devis',
      text: 'Bonjour, nous sommes une société de 25 personnes dans la maintenance industrielle. Nous voudrions automatiser le suivi de nos devis. Pouvez-vous nous rappeler cette semaine ?',
    },
    {
      id: 'relance',
      label: 'Relance client',
      text: 'Bonjour, je reviens vers vous au sujet du devis que vous nous avez envoyé il y a trois semaines pour la refonte de notre suivi commercial. Nous n’avons pas eu de nouvelles depuis. Le devis est-il toujours valable ? Nous devons trancher avant la fin du mois. Claire, Exemple SAS',
    },
    {
      id: 'stage',
      label: 'Candidature de stage',
      text: 'Bonjour, je suis étudiant en école de commerce et je cherche un stage de six mois à partir de janvier. Je me permets de vous envoyer ma candidature. Merci d’avance pour votre retour. Thomas',
    },
  ] satisfies DemoExample[],

  submit: 'Traiter cette demande',
  submitting: 'Traitement en cours…',

  /** Les quatre étapes, dans l'ordre, et ce qu'elles montrent au repos. */
  steps: {
    reception: { label: 'Réception', idle: 'La demande, telle qu’elle arrive.' },
    analysis: { label: 'Analyse', idle: 'Type, entreprise, besoin, priorité.' },
    actions: { label: 'Actions', idle: 'Ce que l’agent déclencherait dans vos outils.' },
    result: { label: 'Résultat', idle: 'Un brouillon de réponse, à valider.' },
  },

  /** Les intitulés de la fiche. */
  fields: {
    type: 'Type',
    company: 'Entreprise',
    contact: 'Contact',
    need: 'Besoin',
    priority: 'Priorité',
  },

  draftLabel: 'Brouillon de réponse',
  draftNote: 'Brouillon — à valider par un commercial',

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
