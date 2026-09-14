/**
 * Le catalogue des solutions : six points de départ, pas six produits.
 *
 * Règle d'écriture : `title` annonce le RÉSULTAT pour le dirigeant, jamais
 * la technologie qui le produit — le mot « IA » n'y apparaît pas, il reste
 * dans `categoryLabel` et dans les descriptions techniques. `problem` est
 * une phrase que le client pourrait prononcer en rendez-vous. `delivers`
 * décrit ce qu'on installe, en une phrase, sans nom de système.
 *
 * Chaque solution est un point de départ qu'on adapte : les textes disent
 * « vos tarifs », « vos catégories », « vos créneaux », jamais un
 * fonctionnement figé. C'est ce que `questions` sert à révéler — ce sont
 * les questions qu'on poserait de toute façon au premier rendez-vous, et
 * elles sont spécifiques à la solution, pas un formulaire de contact
 * générique.
 *
 * Aucun chiffre de performance tant qu'on n'a pas de cas client réel pour
 * l'étayer, et aucune disponibilité présentée comme une garantie.
 *
 * Même règle pour les délais : pas de « sous 24 heures », « en 5 minutes »
 * ou équivalent tant qu'on n'a pas de cas client pour l'étayer — seule la
 * mécanique (« si personne n'a répondu », « dès que c'est confirmé ») est
 * décrite, jamais un chiffre de temps. C'est d'ailleurs un réglage qu'on
 * décide avec le client, pas une propriété de la solution.
 */

export type Question = {
  /** Clé stable : elle devient le nom du champ dans `answers` (jsonb). */
  id: string;
  /** La question, posée comme on la poserait de vive voix. */
  label: string;
  type: 'text' | 'textarea' | 'select';
  /** Requis si et seulement si `type` vaut 'select'. */
  options?: string[];
  required: boolean;
};

export type Solution = {
  /** Identifiant d'URL, unique dans le catalogue. */
  slug: string;
  category: 'agent' | 'automatisation';
  /** La catégorie telle qu'elle s'affiche, ex. 'Agent · Service client'. */
  categoryLabel: string;
  /** Le résultat obtenu, jamais la technologie. */
  title: string;
  /** La situation, dans les mots du dirigeant. */
  problem: string;
  /** Ce qu'on installe, en une phrase. */
  delivers: string;
  /** Exactement trois éléments concrets du livrable. */
  includes: string[];
  /** Deux à quatre questions propres à cette solution. */
  questions: Question[];
};

