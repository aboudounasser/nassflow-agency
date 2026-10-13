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
  title: 'NASSFLOW AGENCY | Automatisation commerciale pour les PME B2B',
  description:
    'Automatisations et agents IA pour les PME B2B : demandes entrantes traitées, prospects qualifiés et suivi commercial fiabilisé, en reliant vos outils existants.',
  openGraph: {
    title: 'NASSFLOW AGENCY — Automatisation commerciale pour les PME B2B',
    description:
      'Nous concevons des automatisations et des agents IA qui traitent vos demandes entrantes, qualifient vos prospects et fiabilisent votre suivi commercial.',
    type: 'website',
  },
} as const;