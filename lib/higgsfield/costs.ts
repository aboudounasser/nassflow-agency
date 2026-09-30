import type { HiggsfieldConfig } from './config';
import { HiggsfieldError } from './errors';
import type { GenerationStore } from './tracking';

/**
 * Les plafonds de dépense, vérifiés avant tout envoi réel.
 *
 * L'API, telle que vérifiée, ne renvoie pas le coût d'une génération. Les
 * plafonds portent donc sur le coût ESTIMÉ que l'appelant déclare, et un
 * envoi réel sans estimation est refusé. Le vrai montant se lit dans le
 * tableau de bord Higgsfield ; la table de suivi sert à le rapprocher.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export async function assertWithinBudget({
  config,
  estimatedCredits,
  store,
  now = new Date(),
}: {
  config: HiggsfieldConfig;
  estimatedCredits: number | undefined;
  store: GenerationStore;
  now?: Date;
}): Promise<void> {
  if (
    estimatedCredits === undefined ||
    !Number.isFinite(estimatedCredits) ||
    estimatedCredits <= 0
  ) {
    throw new HiggsfieldError(
      'budget_exceeded',
      'estimatedCredits (nombre positif) est obligatoire hors dry-run.',
    );
  }

  if (config.maxCreditsPerRequest === null || config.dailyCreditBudget === null) {
    throw new HiggsfieldError(
      'config',
      'HIGGSFIELD_MAX_CREDITS_PER_REQUEST et HIGGSFIELD_DAILY_CREDIT_BUDGET sont obligatoires hors dry-run.',
    );
  }

  if (estimatedCredits > config.maxCreditsPerRequest) {
    throw new HiggsfieldError(
      'budget_exceeded',
      `Coût estimé ${estimatedCredits} au-delà du plafond par génération (${config.maxCreditsPerRequest}).`,
    );
  }

  const spent = await store.sumEstimatedCreditsSince(new Date(now.getTime() - DAY_MS));

  if (spent + estimatedCredits > config.dailyCreditBudget) {
    throw new HiggsfieldError(
      'budget_exceeded',
      `Budget des dernières 24 h dépassé : ${spent} déjà engagés, ${estimatedCredits} demandés, plafond ${config.dailyCreditBudget}.`,
    );
  }
}
