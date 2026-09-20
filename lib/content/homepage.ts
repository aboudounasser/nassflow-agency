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

  /**
   * Le titre de l'accueil, en deux voix : la première en Archivo, la
   * seconde en Instrument Serif italique vermillon. Il vit ici et plus
   * dans le JSX du Hero parce que l'image de partage le reprend mot pour
   * mot — deux copies auraient fini par diverger.
   */
  hero: {
    lead: 'Vos outils méritent mieux que de travailler chacun dans leur coin.',

    accent: 'Ils méritent un système intelligent.',
  },

  layout: {
    tagline: 'VOS OUTILS, RELIÉS',

    title: 'NASSFLOW AGENCY',

    description:
      'NASSFLOW AGENCY conçoit des systèmes intelligents pour les entreprises : IA, assistants, automations, agents et intégrations.',
  },
} as const;
