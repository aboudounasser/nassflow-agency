import type { ReactNode } from 'react';
import { homepageContent } from '@/lib/content/homepage';
import { ogColors, ogDomain } from '@/lib/og';

/**
 * Le gabarit des images de partage (1200 × 630), commun à l'accueil
 * (app/og/route.tsx) et aux fiches solution (app/og/[slug]/route.tsx) :
 * la direction sombre du
 * site, et les trois halos du Hero en version fixe.
 *
 * Pensé pour l'aperçu le plus petit, WhatsApp (≈ 300 px de large, un
 * quart de la taille réelle) : un titre très gros, deux voix seulement,
 * et 72 px d'air sur les bords — rien n'y est collé.
 *
 *   SUR-TITRE (accent)
 *   Titre (encre, Archivo 800)
 *   Seconde voix (accent, Instrument Serif italique)
 *   ─────────────────────────────────
 *   NASSFLOW AGENCY                 nassflow.com
 */

/**
 * Les halos du Hero : mêmes couleurs, mêmes coins, immobiles.
 *
 * Dessinés en SVG et posés comme une image : satori, qui rend ces cartes,
 * découpe ses propres dégradés radiaux en rectangles (des bords nets
 * apparaissaient dans le fond), alors que le SVG est rendu par resvg,
 * qui les dessine fidèlement.
 */
const halos = [
  // [couleur, centre x, centre y, rayon]
  [ogColors.haloIndigo, 440, 0, 380],
  [ogColors.haloAmber, 110, 560, 410],
  [ogColors.haloAccent, 1100, 30, 450],
] as const;

const halosSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs>${halos
  .map(
    ([color], index) =>
      `<radialGradient id="h${index}"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
  )
  .join('')}</defs>${halos
  .map(([, x, y, r], index) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#h${index})"/>`)
  .join('')}</svg>`;

const halosSrc = `data:image/svg+xml;base64,${Buffer.from(halosSvg).toString('base64')}`;

function Halos() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rendu par satori, pas par le navigateur
    <img
      src={halosSrc}
      width={1200}
      height={630}
      alt=""
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
}

export function OgCard({
  eyebrow,
  title,
  voice,
  titleSize = 84,
  voiceSize = 80,
}: {
  eyebrow: string;
  title: ReactNode;
  voice: ReactNode;
  /** En px : le titre d'une fiche est plus long que celui du Hero. */
  titleSize?: number;
  voiceSize?: number;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: ogColors.paper,
        color: ogColors.ink,
        padding: '72px 80px 64px',
        fontFamily: 'Archivo',
        overflow: 'hidden',
      }}
    >
      <Halos />

      {/* Le texte occupe la hauteur libre, centré au-dessus du pied. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: ogColors.accent,
            lineHeight: 1,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: '-0.038em',
            lineHeight: 1,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: voiceSize,
            letterSpacing: '-0.02em',
            lineHeight: 1.04,
            color: ogColors.accent,
            maxWidth: 1040,
          }}
        >
          {voice}
        </div>
      </div>

      {/* Le pied : un filet, le nom, l'adresse. */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', height: 1, backgroundColor: ogColors.rule }} />

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            lineHeight: 1,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {homepageContent.navigation.brand}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: ogColors.inkMuted }}>
            {ogDomain}
          </div>
        </div>
      </div>
    </div>
  );
}
