export const homepageContent = {
  navigation: {
    brand: 'NASSFLOW AGENCY',

    signature: 'AI • AUTOMATION • WEB',

    // Les ancres sont préfixées par « / » : depuis /contact ou
    // /demarrer-un-projet, un simple « #approach » pointerait sur la page
    // courante, où la section n'existe pas.
    links: [
      { label: 'Accueil', href: '/' },

      { label: 'Système', href: '/#approach' },

      { label: 'Outils', href: '/#outils' },

      { label: 'Solutions', href: '/#systems' },

      { label: 'Contact', href: '/contact' },
    ],

    cta: 'Démarrer un projet',
  },

  layout: {
    tagline: 'AI • AUTOMATION • WEB',

    title: 'NASSFLOW AGENCY',

    description:
      'NASSFLOW AGENCY conçoit des systèmes intelligents pour les entreprises : IA, assistants, automations, agents et intégrations.',
  },
} as const;
