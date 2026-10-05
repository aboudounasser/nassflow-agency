import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CADENCE, completeStep, enterStage, postponeStep, projectPlan, skipStep, stepAt } from './cadence';
import { addDays, daysBetween, isDay, relativeDay, todayInParis } from './dates';
import { STAGES } from './types';

const DAY = '2026-10-05';

describe('dates', () => {
  it('prend le jour de Paris, pas celui d’UTC', () => {
    // 23 h 30 UTC le 5 octobre : déjà le 6 à Paris (UTC+2).
    assert.equal(todayInParis(new Date('2026-10-05T23:30:00Z')), '2026-10-06');
    assert.equal(todayInParis(new Date('2026-10-05T21:30:00Z')), '2026-10-05');
  });

  it('compte les jours sans être piégé par les changements d’heure', () => {
    assert.equal(addDays('2026-10-24', 2), '2026-10-26');
    assert.equal(daysBetween('2026-10-24', '2026-10-26'), 2);
    assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  });

  it('valide une date AAAA-MM-JJ', () => {
    assert.equal(isDay('2026-10-05'), true);
    assert.equal(isDay('2026-02-30'), false);
    assert.equal(isDay('05/10/2026'), false);
  });

  it('dit l’échéance en mots', () => {
    assert.equal(relativeDay(DAY, DAY), 'aujourd’hui');
    assert.equal(relativeDay('2026-10-06', DAY), 'demain');
    assert.equal(relativeDay('2026-10-03', DAY), 'en retard de 2 j');
  });
});

describe('cadence', () => {
  it('donne à chaque colonne une action, même au bout de sa séquence', () => {
    for (const stage of STAGES) {
      assert.ok(stepAt(stage, 0).label, stage);
      assert.equal(stepAt(stage, 99).id, CADENCE[stage].after.id, stage);
    }
  });

  it('fait passer en « Contactés » une fois le premier message envoyé', () => {
    const next = completeStep(enterStage('nouveaux', DAY), DAY);

    assert.equal(next.stage, 'contactes');
    assert.equal(next.stepIndex, 0);
    assert.equal(next.dueOn, addDays(DAY, CADENCE.contactes.steps[0].delay));
  });

  it('date l’action suivante à partir du jour où la précédente a été faite', () => {
    const start = enterStage('contactes', DAY);
    // Faite avec 4 jours de retard : la suite part de ce jour-là.
    const late = addDays(start.dueOn, 4);
    const next = completeStep(start, late);

    assert.equal(next.stepIndex, 1);
    assert.equal(next.dueOn, addDays(late, CADENCE.contactes.steps[1].delay));
  });

  it('rapproche l’action suivante quand la précédente est ignorée', () => {
    const start = enterStage('contactes', DAY);
    const done = completeStep(start, start.dueOn);
    const skipped = skipStep(start, start.dueOn);

    assert.equal(skipped.stepIndex, done.stepIndex);
    assert.ok(skipped.dueOn < done.dueOn);
  });

  it('ne laisse pas ignorer le premier message : il revient le lendemain', () => {
    const start = enterStage('nouveaux', DAY);
    const skipped = skipStep(start, DAY);

    assert.equal(skipped.stage, 'nouveaux');
    assert.equal(skipped.stepIndex, 0);
    assert.equal(skipped.dueOn, addDays(DAY, 1));
  });

  it('enchaîne sur l’action d’entretien, qui se répète', () => {
    let position = enterStage('contactes', DAY);

    for (let i = 0; i < CADENCE.contactes.steps.length + 2; i++) {
      position = completeStep(position, position.dueOn);
    }

    assert.equal(stepAt('contactes', position.stepIndex).id, 'reactivation');
    assert.equal(position.stepIndex, CADENCE.contactes.steps.length);
  });

  it('reporte à partir d’aujourd’hui une action déjà en retard', () => {
    const late = { ...enterStage('contactes', '2026-09-01') };

    assert.equal(postponeStep(late, 3, DAY).dueOn, addDays(DAY, 3));

    const future = { ...late, dueOn: '2026-10-10' };

    assert.equal(postponeStep(future, 3, DAY).dueOn, '2026-10-13');
  });

  it('fait glisser tout le plan tant que l’action en retard n’est pas faite', () => {
    const position = { stage: 'contactes' as const, stepIndex: 0, dueOn: '2026-10-01' };
    const plan = projectPlan(position, DAY);

    assert.equal(plan[0].overdueBy, 4);
    assert.equal(plan[0].dueOn, '2026-10-01');
    assert.equal(plan[1].dueOn, addDays(DAY, CADENCE.contactes.steps[1].delay));

    const tomorrow = projectPlan(position, addDays(DAY, 1));

    assert.equal(tomorrow[0].overdueBy, 5);
    assert.equal(daysBetween(plan[1].dueOn, tomorrow[1].dueOn), 1);
    assert.equal(daysBetween(plan[2].dueOn, tomorrow[2].dueOn), 1);
  });

  it('montre dans le plan le passage à la colonne suivante', () => {
    const plan = projectPlan(enterStage('nouveaux', DAY), DAY);

    assert.deepEqual(
      plan.map((step) => step.stage),
      ['nouveaux', 'contactes', 'contactes'],
    );
  });
});
