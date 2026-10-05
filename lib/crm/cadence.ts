import { addDays, daysBetween, maxDay } from './dates';
import type { Stage } from './types';

/**
 * Les actions recommandées, étape par étape, et leurs dates.
 *
 * Chaque colonne a sa séquence d'actions. Une fiche est toujours sur une
 * action et une seule, avec une échéance (`dueOn`). Les dates ne sont
 * pas fixées à l'avance : elles découlent de ce qu'on a fait.
 *
 * - FAIT : l'action suivante tombe `delay` jours après le jour où on l'a
 *   faite. Le prospect a besoin de temps pour répondre.
 * - IGNORÉ : l'action suivante tombe `delayAfterSkip` jours après — plus
 *   tôt, puisque le prospect n'a rien reçu de nous entre-temps. Une
 *   action `retry` (le premier message) ne s'ignore pas : elle revient.
 * - REPORTÉ : la même action, quelques jours plus tard.
 * - EN RETARD (rien fait) : tant que l'échéance est passée, tout le plan
 *   qui suit glisse avec aujourd'hui (voir `projectPlan`), et la fiche
 *   remonte en tête de colonne.
 *
 * Changer de colonne relance la séquence de la nouvelle colonne, à
 * partir du jour du déplacement. Au bout d'une séquence, une action
 * d'entretien (`after`) se répète.
 */

export type Channel = 'email' | 'telephone' | 'linkedin' | 'rendez-vous' | 'interne';

export type Step = {
  id: string;
  label: string;
  /** Ce qu'il faut faire concrètement, en une phrase. */
  hint: string;
  channel: Channel;
  /** Jours après l'action précédente faite (ou après l'entrée dans la colonne). */
  delay: number;
  /** Jours après l'action précédente ignorée. */
  delayAfterSkip: number;
  /** Ignorer ne fait pas avancer : l'action revient `delayAfterSkip` jours plus tard. */
  retry?: boolean;
  /** Faite, l'action fait passer la fiche dans cette colonne. */
  advanceTo?: Stage;
};

type Sequence = { steps: Step[]; after: Step };

export const CADENCE: Record<Stage, Sequence> = {
  nouveaux: {
    steps: [
      {
        id: 'premier-message',
        label: 'Envoyer le premier message',
        hint: 'Relire la suggestion, la personnaliser d’une phrase, l’envoyer par e-mail (ou LinkedIn à défaut).',
        channel: 'email',
        delay: 0,
        delayAfterSkip: 1,
        retry: true,
        advanceTo: 'contactes',
      },
    ],
    after: {
      id: 'premier-message',
      label: 'Envoyer le premier message',
      hint: 'Le premier contact n’est toujours pas parti.',
      channel: 'email',
      delay: 0,
      delayAfterSkip: 1,
      retry: true,
      advanceTo: 'contactes',
    },
  },
  contactes: {
    steps: [
      {
        id: 'relance-1',
        label: 'Relance 1 : un cas d’usage concret',
        hint: 'Répondre dans le même fil avec un exemple d’agent adapté à son besoin.',
        channel: 'email',
        delay: 3,
        delayAfterSkip: 1,
      },
      {
        id: 'appel',
        label: 'Appeler',
        hint: 'Appel court : « Je vous ai écrit à propos de… avez-vous eu le temps de lire ? »',
        channel: 'telephone',
        delay: 3,
        delayAfterSkip: 1,
      },
      {
        id: 'linkedin',
        label: 'Message LinkedIn',
        hint: 'Demande de connexion avec une note de deux lignes, sans pièce jointe.',
        channel: 'linkedin',
        delay: 3,
        delayAfterSkip: 1,
      },
      {
        id: 'dernier-message',
        label: 'Dernier message (on clôt poliment)',
        hint: '« Je ne veux pas vous encombrer : dois-je classer le sujet ? » — c’est souvent celui qui obtient la réponse.',
        channel: 'email',
        delay: 5,
        delayAfterSkip: 2,
      },
    ],
    after: {
      id: 'reactivation',
      label: 'Réactiver le contact',
      hint: 'Un nouvel angle : une actualité de son secteur, une nouvelle réalisation.',
      channel: 'email',
      delay: 30,
      delayAfterSkip: 14,
    },
  },
  interesses: {
    steps: [
      {
        id: 'proposer-decouverte',
        label: 'Proposer un appel de découverte',
        hint: 'Envoyer le lien d’agenda (30 min) et deux créneaux précis.',
        channel: 'email',
        delay: 0,
        delayAfterSkip: 1,
      },
      {
        id: 'envoyer-exemple',
        label: 'Envoyer un exemple d’agent',
        hint: 'Une courte vidéo ou une capture d’un agent proche de son besoin.',
        channel: 'email',
        delay: 2,
        delayAfterSkip: 1,
      },
      {
        id: 'relance-rdv',
        label: 'Relancer pour fixer le rendez-vous',
        hint: 'Appel ou message : proposer directement un créneau.',
        channel: 'telephone',
        delay: 3,
        delayAfterSkip: 1,
      },
    ],
    after: {
      id: 'entretenir',
      label: 'Entretenir l’intérêt',
      hint: 'Un contenu utile, sans relance commerciale.',
      channel: 'email',
      delay: 14,
      delayAfterSkip: 7,
    },
  },
  qualifies: {
    steps: [
      {
        id: 'proposition',
        label: 'Envoyer la proposition',
        hint: 'Périmètre de l’agent, intégrations, prix, planning — et la prochaine étape datée.',
        channel: 'email',
        delay: 2,
        delayAfterSkip: 1,
      },
      {
        id: 'relance-proposition',
        label: 'Relancer la proposition',
        hint: 'Demander ce qui manque pour décider, plutôt que « avez-vous lu ? ».',
        channel: 'email',
        delay: 3,
        delayAfterSkip: 1,
      },
      {
        id: 'appel-decision',
        label: 'Appel de décision',
        hint: 'Lever les objections, caler la date de démarrage.',
        channel: 'telephone',
        delay: 3,
        delayAfterSkip: 1,
      },
    ],
    after: {
      id: 'relancer-decision',
      label: 'Relancer la décision',
      hint: 'Proposer une version réduite ou un pilote si le budget bloque.',
      channel: 'telephone',
      delay: 7,
      delayAfterSkip: 3,
    },
  },
  conclus: {
    steps: [
      {
        id: 'lancement',
        label: 'Planifier le lancement',
        hint: 'Réunion de démarrage, liste des accès et des contenus à fournir.',
        channel: 'rendez-vous',
        delay: 1,
        delayAfterSkip: 1,
      },
      {
        id: 'point-satisfaction',
        label: 'Point de satisfaction',
        hint: 'Ce qui marche, ce qui coince, ce que l’agent devrait apprendre.',
        channel: 'telephone',
        delay: 14,
        delayAfterSkip: 3,
      },
      {
        id: 'deuxieme-agent',
        label: 'Proposer une deuxième automatisation',
        hint: 'Partir de ce que le premier agent a révélé.',
        channel: 'email',
        delay: 30,
        delayAfterSkip: 14,
      },
    ],
    after: {
      id: 'point-trimestriel',
      label: 'Point trimestriel',
      hint: 'Faire le bilan, demander une recommandation.',
      channel: 'telephone',
      delay: 90,
      delayAfterSkip: 30,
    },
  },
  non_pertinent: {
    steps: [],
    after: {
      id: 'requalifier',
      label: 'Requalifier la fiche',
      hint: 'Chercher un e-mail ou un téléphone valide, l’entreprise, un besoin nouveau — puis modifier la fiche.',
      channel: 'interne',
      delay: 90,
      delayAfterSkip: 90,
    },
  },
};

