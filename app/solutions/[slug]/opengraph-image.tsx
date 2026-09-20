import { ImageResponse } from 'next/og';
import { homepageContent } from '@/lib/content/homepage';
import { solutions } from '@/lib/content/solutions';
import { loadOgFonts, ogColors, ogContentType, ogSize } from '@/lib/og';

/**
 * L'image de partage d'une fiche solution.
 *
 * Tout vient du catalogue : la catégorie, le titre, la phrase du
 * dirigeant. Ajouter une septième solution suffit à lui donner sa carte,
 * sans toucher à ce fichier.
 */
/**
 * Un `alt` générique : c'est une constante de module, elle ne peut pas
 * varier d'un slug à l'autre. Le titre de la solution, lui, est déjà
 * porté par `og:title`, que la page définit.
 */
export const alt = `${homepageContent.navigation.brand} — la solution en une carte`;

export const size = ogSize;

export const contentType = ogContentType;

/**
 * Les six slugs, pour que les images soient rendues au build et non à la
 * première requête : un robot de WhatsApp n'attend pas.
 */
export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

function find(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = find(slug);

  if (!solution) {
    // La route n'existe pas : `generateStaticParams` ne produit que les
    // six slugs du catalogue, mais mieux vaut une image que rien.
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ogColors.paper,
            color: ogColors.ink,
            fontFamily: 'Archivo',
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          {homepageContent.navigation.brand}
        </div>
      ),
      { ...size, fonts: await loadOgFonts() },
    );
  }

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: ogColors.accent,
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {solution.categoryLabel}
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: '-0.038em',
              lineHeight: 1.0,
              maxWidth: 1000,
            }}
          >
            {solution.title}
          </div>

          <div
            style={{
              marginTop: 34,
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 44,
              letterSpacing: '-0.015em',
              lineHeight: 1.18,
              color: ogColors.inkMuted,
              maxWidth: 950,
            }}
          >
            {`\u00AB\u202F${solution.problem}\u202F\u00BB`}
          </div>
        </div>

        {/* Le pied : un filet, puis la signature. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              height: 1,
              backgroundColor: ogColors.rule,
              marginBottom: 26,
            }}
          />

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {homepageContent.navigation.brand}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
