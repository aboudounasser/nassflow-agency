import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { ogColors } from '@/lib/og';

/**
 * L'icône du site, commune à `app/icon.tsx` (onglet) et
 * `app/apple-icon.tsx` (écran d'accueil iOS) : un carré de papier, un
 * « N » en Archivo 800 à l'encre, et un petit carré vermillon en bas à
 * droite — le seul accent, comme sur les pages.
 *
 * Toutes les cotes sont proportionnelles au côté, pour que les deux
 * tailles restent la même image. Le « N » est légèrement remonté et
 * décalé vers la gauche : centré, son jambage droit touchait le carré.
 */
export async function renderBrandIcon(side: number) {
  const archivoExtraBold = await readFile(
    join(process.cwd(), 'assets', 'fonts', 'Archivo-ExtraBold.ttf'),
  );

  const mark = Math.round(side * 0.19);
  const inset = Math.round(side * 0.09);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: ogColors.paper,
        }}
      >
        <div
          style={{
            display: 'flex',
            marginTop: -side * 0.08,
            marginLeft: -side * 0.06,
            fontFamily: 'Archivo',
            fontWeight: 800,
            fontSize: side * 0.78,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: ogColors.ink,
          }}
        >
          N
        </div>

        <div
          style={{
            position: 'absolute',
            right: inset,
            bottom: inset,
            width: mark,
            height: mark,
            background: ogColors.accent,
          }}
        />
      </div>
    ),
    {
      width: side,
      height: side,
      fonts: [
        { name: 'Archivo', data: archivoExtraBold, style: 'normal', weight: 800 },
      ],
    },
  );
}
