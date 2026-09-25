'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Signal } from '@/components/motion/Signal';
import { Status, StatusView, type StatusState } from '@/components/motion/Status';
import { Typewriter } from '@/components/motion/Typewriter';
import { heroContent, type HeroScenario } from '@/lib/content/hero';
import { usePlaying } from '@/lib/in-view';
import {
  buildTimeline,
  phaseAt,
  SIGNAL_DURATION,
  TYPE_SPEED,
  type Timeline,
} from './timeline';

/**
 * HeroFlow — une demande réelle qui traverse le flux :
 * ENTREPRISE (message reçu) → AGENT (compréhension) → AUTOMATISATION
 * (actions dans les outils) → RÉSULTAT.
 *
 * Rendu serveur, sans JS, ou avec « réduire les animations » : l'état
 * FINAL du scénario affiché, lisible d'un bloc. Les onglets restent
 * utilisables (changement instantané).
 *
 * Avec le mouvement : chaque scénario se joue (9 à 12 s), puis le
 * suivant. Un clic sur un onglet lance ce scénario et suspend la
 * rotation. Le bouton Pause arrête tout ; la démonstration s'arrête
 * aussi hors du viewport et quand l'onglet du navigateur est caché.
 *
 * Aucune hauteur ne bouge : les trois scénarios occupent la même cellule
 * de grille (les inactifs sont invisibles), le bloc a donc toujours la
 * hauteur du plus long ; et ce qui n'est pas encore apparu est invisible
 * mais garde sa place.
 *
 * Accessibilité : onglets au motif tablist (flèches, Début, Fin, Entrée),
 * chaque scénario est une liste ordonnée de textes réels, connecteurs et
 * Signal sont masqués aux lecteurs d'écran. Une région aria-live
 * n'annonce que le résultat final de chaque scénario.
 */

const { scenarios, stations, demoLabel } = heroContent;

const timelines = scenarios.map((scenario) => buildTimeline(scenario));

const extractStates: StatusState[] = [
  { label: 'En cours', tone: 'active' },
  { label: 'Fait', tone: 'done' },
];

const actionStates: StatusState[] = [
  { label: 'En attente', tone: 'idle' },
  { label: 'En cours', tone: 'active' },
  { label: 'Fait', tone: 'done' },
];

type Marker = 'pending' | 'working' | 'done';

const markers: Record<Marker, string> = {
  pending: 'border border-ink-muted',
  working: 'bg-accent',
  done: 'bg-ink',
};

function announcement(scenario: HeroScenario) {
  return `${scenario.tab} : ${scenario.result.title}. ${scenario.result.detail}`;
}

/* ─────────────────────────────────────────────
   Une étape du flux
   ───────────────────────────────────────────── */