export const solutions: Solution[] = [
  {
    slug: 'reponse-clients',
    category: 'agent',
    categoryLabel: 'Agent · Service client',
    title: 'Répondez à vos clients sans les faire attendre',
    problem: 'Je réponds aux mêmes questions dix fois par jour.',
    delivers:
      'Un assistant qui répond à votre place, avec vos mots et vos conditions, et vous passe la main dès que c’est sérieux.',
    includes: [
      'Il répond sur votre site et sur WhatsApp',
      'Il connaît vos tarifs, vos délais et ce que vous ne faites pas',
      'Il vous transfère la conversation avec tout son historique',
    ],
    questions: [
      {
        id: 'volume_demandes',
        label: 'Combien de demandes recevez-vous par semaine ?',
        type: 'select',
        options: ['Moins de 20', 'De 20 à 100', 'Plus de 100'],
        required: true,
      },
      {
        id: 'canaux',
        label: 'Par quels canaux vos clients vous écrivent-ils aujourd’hui ?',
        type: 'text',
        required: true,
      },
      {
        id: 'questions_frequentes',
        label: 'Quelles sont les trois questions qui reviennent le plus ?',
        type: 'textarea',
        required: false,
      },
    ],
  },
  {
    slug: 'demandes-entrantes',
    category: 'agent',
    categoryLabel: 'Agent · Qualification',
    title: 'Ne perdez plus une demande entrante',
    problem:
      'Les demandes arrivent de partout et il y en a qui passent à la trappe.',
    delivers:
      'Chaque demande est captée, qualifiée et rangée au même endroit, avec une relance automatique si personne n’a répondu.',
    includes: [
      'Capture depuis le site, l’e-mail et le téléphone',
      'Qualification selon vos critères',
      'Relance automatique si personne n’a répondu',
    ],
    questions: [
      {
        id: 'origine_demandes',
        label: 'D’où viennent vos demandes aujourd’hui ?',
        type: 'text',
        required: true,
      },
      {
        id: 'criteres_qualification',
        label: 'Qu’est-ce qui fait qu’une demande vaut le coup pour vous ?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'qui_traite',
        label: 'Qui les traite aujourd’hui ?',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    slug: 'prise-de-rendez-vous',
    category: 'agent',
    categoryLabel: 'Agent · Rendez-vous',
    title: 'Votre agenda se remplit sans vous',
    problem: 'Je passe mes journées à caler des rendez-vous par téléphone.',
    delivers:
      'Un agent qui propose vos créneaux réels, confirme et rappelle, sans jamais créer de double réservation.',
    includes: [
      'Branché sur l’agenda que vous utilisez déjà',
      'Il ne propose que vos disponibilités réelles',
      'Confirmation et rappel envoyés automatiquement',
    ],
    questions: [
      {
        id: 'agenda',
        label: 'Quel agenda utilisez-vous ?',
        type: 'text',
        required: true,
      },
      {
        id: 'volume_rdv',
        label: 'Combien de rendez-vous prenez-vous par semaine ?',
        type: 'text',
        required: false,
      },
      {
        id: 'contraintes_creneau',
        label: 'Que doit-il savoir avant de proposer un créneau ?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    slug: 'devis',
    category: 'automatisation',
    categoryLabel: 'Automatisation · Devis',
    title: 'Vos devis se préparent tout seuls',
    problem: 'Je passe mes soirées à faire des devis.',
    delivers:
      'Le devis est pré-rempli à partir de la demande du client. Il ne vous reste qu’à valider.',
    includes: [
      'La demande est comprise, même écrite à la main',
      'Le devis est pré-rempli avec vos tarifs et vos conditions',
      'Vous validez ou corrigez, puis il part — sans ressaisie',
    ],
    questions: [
      {
        id: 'arrivee_demandes',
        label: 'Comment vous arrivent les demandes de devis ?',
        type: 'text',
        required: true,
      },
      {
        id: 'outil_actuel',
        label: 'Avec quoi les faites-vous aujourd’hui ?',
        type: 'text',
        required: true,
      },
      {
        id: 'temps_par_devis',
        label: 'Combien de temps vous prend un devis ?',
        type: 'text',
        required: false,
      },
      {
        id: 'variables_prix',
        label: 'Qu’est-ce qui fait changer le prix chez vous ?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    slug: 'emails',
    category: 'automatisation',
    categoryLabel: 'Automatisation · E-mails',
    title: 'Votre boîte mail triée et traitée chaque matin',
    problem: 'Je passe une heure par jour à trier des e-mails.',
    delivers:
      'Vos e-mails sont classés, les réponses courantes sont préparées, et seul ce qui mérite votre attention reste dans votre boîte.',
    includes: [
      'Le tri suit vos propres catégories',
      'Les réponses courantes arrivent en brouillon, prêtes à envoyer',
      'Les pièces jointes sont rangées au bon endroit',
    ],
    questions: [
      {
        id: 'messagerie',
        label: 'Quelle messagerie utilisez-vous ?',
        type: 'select',
        options: ['Gmail', 'Outlook', 'Autre'],
        required: true,
      },
      {
        id: 'volume_emails',
        label: 'Combien d’e-mails recevez-vous par jour ?',
        type: 'text',
        required: false,
      },
      {
        id: 'types_emails',
        label: 'Quels types d’e-mails reviennent le plus ?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    slug: 'outils-connectes',
    category: 'automatisation',
    categoryLabel: 'Automatisation · Intégration',
    title: 'Vos outils arrêtent de se contredire',
    problem: 'Je ressaisis les mêmes infos dans trois outils.',
    delivers:
      'Vos logiciels se transmettent les informations entre eux, sans vous.',
    includes: [
      'Un devis accepté crée la fiche client et prépare la facture',
      'Plus d’écart entre deux logiciels qui racontent la même chose',
      'Ce qui se saisissait deux fois ne se saisit plus qu’une',
    ],
    questions: [
      {
        id: 'outils',
        label: 'Quels outils utilisez-vous au quotidien ?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'info_ressaisie',
        label: 'Quelle information ressaisissez-vous le plus souvent ?',
        type: 'text',
        required: true,
      },
      {
        id: 'nombre_personnes',
        label: 'Combien de personnes font cette ressaisie ?',
        type: 'text',
        required: false,
      },
    ],
  },
];
