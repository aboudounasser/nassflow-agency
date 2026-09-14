export const homepageContent = {
  navigation: {
    brand: 'NASSFLOW AGENCY',

    signature: 'VOS OUTILS, RELIÉS',

    // Les ancres sont préfixées par « / » : depuis /demarrer-un-projet,
    // un simple « #systems » pointerait sur la page courante, où la
    // section n'existe pas.
    links: [
      { label: 'Accueil', href: '/' },

      // L'ancre #approach a disparu avec ProblemApproachSection. La
      // section qui pose le problème est désormais #systems, et le
      // libellé dit ce qu'on y voit plutôt qu'un nom de méthode.
      { label: 'Problèmes', href: '/#systems' },

      { label: 'Intégrations', href: '/#outils' },

      { label: 'Solutions', href: '/#solutions' },

    ],

    cta: 'Démarrer un projet',
  },

  layout: {
    tagline: 'VOS OUTILS, RELIÉS',

    title: 'NASSFLOW AGENCY',

    description:
      'NASSFLOW AGENCY conçoit des systèmes intelligents pour les entreprises : IA, assistants, automations, agents et intégrations.',
  },
} as const;
