import type { Transition, Variants } from 'motion/react';

/* ─────────────────────────────────────────────
   Tokens de mouvement NASSFLOW
   Une seule source de vérité pour toutes les
   durées, courbes et variantes du site.
   ───────────────────────────────────────────── */

export const motionTokens = {
  duration: {
    fast: '180ms',
    normal: '240ms',
    slow: '500ms',
    reveal: '700ms',
  },
  easing: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  transitions: {
    button: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
    panel: '240ms cubic-bezier(0.16, 1, 0.3, 1)',
    reveal: '700ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

/** Courbe d'amortissement maison — départ franc, arrivée très douce. */
export const easeSignature = [0.16, 1, 0.3, 1] as const;

export const transitions = {
  reveal: {
    duration: 0.62,
    ease: easeSignature,
  },
  quick: {
    duration: 0.32,
    ease: easeSignature,
  },
  /** Ressort utilisé pour tout ce qui suit le curseur. */
  cursor: {
    type: 'spring',
    stiffness: 150,
    damping: 18,
    mass: 0.4,
  },
  /** Ressort de la barre de progression de lecture. */
  progress: {
    type: 'spring',
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  },
} satisfies Record<string, Transition>;

/**
 * Fenêtre de déclenchement des reveals : l'élément s'anime quand il
 * entre à 12 % du bas du viewport, jamais plus d'une fois.
 */
export const viewport = { once: true, margin: '0px 0px -12% 0px' } as const;

/* ─────────────────────────────────────────────
   Variantes
   ───────────────────────────────────────────── */

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export const revealSoftVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.965, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/** Conteneur qui cadence l'apparition de ses enfants. */
export function staggerVariants(stagger = 0.075, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Variantes neutres, servies quand l'utilisateur refuse les animations. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
};
