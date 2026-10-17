import type { ConnectedToolName } from '@/lib/content/tools';

/**
 * Le Hero de l'accueil : la seule source de ses textes. L'image de
 * partage (app/og/route.tsx) et la base de connaissances de
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
 *   l'humain garde la main, le résultat le dit ;
 * - les entreprises (« Exemple SARL », « Exemple SAS ») et les montants
 *   ne sont jamais réels : un montant reste « non communiqué ».
 *
 * Les trois scénarios couvrent le cycle commercial : une demande qui
 * entre, un devis qui attend, et une demande hors cible que l'agent
 * écarte — trier fait partie du travail.
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
    lead: 'Vos commerciaux vendent.',
    voice: 'Nos agents IA s’occupent du reste.',
  },

  intro:
    'NASSFLOW conçoit des automatisations et des agents IA qui traitent vos demandes entrantes, qualifient vos prospects et fiabilisent votre suivi commercial, en reliant les outils que vous utilisez déjà.',

  ctas: {
    primary: { label: 'Demander un diagnostic', href: '/demarrer-un-projet' },
    // La démonstration interactive, juste sous le Hero (components/sections/Demo.tsx).
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
      id: 'demande',
      tab: 'Demande entrante',
      message: {
        from: 'Julie M., Exemple SARL',
        channel: 'Formulaire du site',
        text: 'Bonjour, nous sommes une PME de 40 personnes, nous cherchons à automatiser nos devis. Pouvez-vous nous rappeler cette semaine ?',
      },
      extracted: [
        { label: 'Taille', value: '40 personnes' },
        { label: 'Besoin', value: 'Automatiser les devis' },
        { label: 'Urgence', value: 'Cette semaine' },
      ],
      actions: [
        { label: 'Fiche créée dans le CRM', tool: 'HubSpot' },
        { label: 'Prospect qualifié selon vos critères', tool: 'HubSpot' },
        { label: 'Créneaux proposés', tool: 'Calendly' },
      ],
      result: {
        title: 'Rendez-vous proposé',
        detail: 'Le commercial est prévenu sur Slack, avec la fiche du prospect.',
      },
    },
    {
      id: 'relance',
      tab: 'Relance',
      message: {
        from: 'Déclencheur',
        channel: 'HubSpot',
        text: 'Devis envoyé il y a 7 jours, aucune réponse.',
      },
      extracted: [
        { label: 'Prospect', value: 'Exemple SAS' },
        { label: 'Montant', value: 'Non communiqué' },
        { label: 'Dernier échange', value: 'Envoi du devis' },
      ],
      actions: [
        { label: 'Historique récupéré', tool: 'HubSpot' },
        { label: 'Relance personnalisée rédigée, en brouillon', tool: 'Gmail' },
        { label: 'Tâche créée pour le commercial', tool: 'HubSpot' },
      ],
      result: {
        title: 'Relance prête — à valider',
        detail: 'Rien ne part sans validation : le commercial relit, corrige si besoin, envoie.',
      },
    },
    {
      id: 'hors-cible',
      tab: 'Hors cible',
      message: {
        from: 'Thomas, étudiant',
        channel: 'Gmail',
        text: 'Bonjour, je suis étudiant et je cherche un stage.',
      },
      extracted: [
        { label: 'Objet', value: 'Recherche de stage' },
        { label: 'Nature', value: 'Demande non commerciale' },
      ],
      actions: [
        { label: 'Demande classée', tool: 'Gmail' },
        { label: 'Réponse type préparée, en brouillon', tool: 'Gmail' },
        { label: 'Aucune fiche créée dans le CRM', tool: 'HubSpot' },
      ],
      result: {
        title: 'Écartée du pipeline, avec la raison notée',
        detail: 'Un humain peut revenir dessus à tout moment.',
      },
    },
  ] satisfies HeroScenario[],
} as const;
