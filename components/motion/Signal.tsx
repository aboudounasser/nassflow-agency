'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePlaying } from '@/lib/in-view';
import { motionTokens } from '@/lib/motion';

/**
 * Signal — un carré vermillon de 6 px, angles vifs, qui parcourt un
 * chemin SVG : une donnée qui passe d'un outil à l'autre. Vitesse
 * constante (courbe linéaire) : c'est un flux, pas un geste.
 *
 * Décoratif pour les lecteurs d'écran (`aria-hidden`) : le sens est
 * porté par le texte voisin, jamais par le carré.
 *
 * Le chemin est donné dans le repère du SVG, qui est affiché à sa taille
 * réelle (`width` × `height` en px) : le carré garde ainsi ses 6 px.
 *
 * États de repli :
 * - sans JS : le carré n'est pas rendu (masqué) ;
 * - « réduire les animations » : immobile au point d'arrivée ;
 * - hors du viewport ou onglet en arrière-plan : en pause, il reprend où
 *   il s'était arrêté.
 */

const SIDE = 6;

/** Pose le carré à `progress` (0 → 1) le long du chemin. */
function placeSquare(
  line: SVGPathElement | null,
  square: SVGRectElement | null,
  progress: number,
) {
  if (!line || !square) return;

  const point = line.getPointAtLength(line.getTotalLength() * progress);

  square.setAttribute(
    'transform',
    `translate(${point.x - SIDE / 2} ${point.y - SIDE / 2})`,
  );
  square.style.visibility = 'visible';
}

export function Signal({
  path,
  width,
  height,
  duration = motionTokens.duration.trace * 2,
  loop = false,
  pause = motionTokens.duration.slow * 2,
  showPath = true,
  className,
}: {
  /** L'attribut `d` du chemin, dans un repère de `width` × `height`. */
  path: string;
  width: number;
  height: number;
  /** Durée d'un parcours, en ms. */
  duration?: number;
  /** Recommence après chaque arrivée. */
  loop?: boolean;
  /** Attente à l'arrivée avant de repartir, en ms (avec `loop`). */
  pause?: number;
  /** Trace le chemin d'un filet `rule` sous le carré. */
  showPath?: boolean;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const squareRef = useRef<SVGRectElement>(null);

  const { enabled, playing } = usePlaying(svgRef);

  // Temps écoulé dans le cycle courant, conservé entre deux pauses.
  const elapsed = useRef(0);

  // Sans mouvement : immobile à l'arrivée. Placé avant la peinture.
  useLayoutEffect(() => {
    if (!enabled) placeSquare(pathRef.current, squareRef.current, 1);
  }, [enabled, path]);

  useEffect(() => {
    if (!playing) return;

    const line = pathRef.current;
    const square = squareRef.current;
    const cycle = loop ? duration + pause : duration;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;

      if (!loop && elapsed.current >= duration) {
        placeSquare(line, square, 1);
        return;
      }

      const t = elapsed.current % cycle;

      placeSquare(line, square, Math.min(t / duration, 1));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [playing, loop, duration, pause, path]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      className={className}
    >
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={showPath ? 'var(--rule)' : 'none'}
        strokeWidth={1}
        shapeRendering="crispEdges"
      />
      <rect
        ref={squareRef}
        width={SIDE}
        height={SIDE}
        fill="var(--accent)"
        shapeRendering="crispEdges"
        style={{ visibility: 'hidden' }}
      />
    </svg>
  );
}
