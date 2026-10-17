import { ImageResponse } from 'next/og';
import { heroContent } from '@/lib/content/hero';
import { loadOgFonts, ogContentType, ogSize } from '@/lib/og';
import { OgCard } from '@/lib/og-card';

/**
 * L'image de partage par défaut (`/og`) : celle que WhatsApp, LinkedIn ou
 * un client mail affichent pour toute page qui n'a pas la sienne. Les
 * textes sont ceux du Hero, lus à leur source (lib/content/hero.ts) ; le
 * dessin est le gabarit commun (lib/og-card.tsx).
 *
 * Une route explicite plutôt que la convention `opengraph-image.tsx` :
 * celle-ci injecte d'office sa propre URL dans `og:image` et l'emporte
 * sur les métadonnées de la page, ce qui empêchait d'y mettre le numéro
 * de version (lib/og.ts, `OG_VERSION`) qui force les plateformes à
 * recharger l'image. Les pages la déclarent elles-mêmes (`ogImages`).
 *
 * Rendue une fois, au build : un robot de WhatsApp n'attend pas.
 */
export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={heroContent.eyebrow}
        title={heroContent.title.lead}
        voice={heroContent.title.voice}
      />
    ),
    {
      ...ogSize,
      fonts: await loadOgFonts(),
      headers: { 'Content-Type': ogContentType },
    },
  );
}
