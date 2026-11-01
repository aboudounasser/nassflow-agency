/**
 * La section des problèmes de l'accueil : la seule source de ses textes
 * (components/sections/Problems.tsx, lib/assistant/knowledge.ts).
 *
 * Règle d'écriture : chaque carte décrit ce qui se passe dans l'équipe
 * commerciale, dans des mots qu'un dirigeant reconnaît. Aucun chiffre
 * tant qu'on n'a pas de cas client réel pour l'étayer.
 */

export type Problem = {
  id: string;
  title: string;
  description: string;
};

export const problemsContent = {
  anchor: 'problemes',
  eyebrow: 'Ce qui vous coûte des ventes',
  title: {
    lead: 'Vos commerciaux sont bons.',
    voice: 'Vos processus les ralentissent.',
  },
  items: [
    {
      id: 'demandes',
      title: 'Des demandes restent sans réponse',
      description:
        "Une demande arrive le soir, sur WhatsApp ou par e-mail. Le temps que quelqu'un réponde, le prospect est allé voir ailleurs.",
    },
    {
      id: 'relances',
      title: 'Des devis ne sont jamais relancés',
      description:
        "Un devis part, puis plus rien. Personne n'a relancé, et l'affaire s'éteint sans bruit.",
    },
    {
      id: 'saisie',
      title: 'Vos équipes ressaisissent tout',
      description:
        'Les mêmes informations sont recopiées dans le CRM, les tableurs et les e-mails, au lieu de servir à vendre.',
    },
    {
      id: 'visibilite',
      title: 'Vous ne voyez pas où ça bloque',
      description:
        'Impossible de savoir à quelle étape les affaires se perdent, ni combien cela vous coûte.',
    },
  ] satisfies Problem[],
} as const;
