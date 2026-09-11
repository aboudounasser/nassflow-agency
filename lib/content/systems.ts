/**
 * Les quatre situations dans lesquelles un dirigeant se reconnaît.
 *
 * Règle d'écriture : `situation` est une phrase que le client pourrait
 * prononcer en rendez-vous — pas une catégorie de service. `delivers`
 * décrit ce qu'on installe concrètement, jamais un nom de système.
 * Aucun chiffre de performance tant qu'on n'a pas de cas client réel
 * pour l'étayer.
 */

export type SystemOffer = {
  id: string;
  /** Le symptôme, dans les mots du dirigeant. */
  situation: string;
  /** Le nom court du symptôme, pour la navigation et les ancres. */
  shortLabel: string;
  /** Ce qu'on installe, en une phrase. */
  delivers: string;
  /** Trois éléments concrets du livrable. */
  includes: string[];
};

export const systemOffers: SystemOffer[] = [
  {
    id: 'demandes',
    shortLabel: 'Demandes entrantes',
    situation: 'Mon site ne me ramène rien.',
    delivers:
      'Un site qui transforme vos visiteurs en demandes qualifiées, au lieu de les laisser repartir.',
    includes: [
      'Un formulaire qui qualifie le besoin, le budget et le délai',
      'Une relance automatique si personne n’a répondu sous 24 heures',
      'Chaque demande arrive dans votre boîte et dans votre suivi',
    ],
  },
  {
    id: 'reponses',
    shortLabel: 'Réponses clients',
    situation: 'Je réponds aux mêmes questions dix fois par jour.',
    delivers:
      'Un assistant qui répond à votre place, avec vos mots et vos conditions.',
    includes: [
      'Une réponse en moins d’une minute, sur votre site et sur WhatsApp',
      'Il connaît vos tarifs, vos délais et ce que vous ne faites pas',
      'Il vous passe la main dès que la demande devient sérieuse',
    ],
  },
  {
    id: 'saisie',
    shortLabel: 'Double saisie',
    situation: 'Je ressaisis les mêmes infos dans trois outils.',
    delivers:
      'Vos outils se transmettent les informations entre eux, sans vous.',
    includes: [
      'Un devis accepté crée la fiche client et prépare la facture',
      'Plus d’écart entre deux logiciels qui racontent la même chose',
      'Ce qui se saisissait deux fois ne se saisit plus qu’une',
    ],
  },
  {
    id: 'visibilite',
    shortLabel: 'Visibilité',
    situation: 'Personne ne sait où on en est.',
    delivers:
      'Un tableau de bord unique, alimenté tout seul par vos outils existants.',
    includes: [
      'Les demandes en cours, leur état, et qui s’en occupe',
      'Alimenté par ce que vous utilisez déjà, sans ressaisie',
      'Consultable depuis votre téléphone, en déplacement',
    ],
  },
];
