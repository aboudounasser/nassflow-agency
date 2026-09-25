'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlaying } from '@/lib/in-view';
import { motionTokens } from '@/lib/motion';

/**
 * Status (État) — une étiquette font-mono en capitales, précédée d'un
 * indicateur carré, qui passe par des états nommés : « en attente » →
 * « en cours » → « fait ».
 *
 * Le ton de chaque état règle l'indicateur :
 * - `idle`   : carré vide, gris — rien ne se passe encore ;
 * - `active` : carré vermillon qui pulse — la machine travaille ;
 * - `done`   : carré plein, à l'encre — c'est fait.
 *
 * Deux usages : piloté (`value`, l'index de l'état courant) ou autonome
 * (`autoplay`), qui avance d'un état toutes les `interval` ms tant que
 * l'étiquette est visible.
 *
 * `live` annonce chaque changement aux lecteurs d'écran
 * (`aria-live="polite"`). À réserver aux états qui portent une vraie
 * information : une boucle de démonstration annoncée serait du bruit.
 *
 * États de repli : sans JS ou avec « réduire les animations », le
 * dernier état, sans pulsation. Hors du viewport ou onglet en
 * arrière-plan, la séquence et la pulsation s'arrêtent.
 */

export type StatusState = {
  label: string;
  tone: 'idle' | 'active' | 'done';
};

export const defaultStatusStates: StatusState[] = [
  { label: 'En attente', tone: 'idle' },
  { label: 'En cours', tone: 'active' },
  { label: 'Fait', tone: 'done' },
];

const dots = {
  idle: 'border border-ink-muted',
  active: 'bg-accent',
  done: 'bg-ink',
} as const;

export function Status({
  states = defaultStatusStates,
  value,
  autoplay = false,
  interval = motionTokens.duration.slow * 3,
  loop = false,
  live = false,
  paused = false,
  className,
}: {
  states?: StatusState[];
  /** Index de l'état courant, en mode piloté. */
  value?: number;
  /** Avance seul d'un état à l'autre. */
  autoplay?: boolean;
  /** Temps passé dans chaque état, en ms (avec `autoplay`). */
  interval?: number;
  /** Repart du premier état après le dernier (avec `autoplay`). */
  loop?: boolean;
  live?: boolean;
  /** Suspend la séquence et la pulsation. */
  paused?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { enabled, playing: visible } = usePlaying(ref);
  const playing = visible && !paused;

  const last = states.length - 1;

  // Étape de la séquence autonome. Tant que le mouvement est coupé (rendu
  // serveur compris), on affiche le dernier état.
  const [step, setStep] = useState(0);
  const auto = autoplay && enabled ? Math.min(step, last) : last;

  useEffect(() => {
    if (!autoplay || !playing) return;
    if (auto >= last && !loop) return;

    const timer = window.setTimeout(
      () => setStep((index) => (index >= last ? 0 : index + 1)),
      auto >= last ? interval * 2 : interval,
    );

    return () => window.clearTimeout(timer);
  }, [autoplay, playing, auto, last, loop, interval]);

  const index = value ?? auto;
  const state = states[Math.min(Math.max(index, 0), last)];

  return (
    <StatusView
      ref={ref}
      state={state}
      live={live}
      playing={playing}
      className={className}
    />
  );
}

/**
 * Le rendu seul d'un état, sans observateur ni minuterie : pour un état
 * figé (rendu final, démonstration à l'arrêt), il évite d'abonner chaque
 * étiquette au viewport. `Status` s'en sert pour son propre rendu.
 */
export function StatusView({
  state,
  live = false,
  playing = false,
  className,
  ref,
}: {
  state: StatusState;
  live?: boolean;
  /** Autorise la pulsation de l'état « en cours ». */
  playing?: boolean;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      role={live ? 'status' : undefined}
      aria-live={live ? 'polite' : undefined}
      data-status={state.tone}
      data-playing={playing ? '' : undefined}
      className={[
        'inline-flex items-center gap-2.5 font-mono text-label font-normal uppercase text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        aria-hidden="true"
        data-status-dot
        className={['size-1.5 shrink-0', dots[state.tone]].join(' ')}
      />
      {state.label}
    </span>
  );
}
