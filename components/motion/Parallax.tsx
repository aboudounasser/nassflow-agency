'use client';

import { useRef, type ReactNode } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Amplitude du décalage vertical en pixels sur toute la traversée du
   * viewport. Négatif = l'élément remonte plus vite que la page.
   */
  distance?: number;
};

/**
 * Décale son contenu à une vitesse différente de celle de la page.
 * Le calcul est branché sur la progression du scroll, pas sur un
 * écouteur d'événement : aucune lecture de layout par frame.
 */
export function Parallax({
  children,
  className,
  distance = -48,
}: ParallaxProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      <m.div style={reduced ? undefined : { y }}>{children}</m.div>
    </div>
  );
}
