import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { heroContent } from '@/lib/content/hero';
import { homepageContent } from '@/lib/content/homepage';
import { SITE_URL } from '@/lib/seo';

/**
 * Ce que les images de partage et l'icône ont en commun : la palette, le
 * format, les fontes, et la version de l'image.
 *
 * Les couleurs sont recopiées de `app/globals.css` (direction sombre)
 * plutôt que lues depuis lui : `ImageResponse` ne résout aucune variable
 * CSS, il lui faut des valeurs littérales. Si la direction change, c'est
 * le seul autre endroit à corriger — d'où ce commentaire.
 *
 * Contrastes sur `paper` (WCAG) : ink 16,93:1, accent 6,39:1, inkMuted
 * 7,72:1. Mesurés sur la carte de l'accueil, au point le plus clair des
 * halos derrière chaque texte : accent 5,72:1, encre 14,29:1, gris
 * 7,72:1 — tous au-dessus de 4,5:1. Si les halos changent de place ou
 * d'intensité, remesurer.
 */
export const ogColors = {
  paper: '#0A0A0B',
  ink: '#EDEDEF',
  inkMuted: '#A1A1AA',
  rule: 'rgba(255, 255, 255, 0.12)',
  accent: '#FF5A3D',
  /** Les halos du Hero (`--halo-*`), en version fixe. */
  haloAccent: 'rgba(255, 90, 61, 0.2)',
  haloAmber: 'rgba(245, 158, 11, 0.12)',
  haloIndigo: 'rgba(67, 56, 202, 0.24)',
} as const;

/**
 * La version des images de partage. LinkedIn, WhatsApp et Facebook
 * gardent une image en cache sous son URL : changer l'image sans changer
 * l'URL ne change rien pour eux. À incrémenter à chaque refonte de
 * l'image ; les pages la posent dans `openGraph.images`.
 */
export const OG_VERSION = 2;

/** L'URL versionnée d'une image de partage (app/og/). */
export function ogImageUrl(path: string) {
  return `${path}?v=${OG_VERSION}`;
}

/**
 * La valeur de `openGraph.images` et `twitter.images` : l'image servie à
 * `path` (app/og/), versionnée, avec son format.
 */
export function ogImages(path: string, alt: string) {
  return [
    {
      url: ogImageUrl(path),
      width: ogSize.width,
      height: ogSize.height,
      type: ogContentType,
      alt,
    },
  ];
}

/** Le texte alternatif de l'image par défaut : le nom et le titre du Hero. */
export const defaultOgAlt = `${homepageContent.navigation.brand} — ${heroContent.title.lead} ${heroContent.title.voice}`;

/** Le domaine, tel qu'il s'écrit en bas de la carte : « nassflow.com ». */
export const ogDomain = new URL(SITE_URL).hostname.replace(/^www\./, '');

/** Le format attendu par WhatsApp, LinkedIn et les clients mail. */
export const ogSize = { width: 1200, height: 630 };

export const ogContentType = 'image/png';

/**
 * Les fontes, lues sur le disque du dépôt.
 *
 * En TTF et non en woff2, et en instances statiques et non en fonte
 * variable : satori, qui rend ces images, ne sait lire ni l'un ni
 * l'autre. Voir `assets/fonts/README.md`.
 */
export async function loadOgFonts() {
  const dir = join(process.cwd(), 'assets', 'fonts');

  const [archivoBold, archivoExtraBold, serifItalic] = await Promise.all([
    readFile(join(dir, 'Archivo-Bold.ttf')),
    readFile(join(dir, 'Archivo-ExtraBold.ttf')),
    readFile(join(dir, 'InstrumentSerif-Italic.ttf')),
  ]);

  return [
    { name: 'Archivo', data: archivoBold, style: 'normal' as const, weight: 700 as const },
    { name: 'Archivo', data: archivoExtraBold, style: 'normal' as const, weight: 800 as const },
    { name: 'Instrument Serif', data: serifItalic, style: 'italic' as const, weight: 400 as const },
  ];
}
