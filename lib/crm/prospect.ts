import {
  completeStep,
  enterStage,
  postponeStep,
  projectPlan,
  skipStep,
  stepAt,
  type PlannedStep,
  type Position,
} from './cadence';
import { suggestFirstMessage } from './message';
import { scoreProspect, type Scoring } from './scoring';
import { STAGE_LABELS, type Activity, type Prospect, type ProspectInput, type Stage } from './types';

/**
 * Ce qui arrive à une fiche : création, modification, déplacement,
 * action faite, ignorée ou reportée. Tout est pur — une fiche et un
 * jour en entrée, une nouvelle fiche en sortie — pour que le serveur
 * et les tests appliquent exactement les mêmes règles.
 *
 * Toutes les écritures passent par `reconcile`, qui applique la règle
 * d'exclusion : sous 5, une fiche va en « Non pertinent » ; repassée à
 * 5 ou plus, elle en sort, si c'est le score qui l'y avait mise.
 */

/** On garde l'historique récent : il sert à relire, pas à auditer. */
const MAX_ACTIVITY = 60;

function log(prospect: Prospect, ...entries: Activity[]): Activity[] {
  return [...prospect.activity, ...entries].slice(-MAX_ACTIVITY);
}

function position(prospect: Prospect): Position {
  return { stage: prospect.stage, stepIndex: prospect.stepIndex, dueOn: prospect.dueOn };
}

export function createProspect(
  input: ProspectInput,
  { id, today, createdAt }: { id: string; today: string; createdAt: string },
): Prospect {
  const draft: Prospect = {
    ...input,
    id,
    createdAt,
    ...enterStage('nouveaux', today),
    excludedBy: null,
    activity: [{ kind: 'cree', on: today, label: `Fiche créée (${input.source})` }],
  };

  return reconcile(draft, today);
}

/**
 * Applique la règle d'exclusion au score actuel. Rend la même fiche,
 * à l'identique, si rien ne change.
 */
export function reconcile(prospect: Prospect, today: string): Prospect {
  const { score, relevant } = scoreProspect(prospect);

  if (!relevant && prospect.stage !== 'non_pertinent') {
    return {
      ...prospect,
      ...enterStage('non_pertinent', today),
      excludedBy: 'auto',
      activity: log(prospect, {
        kind: 'exclu',
        on: today,
        label: `Exclu automatiquement : score ${score}/10`,
        from: prospect.stage,
        to: 'non_pertinent',
      }),
    };
  }

  if (relevant && prospect.stage === 'non_pertinent' && prospect.excludedBy === 'auto') {
    return {
      ...prospect,
      ...enterStage('nouveaux', today),
      excludedBy: null,
      activity: log(prospect, {
        kind: 'reintegre',
        on: today,
        label: `Réintégré : score ${score}/10`,
        from: 'non_pertinent',
        to: 'nouveaux',
      }),
    };
  }

  return prospect;
}

export function updateProspect(prospect: Prospect, input: ProspectInput, today: string): Prospect {
  const before = scoreProspect(prospect).score;
  const after = scoreProspect(input).score;

  return reconcile(
    {
      ...prospect,
      ...input,
      // La provenance ne se réécrit pas : c'est un fait, pas une saisie.
      source: prospect.source,
      activity: log(prospect, {
        kind: 'modifie',
        on: today,
        label: before === after ? 'Fiche modifiée' : `Fiche modifiée : score ${before} → ${after}`,
      }),
    },
    today,
  );
}

export type MoveResult = { ok: true; prospect: Prospect } | { ok: false; error: string };

export function moveProspect(prospect: Prospect, to: Stage, today: string): MoveResult {
  if (to === prospect.stage) return { ok: true, prospect };

  const { score, relevant } = scoreProspect(prospect);

  if (to !== 'non_pertinent' && !relevant) {
    return {
      ok: false,
      error: `Score ${score}/10 : sous 5, la fiche reste en « Non pertinent ». Complétez-la (coordonnées, entreprise, besoin) pour la réintégrer.`,
    };
  }

  return {
    ok: true,
    prospect: {
      ...prospect,
      ...enterStage(to, today),
      excludedBy: to === 'non_pertinent' ? 'manual' : null,
      activity: log(prospect, {
        kind: 'deplace',
        on: today,
        label: `${STAGE_LABELS[prospect.stage]} → ${STAGE_LABELS[to]}`,
        from: prospect.stage,
        to,
      }),
    },
  };
}

export type StepAction = { type: 'fait' } | { type: 'ignore' } | { type: 'reporter'; days: number };

export function applyStepAction(prospect: Prospect, action: StepAction, today: string): Prospect {
  const current = position(prospect);
  const step = stepAt(prospect.stage, prospect.stepIndex);

  let next: Position;
  let entry: Activity;

  if (action.type === 'fait') {
    next = completeStep(current, today);
    entry = { kind: 'fait', on: today, label: step.label, stepId: step.id };
  } else if (action.type === 'ignore') {
    next = skipStep(current, today);
    entry = { kind: 'ignore', on: today, label: step.label, stepId: step.id };
  } else {
    next = postponeStep(current, action.days, today);
    entry = {
      kind: 'reporte',
      on: today,
      label: `${step.label} (+${action.days} j)`,
      stepId: step.id,
    };
  }

  const entries: Activity[] = [entry];

  if (next.stage !== prospect.stage) {
    entries.push({
      kind: 'deplace',
      on: today,
      label: `${STAGE_LABELS[prospect.stage]} → ${STAGE_LABELS[next.stage]}`,
      from: prospect.stage,
      to: next.stage,
    });
  }

  return { ...prospect, ...next, activity: log(prospect, ...entries) };
}

/** Ce que la carte affiche : la fiche, son score, son message, son plan. */
export type ProspectView = {
  prospect: Prospect;
  scoring: Scoring;
  firstMessage: string;
  plan: PlannedStep[];
};

export function viewProspect(prospect: Prospect, today: string): ProspectView {
  const scoring = scoreProspect(prospect);

  return {
    prospect,
    scoring,
    firstMessage: suggestFirstMessage(prospect, scoring),
    plan: projectPlan(position(prospect), today),
  };
}

/**
 * L'ordre dans une colonne : ce qui est dû d'abord (le plus en retard en
 * tête), puis le meilleur score.
 */
export function compareViews(a: ProspectView, b: ProspectView): number {
  if (a.prospect.dueOn !== b.prospect.dueOn) return a.prospect.dueOn < b.prospect.dueOn ? -1 : 1;

  return b.scoring.score - a.scoring.score;
}
