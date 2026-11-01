export const homepageContent = {
  navigation: {
    brand: 'NASSFLOW AGENCY',

    signature: 'VOS OUTILS, RELIÉS',

    // Les ancres sont préfixées par « / » : depuis /demarrer-un-projet,
    // un simple « #problemes » pointerait sur la page courante, où la
    // section n'existe pas.
    // Dans l'ordre du brief : le problème d'abord, puis la preuve, puis
    // la méthode. Les ancres viennent des fichiers de contenu des
    // sections (problems.ts, demo.ts, method.ts).
    links: [
      { label: 'Problèmes', href: '/#problemes' },

      { label: 'Démonstration', href: '/#demonstration' },

      { label: 'Méthode', href: '/#methode' },
    ],

    cta: 'Demander un diagnostic',
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
