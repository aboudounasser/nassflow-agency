export const homepageContent = {
  navigation: {
    brand: 'NASSFLOW AGENCY',

    signature: 'VOS OUTILS, RELIÉS',

    // Les ancres sont préfixées par « / » : depuis /demarrer-un-projet,
    // un simple « #problemes » pointerait sur la page courante, où la
    // section n'existe pas.
    links: [
      { label: 'Accueil', href: '/' },

      // Les ancres suivent les sections : lib/content/problems.ts et
      // lib/content/method.ts (#systems a disparu avec SystemsByProblem).
      { label: 'Problèmes', href: '/#problemes' },

      { label: 'Méthode', href: '/#methode' },

      { label: 'Intégrations', href: '/#outils' },

      { label: 'Solutions', href: '/#solutions' },

    ],

    cta: 'Démarrer un projet',
  },

  // Le titre de l'accueil vit dans lib/content/hero.ts, avec le reste du
  // Hero : l'image de partage et l'assistant le reprennent de là.

  layout: {
    tagline: 'VOS OUTILS, RELIÉS',

    title: 'NASSFLOW AGENCY',

    description:
      'NASSFLOW AGENCY conçoit des systèmes intelligents pour les entreprises : IA, assistants, automations, agents et intégrations.',
  },
} as const;
