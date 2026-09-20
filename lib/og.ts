import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Ce que les images de partage ont en commun : la palette, le format, et
 * les trois fontes.
 *
 * Les couleurs sont recopiées de `app/globals.css` plutôt que lues
 * depuis lui : `ImageResponse` ne résout aucune variable CSS, il lui
 * faut des valeurs littérales. Si la direction change, c'est le seul
 * autre endroit à corriger — d'où ce commentaire.
 */
export const ogColors = {
  paper: '#F2F0EB',
  ink: '#141414',
  inkMuted: '#6B6862',
  rule: '#D6D2C8',
  accent: '#C9321C',
} as const;

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
