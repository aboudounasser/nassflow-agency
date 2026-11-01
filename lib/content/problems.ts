/**
 * La section des problèmes de l'accueil : la seule source de ses textes
 * (components/sections/Problems.tsx, lib/assistant/knowledge.ts).
 *
 * Chaque carte dit le problème, puis ce que fait l'agent : c'est ici que
 * le visiteur voit ce qu'on installe, depuis que les fiches solution ont
 * disparu.
 *
 * Règle d'écriture : chaque carte décrit ce qui se passe dans l'équipe
 * commerciale, dans des mots qu'un dirigeant reconnaît. Aucun chiffre
 * tant qu'on n'a pas de cas client réel pour l'étayer.
 */

export type Problem = {
  id: string;
  title: string;
  description: string;
  /** Ce que l'agent fait de ce problème, en une phrase. */
  agent: string;
};

export const problemsContent = {
  anchor: 'problemes',
  eyebrow: 'Ce qui vous coûte des ventes',
  title: {
    lead: 'Vos commerciaux sont bons.',
    voice: 'Vos processus les ralentissent.',
  },
  agentLabel: "Ce que fait l'agent",
  items: [
    {
      id: 'demandes',
      title: 'Des demandes restent sans réponse',
      description:
        "Une demande arrive le soir, sur WhatsApp ou par e-mail. Le temps que quelqu'un réponde, le prospect est allé voir ailleurs.",
      agent:
        'Il répond tout de suite, sur WhatsApp, par e-mail ou sur le site, et alerte le bon commercial.',
    },
    {
      id: 'relances',
      title: 'Des devis ne sont jamais relancés',
      description:
        "Un devis part, puis plus rien. Personne n'a relancé, et l'affaire s'éteint sans bruit.",
      agent:
        'Il repère les devis sans réponse et prépare la relance, que le commercial valide en un clic.',
    },
    {
      id: 'saisie',
      title: 'Vos équipes ressaisissent tout',
      description:
        'Les mêmes informations sont recopiées dans le CRM, les tableurs et les e-mails, au lieu de servir à vendre.',
      agent:
        'Il remplit le CRM à partir des e-mails et formulaires, sans copier-coller.',
    },
    {
      id: 'visibilite',
      title: 'Vous ne voyez pas où ça bloque',
      description:
        'Impossible de savoir à quelle étape les affaires se perdent, ni combien cela vous coûte.',
      agent: 'Il trace chaque demande, pour voir où les affaires ralentissent.',
    },
  ] satisfies Problem[],
} as const;
