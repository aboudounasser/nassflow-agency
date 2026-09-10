'use client';

import { m, useScroll, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { transitions } from '@/lib/motion';

/**
 * Fine barre de progression de lecture, collée sous l'en-tête.
 * Purement décorative : masquée aux lecteurs d'écran, et supprimée
 * quand l'utilisateur a demandé moins d'animations.
 */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, transitions.progress);

  if (reduced) return null;

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-[#7CC7FF] via-[#93A7FF] to-[#7CC7FF] shadow-[0_0_12px_rgba(124,199,255,0.55)]"
    />
  );
}
