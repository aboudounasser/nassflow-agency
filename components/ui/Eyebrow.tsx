import type { ReactNode } from 'react';

/**
 * Le sur-titre : 11px · 600 · 0.2em · majuscules. Vermillon au-dessus
 * d'un titre de section, gris (`tone="muted"`) quand il annonce une
 * liste ou un bloc secondaire, à l'encre (`tone="ink"`) dans les étapes
 * de formulaire.
 *
 * `as` ne change que la sémantique : un sur-titre qui introduit un bloc
 * sans titre propre peut être un `h2`.
 */

const tones = {
  accent: 'text-accent',
  muted: 'text-ink-muted',
  ink: 'text-ink',
} as const;

export function Eyebrow({
  as: Tag = 'span',
  tone = 'accent',
  className,
  children,
}: {
  as?: 'span' | 'p' | 'h2' | 'h3';
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={['block font-sans text-label uppercase', tones[tone], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
