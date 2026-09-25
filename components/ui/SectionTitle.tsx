import type { ReactNode } from 'react';

/**
 * Le grand titre en deux voix : la première phrase en Archivo, la
 * seconde qui bascule dans la voix — Instrument Serif italique, un peu
 * agrandie parce que le serif porte plus petit à taille égale.
 *
 * - `size="title"` : le h2 de section (`text-title`).
 * - `size="display"` : le h1 de l'accueil (`text-display`), dont la
 *   seconde voix est légèrement plus grande et décollée d'1 unité.
 *
 * La seconde voix reste à l'encre par défaut ; `voiceTone="accent"` la
 * passe au vermillon, quand aucun autre élément voisin ne le porte déjà.
 */

const sizes = {
  title: {
    heading: 'text-title',
    voice: 'text-[1.06em]',
  },
  display: {
    heading: 'text-display',
    voice: 'mt-1 text-[1.07em]',
  },
} as const;

export function SectionTitle({
  as: Tag = 'h2',
  size = 'title',
  voiceTone = 'ink',
  lead,
  voice,
  className,
}: {
  as?: 'h1' | 'h2';
  size?: keyof typeof sizes;
  voiceTone?: 'ink' | 'accent';
  lead: ReactNode;
  voice: ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={['font-heading text-ink', sizes[size].heading, className]
        .filter(Boolean)
        .join(' ')}
    >
      {lead}
      <span
        className={[
          'block font-serif font-normal italic tracking-[-0.02em]',
          sizes[size].voice,
          voiceTone === 'accent' ? 'text-accent' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {voice}
      </span>
    </Tag>
  );
}
