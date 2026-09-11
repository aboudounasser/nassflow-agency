/**
 * Les deux rangées du carrousel d'intégrations.
 *
 * Règle : ne jamais lister un outil qu'on ne sait pas brancher. Une
 * intégration annoncée et non livrable se voit au premier rendez-vous
 * technique et coûte plus cher que les logos gagnés.
 *
 * `connected` ne contient que des connecteurs natifs de Make et de n8n,
 * donc réellement accessibles avec la stack ci-dessous. `built` liste
 * les plateformes sur lesquelles on construit effectivement.
 *
 * Pour passer à de vrais logos : les logos de ces marques sont déposés
 * et leur usage relève de chaque charte de marque. Déposer le SVG
 * récupéré dans le press kit sous `public/tools/<slug>.svg`, puis
 * renseigner `logo: '/tools/<slug>.svg'`. Le composant bascule seul sur
 * l'image et conserve l'alignement.
 */

export type Tool = {
  name: string;
  /** Ce que l'outil fait, du point de vue du dirigeant. */
  role: string;
  /** Chemin vers un SVG officiel dans /public, si tu en déposes un. */
  logo?: string;
};

/** Les outils que le client utilise déjà, et qu'on vient relier. */
export const connectedTools: Tool[] = [
  { name: 'Gmail', role: 'Messagerie' },
  { name: 'Outlook', role: 'Messagerie' },
  { name: 'WhatsApp', role: 'Messages clients' },
  { name: 'Google Sheets', role: 'Tableurs' },
  { name: 'Slack', role: 'Équipe' },
  { name: 'Notion', role: 'Documentation' },
  { name: 'Stripe', role: 'Paiements' },
  { name: 'Shopify', role: 'Boutique en ligne' },
  { name: 'Calendly', role: 'Rendez-vous' },
  { name: 'HubSpot', role: 'CRM' },
];

/** Les plateformes sur lesquelles on construit les systèmes. */
export const builtWith: Tool[] = [
  { name: 'Make', role: 'Automatisations' },
  { name: 'n8n', role: 'Automatisations sur mesure' },
  { name: 'Airtable', role: 'Base de données métier' },
  { name: 'Lovable', role: 'Interfaces rapides' },
  { name: 'Next.js', role: 'Sites et applications' },
  { name: 'Supabase', role: 'Base et authentification' },
];
