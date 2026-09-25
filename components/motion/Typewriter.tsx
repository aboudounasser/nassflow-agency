'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlaying } from '@/lib/in-view';

/**
 * Typewriter (Saisie) — un texte qui s'écrit caractère par caractère, en
 * font-mono, derrière un curseur carré vermillon : la machine rédige.
 *
 * Le texte complet est dans le DOM dès le rendu serveur :
 * - pour les lecteurs d'écran et les moteurs, une copie `sr-only`, lue
 *   d'un bloc ;
 * - à l'écran, le texte entier aussi ; pendant la saisie, la partie pas
 *   encore écrite est seulement rendue invisible (`visibility: hidden`),
 *   elle garde donc sa place et rien ne bouge autour.
 *
 * États de repli : sans JS ou avec « réduire les animations », le texte
 * est complet, sans curseur. Hors du viewport ou onglet en arrière-plan,
 * la saisie s'arrête et reprend où elle en était.
 */
export function Typewriter({
  text,
  speed = 45,
  as: Tag = 'span',
  keepCursor = false,
  paused = false,
  onDone,
  className,
}: {
  text: string;
  /** Délai entre deux caractères, en ms. */
  speed?: number;
  as?: 'span' | 'p';
  /** Garde le curseur, clignotant, une fois le texte écrit. */
  keepCursor?: boolean;
  /** Suspend la saisie (bouton Pause d'une démonstration). */
  paused?: boolean;
  /**
   * Appelé quand la saisie animée se termine. Une chronologie qui enchaîne
   * sur la saisie doit attendre ce signal plutôt que calculer
   * `longueur × speed` : chaque caractère coûte aussi un rendu.
   */
  onDone?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { enabled, playing: visible } = usePlaying(ref);
  const playing = visible && !paused;

  // Caractères déjà écrits. Tant que le mouvement est coupé (rendu
  // serveur compris), on affiche le texte complet.
  const [typed, setTyped] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (text !== prevText) {
    setPrevText(text);
    setTyped(0);
  }

  const count = enabled ? Math.min(typed, text.length) : text.length;

  useEffect(() => {
    if (!playing || count >= text.length) return;

    const timer = window.setTimeout(() => setTyped((c) => c + 1), speed);

    return () => window.clearTimeout(timer);
  }, [playing, count, text.length, speed]);

  useEffect(() => {
    if (enabled && typed >= text.length) onDone?.();
  }, [enabled, typed, text.length, onDone]);

  const typing = enabled && count < text.length;
  const showCursor = enabled && (typing || keepCursor);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement & HTMLSpanElement>}
      className={['font-mono', className].filter(Boolean).join(' ')}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {text.slice(0, count)}
        {showCursor && (
          // Largeur nulle : le curseur se pose sur le caractère suivant
          // sans rien pousser.
          <span className="relative inline-block w-0">
            <span
              data-cursor={typing ? 'typing' : 'idle'}
              className="absolute bottom-[0.12em] left-0 h-[0.95em] w-[0.6em] bg-accent"
            />
          </span>
        )}
        <span className="invisible">{text.slice(count)}</span>
      </span>
    </Tag>
  );
}
