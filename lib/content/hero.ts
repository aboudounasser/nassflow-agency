import type { ConnectedToolName } from '@/lib/content/tools';

/**
 * Le Hero de l'accueil : la seule source de ses textes. L'image de
 * partage (app/opengraph-image.tsx) et la base de connaissances de
 * l'assistant reprennent d'ici le sur-titre, le titre et le paragraphe,
 * mot pour mot.
 *
 * La cible : les dirigeants de PME B2B qui ont une équipe commerciale et
 * perdent des opportunités à cause de processus manuels mal organisés.
 *
 * Règles d'écriture de la démonstration :
 * - les scénarios sont des EXEMPLES : l'expéditeur est fictif, et rien ne
 *   dit combien de temps le traitement prend — ni horodatage, ni durée,
 *   ni chiffre de performance ;
 * - chaque action nomme l'outil où elle a lieu, et cet outil existe dans
 *   `connectedTools` (lib/content/tools.ts) : le type l'impose ;
 * - le résultat dit ce qui est fait, pas ce que ça rapporte. Quand
 *   l'humain garde la main, le résultat le dit.
 */

export type HeroScenario = {
  /** L'identifiant, pour les ancres et les clés. */
  id: string;
  /** Le libellé de l'onglet. */
  tab: string;
  /** ENTREPRISE — le message reçu. */
  message: {
    /** L'expéditeur, fictif. */
    from: string;
    /** Le canal par lequel le message arrive. */
    channel: string;
    text: string;
  };
  /** AGENT — ce que l'agent a compris : deux ou trois éléments. */
  extracted: { label: string; value: string }[];
  /** AUTOMATISATION — trois actions, chacune dans un outil connu. */
  actions: { label: string; tool: ConnectedToolName }[];
  /** RÉSULTAT — ce qui est fait, et un détail. */
  result: { title: string; detail: string };
};

export const heroContent = {
  /** Le sur-titre : la cible, en une ligne. */
  eyebrow: 'Automatisation IA pour les PME B2B',

  title: {
    lead: 'Vos opportunités ne devraient pas se perdre entre deux outils.',
    voice: 'On fait travailler vos outils ensemble.',
  },

  intro:
    'NASSFLOW conçoit des automatisations et des agents IA qui traitent vos demandes entrantes, qualifient vos prospects et fiabilisent votre suivi commercial, en reliant les outils que vous utilisez déjà.',

  ctas: {
    primary: { label: 'Demander un diagnostic', href: '/demarrer-un-projet' },
    // L'ancre de la démonstration, juste à côté (components/hero/HeroFlow.tsx).
    secondary: { label: 'Voir une démonstration', href: '#demonstration' },
  },

  /** Sous les CTA : ce qu'engage le premier échange. */
  ctaNote: 'Premier échange de 15 minutes pour comprendre votre processus. Sans engagement.',

  /** Le libellé au-dessus de la démonstration. */
  demoLabel: 'Exemple de traitement',

  /** Les quatre étapes du flux, dans l'ordre. */
  stations: {
    message: 'Entreprise',
    agent: 'Agent',
    automation: 'Automatisation',
    result: 'Résultat',
  },

  scenarios: [
    {
      id: 'boutique',
      tab: 'Boutique en ligne',
      message: {
        from: 'Léa, cliente',
        channel: 'WhatsApp',
        text: 'Bonjour, ce sérum convient-il aux peaux sensibles ? Et vous livrez en Belgique ?',
      },
      extracted: [
        { label: 'Produit', value: 'Sérum' },
        { label: 'Question', value: 'Peaux sensibles' },
        { label: 'Livraison', value: 'Belgique' },
      ],
      actions: [
        { label: 'Fiche produit consultée', tool: 'Shopify' },
        { label: 'Zones de livraison vérifiées', tool: 'Shopify' },
        { label: 'Réponse rédigée', tool: 'WhatsApp' },
      ],
      result: {
        title: 'Réponse envoyée',
        detail:
          '« Bonjour Léa, oui : ce sérum est formulé pour les peaux sensibles, et nous livrons en Belgique. »',
      },
    },
    {
      id: 'artisan',
      tab: 'Artisan',
      message: {
        from: 'M. Durand, particulier',
        channel: 'Gmail',
        text: 'Bonjour, je voudrais un devis pour poser 40 m² de parquet, c’est possible avant le 15 ?',
      },
      extracted: [
        { label: 'Prestation', value: 'Pose de parquet' },
        { label: 'Surface', value: '40 m²' },
        { label: 'Échéance', value: 'Avant le 15' },
      ],
      actions: [
        { label: 'Tarifs appliqués', tool: 'Google Sheets' },
        { label: 'Agenda vérifié', tool: 'Calendly' },
        { label: 'Devis pré-rempli en brouillon', tool: 'Gmail' },
      ],
      result: {
        title: 'Devis prêt — à valider',
        detail: 'Rien ne part sans vous : vous relisez, vous corrigez si besoin, vous envoyez.',
      },
    },
    {
      id: 'service',
      tab: 'Service',
      message: {
        from: 'Samir, client',
        channel: 'Outlook',
        text: 'Mon colis n’est pas arrivé et j’ai une réclamation, je veux parler à quelqu’un.',
      },
      extracted: [
        { label: 'Motif', value: 'Réclamation, colis non reçu' },
        { label: 'Demande', value: 'Parler à quelqu’un' },
      ],
      actions: [
        { label: 'Commande retrouvée', tool: 'Shopify' },
        { label: 'Historique du client joint', tool: 'HubSpot' },
        { label: 'Équipe prévenue', tool: 'Slack' },
      ],
      result: {
        title: 'Transmis à l’équipe, avec le contexte',
        detail:
          'L’agent passe la main : la personne qui reprend a la commande et l’historique sous les yeux.',
      },
    },
  ] satisfies HeroScenario[],
} as const;
