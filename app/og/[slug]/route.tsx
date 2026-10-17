import { ImageResponse } from 'next/og';
import { solutions } from '@/lib/content/solutions';
import { loadOgFonts, ogContentType, ogSize } from '@/lib/og';
import { OgCard } from '@/lib/og-card';

/**
 * L'image de partage d'une fiche solution (`/og/<slug>`) : le gabarit de
 * l'accueil (lib/og-card.tsx), avec la catégorie en sur-titre, le titre
 * de la fiche à la place de celui du Hero, et la phrase du dirigeant en
 * seconde voix.
 *
 * Tout vient du catalogue : ajouter une septième solution suffit à lui
 * donner sa carte. Route explicite plutôt que `opengraph-image.tsx` :
 * voir app/og/route.tsx.
 */
export const dynamic = 'force-static';

/** Seuls les six slugs du catalogue existent ; le reste répond 404. */
export const dynamicParams = false;

/** Les six cartes sont rendues au build, pas à la première requête. */
export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) return new Response('Introuvable', { status: 404 });

  return new ImageResponse(
    (
      <OgCard
        eyebrow={solution.categoryLabel}
        title={solution.title}
        voice={`« ${solution.problem} »`}
        titleSize={72}
        voiceSize={50}
      />
    ),
    {
      ...ogSize,
      fonts: await loadOgFonts(),
      headers: { 'Content-Type': ogContentType },
    },
  );
}
