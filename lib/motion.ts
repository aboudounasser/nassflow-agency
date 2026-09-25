import type { Transition } from 'motion/react';

/* ─────────────────────────────────────────────
   Tokens de mouvement NASSFLOW — la seule source de vérité

   Le vermillon en mouvement signifie toujours « la machine
   travaille ». Aucun geste n'est décoratif : chaque animation
   représente un processus.

   Cette définition est lue deux fois :
   - en CSS, par `motionCssVariables`, injecté dans le <head> par
     `app/layout.tsx` : `--motion-duration-fast`, `--motion-ease-standard`…
     Tailwind s'y branche via `app/globals.css` (`ease-standard`, et les
     durées et courbes par défaut de `transition-*`) ;
   - en TypeScript, par les constantes ci-dessous (`duration`, `ease`,
     `transitions`) pour ce qui anime en JS.

   On ne change une valeur qu'ici.
   ───────────────────────────────────────────── */

export const motionTokens = {
  /** Durées, en millisecondes. */
  duration: {
    /** Retour immédiat : un état qui bascule. */
    instant: 120,
    /** Couleurs, soulignements, micro-interactions. */
    fast: 200,
    /** Ouvertures, messages, changements d'état. */
    base: 320,
    /** Ce qui doit se lire : une pulsation, un passage. */
    slow: 560,
    /** Un filet qui se trace. */
    trace: 900,
  },
  /** Courbes. */
  easing: {
    /** Départ franc, arrivée douce : tout ce qui entre ou change. */
    standard: [0.2, 0, 0, 1],
    /** Départ doux, sortie franche : tout ce qui s'en va. */
    exit: [0.4, 0, 1, 1],
    /** Vitesse constante : le Signal, qui représente un flux. */
    linear: 'linear',
  },
  /** Décalage entre deux éléments d'une cascade, en millisecondes. */
  stagger: 60,
} as const;

type Bezier = readonly [number, number, number, number];

function cssEasing(value: Bezier | 'linear') {
  return value === 'linear' ? 'linear' : `cubic-bezier(${value.join(', ')})`;
}

/** Les tokens en variables CSS, pour la balise <style> du layout. */
export const motionCssVariables = `:root{${[
  ...Object.entries(motionTokens.duration).map(
    ([name, ms]) => `--motion-duration-${name}:${ms}ms`,
  ),
  ...Object.entries(motionTokens.easing).map(
    ([name, value]) => `--motion-ease-${name}:${cssEasing(value)}`,
  ),
  `--motion-stagger:${motionTokens.stagger}ms`,
].join(';')}}`;

/* ─────────────────────────────────────────────
   Constantes TS, dérivées des mêmes tokens
   ───────────────────────────────────────────── */

export const duration = motionTokens.duration;

export const ease = motionTokens.easing;

/** Une durée en secondes, l'unité qu'attend Motion. */
export const seconds = (ms: number) => ms / 1000;

/** Les transitions Motion du site. */
export const transitions = {
  /** Ouvertures et messages : 320 ms, courbe standard. */
  base: {
    duration: seconds(duration.base),
    ease: ease.standard,
  },
  /** Ce qui disparaît : 200 ms, courbe de sortie. */
  exit: {
    duration: seconds(duration.fast),
    ease: ease.exit,
  },
} satisfies Record<string, Transition>;
