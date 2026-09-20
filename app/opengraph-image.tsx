import { ImageResponse } from 'next/og';
import { homepageContent } from '@/lib/content/homepage';
import { loadOgFonts, ogColors, ogContentType, ogSize } from '@/lib/og';

/**
 * L'image de partage par défaut : celle que WhatsApp, LinkedIn ou un
 * client mail affichent pour toute page qui n'a pas la sienne.
 *
 * Même direction que le site, aux mêmes contraintes : papier, encre, un
 * seul accent, des filets d'1px, et rien d'autre — ni dégradé, ni
 * ombre, ni arrondi. Une carte de partage est vue à la taille d'une
 * vignette : tout ce qui décore s'y perd, seul le contraste tient.
 */
export const alt = `${homepageContent.navigation.brand} — ${homepageContent.hero.lead} ${homepageContent.hero.accent}`;

export const size = ogSize;

export const contentType = ogContentType;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: ogColors.paper,
          color: ogColors.ink,
          padding: '72px 80px',
          fontFamily: 'Archivo',
        }}
      >
        {/* L'en-tête, comme la navigation du site : le nom, sa signature. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {homepageContent.navigation.brand}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: ogColors.inkMuted,
              lineHeight: 1,
            }}
          >
            {homepageContent.navigation.signature}
          </div>
        </div>

        {/* Le titre, dans ses deux voix. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              height: 1,
              backgroundColor: ogColors.rule,
              marginBottom: 44,
            }}
          />

          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: '-0.038em',
              lineHeight: 1.02,
              maxWidth: 1000,
            }}
          >
            {homepageContent.hero.lead}
          </div>

          <div
            style={{
              marginTop: 12,
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 66,
              letterSpacing: '-0.02em',
              lineHeight: 1.02,
              color: ogColors.accent,
            }}
          >
            {homepageContent.hero.accent}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
