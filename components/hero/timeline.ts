import type { HeroScenario } from '@/lib/content/hero';
import { motionTokens } from '@/lib/motion';

/**
 * La chronologie d'un scénario de démonstration, en millisecondes depuis
 * son début. Tout dérive des tokens de mouvement : aucune durée écrite
 * en dur ici ne représente une performance, ce sont des temps de lecture.
 *
 *   saisie du message → Signal → extraction, un élément après l'autre
 *   → Signal → trois actions en cascade → Signal → résultat → pause.
 *
 * Pour 9 à 12 s par scénario avec les textes actuels. La saisie n'est
 * pas minutée : `typeEnd` est une estimation, la démonstration attend la
 * fin réelle du Typewriter avant d'enchaîner.
 */

const { duration } = motionTokens;

/** Délai entre deux caractères du message saisi. */
export const TYPE_SPEED = 28;

/** Durée d'un passage du Signal entre deux étapes. */
export const SIGNAL_DURATION = duration.slow;

/** Temps passé par un élément extrait dans l'état « en cours ». */
const EXTRACT_STEP = duration.base + duration.fast;

/** Décalage entre deux actions, et temps de chacune « en cours ». */
const ACTION_STAGGER = duration.slow;
const ACTION_ACTIVE = duration.slow + duration.base;

/** Temps de lecture du résultat avant le scénario suivant. */
const RESULT_HOLD = duration.trace * 3;

export type Phase = 'hidden' | 'idle' | 'active' | 'done';

export type Timeline = {
  /** Fin (estimée) de la saisie : c'est là que reprend la chronologie. */
  typedAt: number;
  /** Fin du temps de lecture qui suit la saisie. */
  typeEnd: number;
  /** Les trois passages du Signal : [début, fin]. */
  signals: [number, number][];
  extracted: { start: number; done: number }[];
  actionsShown: number;
  actions: { start: number; done: number }[];
  resultAt: number;
  end: number;
  /** Tous les instants où l'affichage change, triés. */
  events: number[];
};

export function buildTimeline(scenario: HeroScenario): Timeline {
  const typedAt = scenario.message.text.length * TYPE_SPEED;
  const typeEnd = typedAt + duration.base;
  const signal1: [number, number] = [typeEnd, typeEnd + SIGNAL_DURATION];

  const extracted = scenario.extracted.map((_, index) => {
    const start = signal1[1] + index * EXTRACT_STEP;

    return { start, done: start + EXTRACT_STEP };
  });

  const agentEnd = extracted[extracted.length - 1].done + duration.fast;
  const signal2: [number, number] = [agentEnd, agentEnd + SIGNAL_DURATION];

  const actionsShown = signal2[1];
  const actions = scenario.actions.map((_, index) => {
    const start = actionsShown + duration.base + index * ACTION_STAGGER;

    return { start, done: start + ACTION_ACTIVE };
  });

  const automationEnd = actions[actions.length - 1].done + duration.fast;
  const signal3: [number, number] = [automationEnd, automationEnd + SIGNAL_DURATION];

  const resultAt = signal3[1];
  const end = resultAt + RESULT_HOLD;

  const events = [
    typeEnd,
    ...signal1,
    ...extracted.flatMap((step) => [step.start, step.done]),
    ...signal2,
    ...actions.flatMap((step) => [step.start, step.done]),
    ...signal3,
    resultAt,
    end,
  ];

  return {
    typedAt,
    typeEnd,
    signals: [signal1, signal2, signal3],
    extracted,
    actionsShown,
    actions,
    resultAt,
    end,
    events: [...new Set(events)].sort((a, b) => a - b),
  };
}

/** La phase d'une étape à l'instant `t`. */
export function phaseAt(
  t: number,
  step: { start: number; done: number },
  shownAt?: number,
): Phase {
  if (t >= step.done) return 'done';
  if (t >= step.start) return 'active';
  if (shownAt !== undefined && t >= shownAt) return 'idle';

  return 'hidden';
}
