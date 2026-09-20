/**
 * L'URL de référence du site, et le seul endroit où elle est écrite :
 * la balise canonique, le sitemap et robots.txt la reprennent tous d'ici.
 *
 * Avec `www`, et non sans : le domaine nu répond 308 vers `www`. Publier
 * l'URL nue revenait à faire passer les robots par une redirection à
 * chaque page — et à leur désigner comme canonique une adresse qui
 * n'est pas celle qu'ils obtiennent.
 */
export const SITE_URL = 'https://www.nassflow.com';

export const seo = {
  metadataBase: SITE_URL,
  title: 'NASSFLOW AGENCY | Automatisation et IA pour les PME',
  description:
    'NASSFLOW AGENCY relie les outils des PME et automatise leurs tâches répétitives : assistants IA, agents et intégrations.',
  openGraph: {
    title: 'NASSFLOW AGENCY — Automatisation et IA pour les PME',
    description:
      'Nous relions vos logiciels entre eux et automatisons ce qui vous fait perdre du temps : assistants IA, agents et intégrations.',
    type: 'website',
  },
} as const;