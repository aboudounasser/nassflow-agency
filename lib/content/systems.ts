/**
 * Les quatre situations dans lesquelles un dirigeant se reconnaît.
 *
 * Règle d'écriture : `situation` est une phrase que le client pourrait
 * prononcer en rendez-vous — pas une catégorie de service. Aucun
 * chiffre de performance tant qu'on n'a pas de cas client réel pour
 * l'étayer.
 *
 * Ce qu'on installe pour chacune vit dans le catalogue
 * (`lib/content/solutions.ts`), pas ici.
 */

export type SystemOffer = {
  id: string;
  /** Le symptôme, dans les mots du dirigeant. */
  situation: string;
  /** Le nom court du symptôme, pour la navigation et les ancres. */
  shortLabel: string;
};

export const systemOffers: SystemOffer[] = [
  {
    id: 'devis',
    shortLabel: 'Devis',
    situation: 'Je passe mes soirées à faire des devis.',
  },
  {
    id: 'reponses',
    shortLabel: 'Réponses clients',
    situation: 'Je réponds aux mêmes questions dix fois par jour.',
  },
  {
    id: 'saisie',
    shortLabel: 'Double saisie',
    situation: 'Je ressaisis les mêmes infos dans trois outils.',
  },
  {
    id: 'visibilite',
    shortLabel: 'Visibilité',
    situation: 'Personne ne sait où on en est.',
  },
];
