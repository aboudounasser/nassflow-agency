import type { HiggsfieldConfig } from './config';
import { HiggsfieldError } from './errors';
import type { GenerationStore } from './tracking';

/**
 * Les plafonds de dépense, vérifiés avant tout envoi réel.
 *
 * Quatre valeurs à ne jamais confondre :
 * - coût ESTIMÉ (`estimated_cost_usd`) : ce que l'appelant déclare avant
 *   l'envoi, seul chiffre sur lequel portent les plafonds ;
 * - coût RÉEL (`actual_cost_usd`) : inconnu tant qu'aucune source ne l'a
 *   donné — l'API, telle que vérifiée, ne le renvoie pas ;
 * - cashback (`cashback_usd`) : jamais supposé, seulement constaté ;
 * - solde de l'API : il n'existe pas d'endpoint connu pour le lire ; il
 *   se consulte dans la console Higgsfield et n'est stocké nulle part ici.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export async function assertWithinBudget({
  config,
  estimatedCostUsd,
  store,
  now = new Date(),
}: {
  config: HiggsfieldConfig;
  estimatedCostUsd: number | undefined;
  store: GenerationStore;
  now?: Date;
}): Promise<void> {
  if (
    estimatedCostUsd === undefined ||
    !Number.isFinite(estimatedCostUsd) ||
    estimatedCostUsd <= 0
  ) {
    throw new HiggsfieldError(
      'budget_exceeded',
      'estimatedCostUsd (nombre positif, en dollars) est obligatoire hors dry-run.',
    );
  }

  if (config.maxCostUsdPerRequest === null || config.dailyBudgetUsd === null) {
    throw new HiggsfieldError(
      'config',
      'HIGGSFIELD_MAX_COST_USD_PER_REQUEST et HIGGSFIELD_DAILY_BUDGET_USD sont obligatoires hors dry-run.',
    );
  }

  if (estimatedCostUsd > config.maxCostUsdPerRequest) {
    throw new HiggsfieldError(
      'budget_exceeded',
      `Coût estimé ${estimatedCostUsd} $ au-delà du plafond par génération (${config.maxCostUsdPerRequest} $).`,
    );
  }

  const spent = await store.sumEstimatedCostUsdSince(new Date(now.getTime() - DAY_MS));

  if (spent + estimatedCostUsd > config.dailyBudgetUsd) {
    throw new HiggsfieldError(
      'budget_exceeded',
      `Budget estimé des dernières 24 h dépassé : ${spent} $ déjà engagés, ${estimatedCostUsd} $ demandés, plafond ${config.dailyBudgetUsd} $.`,
    );
  }
}
