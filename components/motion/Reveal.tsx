'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import {
  revealSoftVariants,
  staggerVariants,
  staticVariants,
  transitions,
  viewport,
} from '@/lib/motion';

/**
 * Un seul préréglage subsiste. `default` animait un flou et `scale` un
 * agrandissement : la direction éditoriale ne veut ni l'un ni l'autre, et
 * plus aucun appel ne les demandait. Le type reste nommé pour que
 * l'ajout d'un second préréglage n'ait pas à refaire la plomberie.
 */
type Preset = 'soft';

const presets = {
  soft: revealSoftVariants,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** soft : glissement seul — le seul préréglage restant. */
  preset?: Preset;
  /** Retard en secondes, pour orchestrer plusieurs blocs voisins. */
  delay?: number;
  /** Anime dès le montage plutôt qu'à l'entrée dans le viewport (hero). */
  onMount?: boolean;
};

/**
 * Révèle son contenu quand il entre dans le viewport.
 * Les enfants restent rendus côté serveur : seul l'enveloppe est cliente,
 * le HTML complet part donc toujours aux moteurs de recherche.
 */
export function Reveal({
  children,
  className,
  preset = 'soft',
  delay = 0,
  onMount = false,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const variants = reduced ? staticVariants : presets[preset];

  return (
    <m.div
      data-motion-reveal
      className={className}
      variants={variants}
      initial="hidden"
      {...(onMount
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport })}
      transition={{ ...transitions.reveal, delay }}
    >
      {children}
    </m.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Intervalle entre deux enfants, en secondes. */
  gap?: number;
  delay?: number;
  onMount?: boolean;
};

/** Conteneur qui fait apparaître ses `StaggerItem` en cascade. */
export function Stagger({
  children,
  className,
  gap = 0.075,
  delay = 0,
  onMount = false,
}: StaggerProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <m.div
      data-motion-reveal
      className={className}
      variants={reduced ? staticVariants : staggerVariants(gap, delay)}
      initial="hidden"
      {...(onMount
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport })}
    >
      {children}
    </m.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  preset?: Preset;
};

export function StaggerItem({
  children,
  className,
  preset = 'soft',
}: StaggerItemProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <m.div
      data-motion-reveal
      className={className}
      variants={reduced ? staticVariants : presets[preset]}
      transition={transitions.reveal}
    >
      {children}
    </m.div>
  );
}
