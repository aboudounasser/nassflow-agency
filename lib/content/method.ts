/**
 * La méthode en quatre étapes de l'accueil : la seule source de ses
 * textes (components/sections/Method.tsx, lib/assistant/knowledge.ts).
 *
 * Chaque étape promet une chose vérifiable : on note les indicateurs au
 * diagnostic, on les remesure à la fin. Aucun chiffre de résultat ici.
 */

export type MethodStep = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};

export const methodContent = {
  anchor: 'methode',
  eyebrow: 'Notre méthode',
  title: {
    lead: 'Une méthode. Quatre étapes.',
    voice: 'Des résultats que vous pouvez vérifier.',
  },
  steps: [
    {
      id: 'diagnostiquer',
      title: 'Diagnostiquer',
      summary: 'Nous partons de votre façon de travailler réelle.',
      points: [
        "Comprendre le parcours d'une demande, de l'arrivée à la signature",
        'Repérer où elle ralentit ou se perd',
        'Noter vos indicateurs de départ (délai de réponse, relances faites, temps de saisie)',
      ],
    },
    {
      id: 'concevoir',
      title: 'Concevoir',
      summary:
        'Nous proposons la solution la plus simple qui règle le vrai problème.',
      points: [
        'Ce qui sera automatisé, et ce qui reste humain',
        "Les outils reliés, sans en ajouter d'inutiles",
        'Le coût et le délai, écrits avant de commencer',
      ],
    },
    {
      id: 'deployer',
      title: 'Déployer',
      summary: 'Nous installons, testons sur vos vrais cas, et ajustons.',
      points: [
        'Branché sur vos outils actuels',
        'Vos équipes gardent la main sur les décisions sensibles',
        'Mise en route accompagnée',
      ],
    },
    {
      id: 'mesurer',
      title: 'Mesurer',
      summary: "Nous comparons l'avant et l'après sur vos indicateurs.",
      points: [
        "Mêmes indicateurs qu'au diagnostic",
        'Ce qui a changé, et ce qui reste à améliorer',
        'Ajustements si nécessaire',
      ],
    },
  ] satisfies MethodStep[],
  cta: { label: 'Demander un diagnostic', href: '/demarrer-un-projet' },
} as const;
