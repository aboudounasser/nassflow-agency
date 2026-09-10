/**
 * Outils IA affichés dans le carrousel de la page d'accueil.
 *
 * Les noms sont composés dans la typographie du site plutôt que repris
 * sous forme de logos : les logos de ces marques sont déposés et leur
 * usage relève de chaque charte de marque.
 *
 * Pour passer à de vrais logos officiels : déposer le SVG récupéré dans
 * le press kit de l'outil sous `public/tools/<slug>.svg`, puis renseigner
 * `logo: '/tools/<slug>.svg'` ci-dessous. Le composant bascule tout seul
 * sur l'image et conserve l'alignement.
 */

export type AiTool = {
  name: string;
  /** Ce que l'outil apporte concrètement dans nos projets. */
  role: string;
  /** Chemin vers un SVG officiel dans /public, si tu en déposes un. */
  logo?: string;
};

export const aiTools: AiTool[] = [
  { name: 'ChatGPT', role: 'Rédaction & raisonnement' },
  { name: 'Claude', role: 'Analyse & code' },
  { name: 'Copilot', role: 'Développement assisté' },
  { name: 'Perplexity', role: 'Recherche sourcée' },
  { name: 'Midjourney', role: 'Direction artistique' },
  { name: 'Magnific', role: 'Upscaling & rendu' },
  { name: 'Notion', role: 'Base de connaissances' },
];
