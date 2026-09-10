'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { transitions } from '@/lib/motion';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Inclinaison maximale en degrés. 0 = pas de rotation, seulement la lumière. */
  maxTilt?: number;
  /** Halo lumineux qui suit le curseur. */
  glow?: boolean;
  /** Intensité du halo, de 0 à 1. */
  glowOpacity?: number;
};

/**
 * Enveloppe 3D : le contenu s'incline légèrement vers le curseur et une
 * lumière douce le balaie. Deux variables CSS (`--tilt-px`, `--tilt-py`)
 * sont publiées sur la racine pour que les couches internes puissent
 * dériver en parallaxe via les classes `.parallax-*`.
 *
 * Neutralisé au clavier, sur écran tactile et si l'utilisateur a demandé
 * moins d'animations : dans ces cas, rien n'est écouté ni calculé.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  glow = true,
  glowOpacity = 0.5,
}: TiltCardProps) {
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

  // Position normalisée du curseur dans la carte, de -0.5 à 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lit = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]),
    transitions.cursor,
  );
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt]),
    transitions.cursor,
  );

  const glowX = useTransform(px, (v) => `${(v + 0.5) * 100}%`);
  const glowY = useTransform(py, (v) => `${(v + 0.5) * 100}%`);
  const glowBackground = useMotionTemplate`radial-gradient(38rem circle at ${glowX} ${glowY}, rgba(124,199,255,0.13), transparent 62%)`;
  const glowAlpha = useSpring(lit, transitions.quick);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!active || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
    lit.set(0);
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => active && lit.set(glowOpacity)}
      onPointerLeave={handlePointerLeave}
      className={`relative ${className}`}
      style={
        active
          ? {
              perspective: 1400,
              transformStyle: 'preserve-3d',
              rotateX,
              rotateY,
              // Consommées par .parallax-near / .parallax-far dans globals.css
              ['--tilt-px' as string]: px,
              ['--tilt-py' as string]: py,
            }
          : undefined
      }
    >
      {children}

      {glow && active && (
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background: glowBackground, opacity: glowAlpha }}
        />
      )}
    </m.div>
  );
}
