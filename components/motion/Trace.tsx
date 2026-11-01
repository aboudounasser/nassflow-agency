/**
 * Trace — un filet de 1 px qui se dessine de gauche à droite à son
 * entrée dans le viewport (durée `trace`, courbe standard).
 *
 * Il remplace un `border-top` : placé en tête d'un bloc, il occupe
 * exactement le même pixel. Couleur `rule` par défaut ; `tone="accent"`
 * pour un filet vermillon, qui dit alors que la machine a travaillé.
 *
 * Aucun JavaScript propre : l'observateur partagé (lib/motion-boot.ts)
 * pose `data-in-view`, la transition est en CSS (app/globals.css).
 * Sans JS ou avec « réduire les animations », le filet est déjà tracé.
 *
 * `axis="y"` le dessine de haut en bas (frise verticale) : la hauteur
 * vient alors du parent (positionnement absolu, `top`/`bottom`).
 *
 * Purement visuel : masqué aux lecteurs d'écran, comme la bordure qu'il
 * remplace.
 */
export function Trace({
  tone = 'rule',
  axis = 'x',
  order = 0,
  className,
}: {
  tone?: 'rule' | 'accent';
  /** Sens du tracé : `x` de gauche à droite, `y` de haut en bas. */
  axis?: 'x' | 'y';
  /** Rang dans une cascade : retarde le tracé de `order` × 60 ms. */
  order?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-reveal
      data-trace={axis === 'y' ? 'y' : ''}
      // L'observateur pose `data-in-view` avant l'hydratation.
      suppressHydrationWarning
      style={order ? ({ '--trace-order': order } as React.CSSProperties) : undefined}
      className={[
        axis === 'y' ? 'block w-px origin-top' : 'block h-px origin-left',
        tone === 'accent' ? 'bg-accent' : 'bg-rule',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