function Station({
  index,
  label,
  marker,
  signal,
  paused,
  measure,
  last = false,
  children,
}: {
  index: number;
  label: string;
  marker: Marker;
  /** Un Signal descend vers l'étape suivante (clé de remontage). */
  signal: string | null;
  paused: boolean;
  /** Mesure le connecteur (seulement quand le scénario se joue). */
  measure: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  const connector = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState(0);

  // Le Signal suit le connecteur : sa longueur est celle, mesurée, du
  // filet entre cette étape et la suivante.
  useEffect(() => {
    const el = connector.current;

    if (!el || !measure) return;

    const observer = new ResizeObserver(([entry]) =>
      setHeight(Math.round(entry.contentRect.height)),
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [measure]);

  return (
    <li className={['relative grid grid-cols-[1.5rem_1fr]', last ? '' : 'pb-7'].join(' ')}>
      <span aria-hidden="true" className="relative">
        <span
          className={[
            'absolute top-[0.3rem] left-0 size-1.5 transition-colors',
            markers[marker],
          ].join(' ')}
        />

        {!last && (
          <span
            ref={connector}
            className="absolute top-[1.1rem] bottom-0 left-[2.5px] w-px bg-rule"
          >
            {signal && height > 0 && (
              <Signal
                key={signal}
                path={`M3 0V${height}`}
                width={6}
                height={height}
                duration={SIGNAL_DURATION}
                showPath={false}
                paused={paused}
                className="absolute top-0 -left-[2.5px]"
              />
            )}
          </span>
        )}
      </span>

      <div className="min-w-0">
        <p className="font-mono text-label font-normal uppercase text-ink">
          <span className="text-ink-muted">{String(index).padStart(2, '0')}</span>{' '}
          {label}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────
   Un scénario, à l'instant t
   ───────────────────────────────────────────── */

function Scenario({
  scenario,
  timeline,
  t,
  animate,
  paused,
  run,
  onTyped,
}: {
  scenario: HeroScenario;
  timeline: Timeline;
  t: number;
  /** Ce scénario se joue (sinon : état final, sans primitive animée). */
  animate: boolean;
  paused: boolean;
  /** Identifiant du passage en cours, pour remonter les primitives. */
  run: string;
  onTyped: () => void;
}) {
  const { signals, extracted, actions, typeEnd, actionsShown, resultAt } = timeline;

  const signalAt = (index: number) =>
    animate && t >= signals[index][0] && t < signals[index][1]
      ? `${run}-${index}`
      : null;

  const agentStart = signals[0][1];
  const agentEnd = signals[1][0];
  const automationEnd = signals[2][0];

  const marker = (start: number, end: number): Marker =>
    t >= end ? 'done' : t >= start ? 'working' : 'pending';

  return (
    <ol className="max-w-[40rem]">
      <Station
        index={1}
        label={stations.message}
        marker={marker(0, typeEnd)}
        signal={signalAt(0)}
        paused={paused}
        measure={animate}
      >
        <p className="font-mono text-label font-normal uppercase text-ink-muted">
          {scenario.message.from} · {scenario.message.channel}
        </p>
        <p className="mt-2 text-small text-ink">
          {animate ? (
            <Typewriter
              key={run}
              text={scenario.message.text}
              speed={TYPE_SPEED}
              paused={paused}
              onDone={onTyped}
            />
          ) : (
            <span className="font-mono">{scenario.message.text}</span>
          )}
        </p>
      </Station>

      <Station
        index={2}
        label={stations.agent}
        marker={marker(agentStart, agentEnd)}
        signal={signalAt(1)}
        paused={paused}
        measure={animate}
      >
        <ul className="space-y-2">
          {scenario.extracted.map((item, index) => {
            const phase = phaseAt(t, extracted[index]);

            return (
              <li
                key={item.label}
                className={[
                  'grid grid-cols-[7rem_1fr] items-baseline gap-x-3',
                  phase === 'hidden' ? 'invisible' : '',
                ].join(' ')}
              >
                {animate ? (
                  <Status
                    states={extractStates}
                    value={phase === 'done' ? 1 : 0}
                    paused={paused}
                  />
                ) : (
                  <StatusView state={extractStates[phase === 'done' ? 1 : 0]} />
                )}
                <span className="text-small text-ink">
                  <span className="text-ink-muted">{item.label} :</span>{' '}
                  {item.value}
                </span>
              </li>
            );
          })}
        </ul>
      </Station>

      <Station
        index={3}
        label={stations.automation}
        marker={marker(actionsShown, automationEnd)}
        signal={signalAt(2)}
        paused={paused}
        measure={animate}
      >
        <ul className={['space-y-2', t >= actionsShown ? '' : 'invisible'].join(' ')}>
          {scenario.actions.map((action, index) => {
            const phase = phaseAt(t, actions[index], actionsShown);
            const value = phase === 'done' ? 2 : phase === 'active' ? 1 : 0;

            return (
              <li
                key={action.label}
                className="grid grid-cols-[7rem_1fr] items-baseline gap-x-3"
              >
                {animate ? (
                  <Status states={actionStates} value={value} paused={paused} />
                ) : (
                  <StatusView state={actionStates[value]} />
                )}
                <span className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
                  <span className="text-small text-ink">{action.label}</span>
                  <span className="font-mono text-label font-normal uppercase text-ink-muted">
                    {action.tool}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </Station>

      <Station
        index={4}
        label={stations.result}
        marker={t >= resultAt ? 'done' : 'pending'}
        signal={null}
        paused={paused}
        measure={false}
        last
      >
        <div className={t >= resultAt ? '' : 'invisible'}>
          <p className="font-heading text-body font-bold text-ink">
            {scenario.result.title}
          </p>
          <p className="mt-1 text-small text-ink-body">{scenario.result.detail}</p>
        </div>
      </Station>
    </ol>
  );
}

/* ─────────────────────────────────────────────
   La démonstration
   ───────────────────────────────────────────── */

export function HeroFlow() {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [t, setT] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState('');

  // Position exacte dans la chronologie, entre deux événements affichés :
  // c'est d'elle que repart la lecture après une pause.
  const position = useRef(0);

  const { enabled, playing } = usePlaying(root);

  // La démonstration ne démarre qu'au premier moment d'inactivité du
  // navigateur : jusque-là, l'hydratation rend exactement le HTML serveur
  // (état final), et le chargement de la page n'a rien de plus à faire.
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!enabled || started) return;

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setStarted(true), { timeout: 2000 });

    return () => cancel(id);
  }, [enabled, started]);

  const live = enabled && started;
  const running = live && playing && !paused;

  const timeline = timelines[active];

  // Sans mouvement (serveur, JS coupé, « réduire les animations »), ou
  // avant le démarrage : l'état final.
  const time = live ? t : timeline.end;

  const run = `${active}-${cycle}`;

  const start = useCallback((index: number) => {
    position.current = 0;
    setActive(index);
    setT(0);
    setCycle((value) => value + 1);
  }, []);

  // Le métronome : on ne réaffiche qu'aux instants où quelque chose
  // change. Saisie et Signal avancent d'eux-mêmes entre deux instants.
  useEffect(() => {
    if (!running) return;

    // Pendant la saisie, rien n'est minuté : on attend la fin réelle du
    // Typewriter (onTyped), qui ne tient pas un rythme d'horloge exact.
    if (t < timeline.typedAt) return;

    const next = timeline.events.find((event) => event > t);

    if (next === undefined) return;

    const from = Math.max(position.current, t);
    const began = performance.now();

    const timer = window.setTimeout(() => {
      position.current = next;

      if (next === timeline.resultAt) {
        setAnnounce(announcement(scenarios[active]));
      }

      if (next === timeline.end && auto) {
        start((active + 1) % scenarios.length);
        return;
      }

      setT(next);
    }, next - from);

    return () => {
      window.clearTimeout(timer);
      position.current = Math.min(next, from + performance.now() - began);
    };
  }, [running, t, timeline, active, auto, start]);

  const onTyped = useCallback(() => {
    setT((current) => {
      if (current >= timeline.typedAt) return current;

      position.current = timeline.typedAt;

      return timeline.typedAt;
    });
  }, [timeline]);

  function select(index: number) {
    setAuto(false);
    setStarted(true);
    start(index);

    // Sans mouvement, le scénario choisi est aussitôt complet : on
    // l'annonce tout de suite.
    if (!enabled) setAnnounce(announcement(scenarios[index]));
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const current = tabs.current.findIndex((tab) => tab === document.activeElement);

    if (current === -1) return;

    const last = scenarios.length - 1;
    const target =
      event.key === 'ArrowRight'
        ? current === last ? 0 : current + 1
        : event.key === 'ArrowLeft'
          ? current === 0 ? last : current - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;

    if (target === null) return;

    event.preventDefault();
    tabs.current[target]?.focus();
  }

  return (
    <div ref={root}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-label font-normal uppercase text-ink-muted">
          {demoLabel}
        </p>

        {/* Visible dès qu'il y a du mouvement (WCAG 2.2.2). Sans mouvement
            il n'a rien à arrêter : il garde sa place, invisible. */}
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className={[
            'inline-flex min-h-11 items-center border-b border-ink font-mono text-label font-normal uppercase text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink',
            enabled ? '' : 'invisible',
          ].join(' ')}
        >
          {paused ? 'Reprendre' : 'Mettre en pause'}
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Exemples de traitement"
        onKeyDown={onTabKey}
        className="mt-4 flex flex-wrap gap-x-6 border-b border-rule"
      >
        {scenarios.map((scenario, index) => {
          const selected = index === active;

          return (
            <button
              key={scenario.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`hero-tab-${scenario.id}`}
              aria-selected={selected}
              // Le panneau n'existe qu'une fois rendu (voir plus bas).
              aria-controls={
                selected || live ? `hero-panel-${scenario.id}` : undefined
              }
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              className={[
                '-mb-px min-h-11 border-b py-2 font-sans text-small font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                selected
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              ].join(' ')}
            >
              {scenario.tab}
            </button>
          );
        })}
      </div>

      {/* Les trois scénarios dans la même cellule : la hauteur est celle
          du plus long, quel que soit celui qui s'affiche. */}
      <div className="mt-8 grid">
        {scenarios.map((scenario, index) => {
          const selected = index === active;

          // Avant le démarrage (et sans mouvement), seul le scénario
          // affiché est rendu : les autres ne servent qu'à réserver la
          // hauteur pendant la rotation.
          if (!selected && !live) return null;

          return (
            <div
              key={scenario.id}
              role="tabpanel"
              id={`hero-panel-${scenario.id}`}
              aria-labelledby={`hero-tab-${scenario.id}`}
              className={['col-start-1 row-start-1', selected ? '' : 'invisible'].join(' ')}
            >
              <Scenario
                scenario={scenario}
                timeline={timelines[index]}
                t={selected ? time : timelines[index].end}
                animate={selected && live}
                paused={!running}
                run={run}
                onTyped={onTyped}
              />
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
