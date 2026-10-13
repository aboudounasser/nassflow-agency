import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Rise — un bloc qui apparaît en fondu en glissant de 20 px vers le haut
 * à son entrée dans le viewport (durée `slow`, courbe standard).
 *
 * Comme Trace, aucun JavaScript propre : l'observateur partagé
 * (lib/motion-boot.ts) pose `data-in-view`, la transition est en CSS
 * (app/globals.css). Sans JS ou avec « réduire les animations », le bloc
 * est affiché d'emblée, à sa place.
 *
 * Seul `transform` bouge, jamais la mise en page : aucun décalage (CLS).
 * À ne pas poser sur ce qui est visible au premier rendu (le Hero, le h1
 * d'une page) : un élément masqué ne compte pas pour le LCP tant qu'il
 * n'est pas apparu.
 */
export function Rise({
  as: Tag = 'div',
  order = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** Rang dans une liste : retarde l'apparition de `order` × 60 ms. */
  order?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-reveal
      data-rise
      // L'observateur pose `data-in-view` avant l'hydratation.
      suppressHydrationWarning
      style={order ? ({ '--rise-order': order } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
