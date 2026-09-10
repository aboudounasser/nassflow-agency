'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { transitions } from '@/lib/motion';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Déplacement maximal vers le curseur, en pixels. */
  strength?: number;
};

/**
 * Attire légèrement son contenu vers le curseur qui l'approche.
 * Réservé aux appels à l'action : au-delà de deux ou trois par page,
 * l'effet devient bruyant.
 */
export function Magnetic({
  children,
  className = 'inline-flex',
  strength = 6,
}: MagneticProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  const active = fine && !reduced;

  const x = useSpring(useMotionValue(0), transitions.cursor);
  const y = useSpring(useMotionValue(0), transitions.cursor);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!active || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.div
      ref={ref}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={active ? { x, y } : undefined}
    >
      {children}
    </m.div>
  );
}