export function stepAt(stage: Stage, index: number): Step {
  const { steps, after } = CADENCE[stage];

  return steps[index] ?? after;
}

/** L'index qui suit, sans dépasser celui de l'action d'entretien. */
function nextIndex(stage: Stage, index: number): number {
  return Math.min(index + 1, CADENCE[stage].steps.length);
}

export type Position = { stage: Stage; stepIndex: number; dueOn: string };

/** Entrer dans une colonne : la première action, `delay` jours plus tard. */
export function enterStage(stage: Stage, on: string): Position {
  return { stage, stepIndex: 0, dueOn: addDays(on, stepAt(stage, 0).delay) };
}

/** L'action en cours est faite le jour `on`. */
export function completeStep(position: Position, on: string): Position {
  const step = stepAt(position.stage, position.stepIndex);

  if (step.advanceTo) return enterStage(step.advanceTo, on);

  const index = nextIndex(position.stage, position.stepIndex);

  return { stage: position.stage, stepIndex: index, dueOn: addDays(on, stepAt(position.stage, index).delay) };
}

/** L'action en cours est ignorée le jour `on`. */
export function skipStep(position: Position, on: string): Position {
  const step = stepAt(position.stage, position.stepIndex);

  if (step.retry) return { ...position, dueOn: addDays(on, step.delayAfterSkip) };

  const index = nextIndex(position.stage, position.stepIndex);

  return {
    stage: position.stage,
    stepIndex: index,
    dueOn: addDays(on, stepAt(position.stage, index).delayAfterSkip),
  };
}

/** L'action en cours est repoussée de `days` jours, à partir d'aujourd'hui s'il est en retard. */
export function postponeStep(position: Position, days: number, today: string): Position {
  return { ...position, dueOn: addDays(maxDay(position.dueOn, today), days) };
}

export type PlannedStep = Step & {
  /** La colonne de l'action : le plan peut en franchir une (premier message → Contactés). */
  stage: Stage;
  dueOn: string;
  /** Jours de retard, 0 si l'action n'est pas échue. */
  overdueBy: number;
};

/**
 * L'action en cours et les suivantes, datées comme si chacune était
 * faite le jour prévu. Une action en retard est supposée faite
 * aujourd'hui : c'est ce qui fait glisser tout le plan tant qu'on ne
 * fait rien.
 */
export function projectPlan(position: Position, today: string, count = 3): PlannedStep[] {
  const plan: PlannedStep[] = [];
  let current = position;

  for (let i = 0; i < count; i++) {
    const first = i === 0;

    plan.push({
      ...stepAt(current.stage, current.stepIndex),
      stage: current.stage,
      dueOn: current.dueOn,
      overdueBy: first ? Math.max(0, daysBetween(current.dueOn, today)) : 0,
    });

    current = completeStep(current, first ? maxDay(current.dueOn, today) : current.dueOn);
  }

  return plan;
}
