'use client';

import { m, useScroll, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { MotionProvider } from '@/components/motion/MotionProvider';

/**
 * Fine barre de progression de lecture, collée sous l'en-tête.
 * Purement décorative : masquée aux lecteurs d'écran, et supprimée
 * quand l'utilisateur a demandé moins d'animations.
 *
 * Un filet vermillon plein, sans dégradé ni halo : c'est le seul trait
 * de la page qui bouge, il n'a pas besoin de briller en plus.
 */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <MotionProvider>
      <m.div
        aria-hidden="true"
        style={{ scaleX }}
        className="pointer-events-none fixed inset-x-0 top-0 z-(--z-overlay) h-px origin-left bg-accent"
      />
    </MotionProvider>
  );
}
