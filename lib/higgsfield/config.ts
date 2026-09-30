import { HiggsfieldError } from './errors';

/**
 * La configuration Higgsfield, lue depuis l'environnement serveur.
 *
 * Lue à l'appel et non au chargement du module, comme Supabase et
 * Resend : une variable absente ne doit pas faire tomber `next build`.
 *
 * Aucune de ces variables n'a le préfixe `NEXT_PUBLIC_` : Next ne peut
 * donc pas les inliner dans un bundle navigateur.
 */

/**
 * L'hôte de l'API, figé ici et non lu dans l'environnement : une
 * variable qui le déplacerait suffirait à envoyer HF_CREDENTIALS
 * ailleurs.
 */
export const HIGGSFIELD_BASE_URL = 'https://api.higgsfield.ai';

export interface HiggsfieldCredentials {
  keyId: string;
  keySecret: string;
}

export interface HiggsfieldConfig {
  credentials: HiggsfieldCredentials | null;
  /**
   * Vrai sauf si HIGGSFIELD_DRY_RUN vaut exactement `false`. Une faute
   * de frappe, une variable oubliée : dans le doute, rien ne part.
   */
  dryRun: boolean;
  /**
   * Endpoints autorisés à recevoir une génération. Vide par défaut : même
   * hors dry-run, rien ne peut être soumis tant qu'on n'en a pas nommé.
   */
  allowedEndpoints: ReadonlySet<string>;
  /**
   * Plafond du coût ESTIMÉ par génération, en dollars : l'API est
   * facturée en dollars, sur un solde distinct des crédits d'abonnement.
   */
  maxCostUsdPerRequest: number | null;
  /** Plafond du coût ESTIMÉ sur les dernières 24 heures, en dollars. */
  dailyBudgetUsd: number | null;
}

type Env = Record<string, string | undefined>;

/**
 * Découpe `KEY_ID:KEY_SECRET`. Comme le SDK officiel, exige exactement
 * deux parties non vides. Le message d'erreur ne cite jamais la valeur.
 */
export function parseCredentials(raw: string | undefined): HiggsfieldCredentials | null {
  const value = raw?.trim();

  if (!value) return null;

  const parts = value.split(':');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new HiggsfieldError(
      'config',
      'HF_CREDENTIALS doit avoir la forme KEY_ID:KEY_SECRET.',
    );
  }

  return { keyId: parts[0], keySecret: parts[1] };
}

/** Normalise un chemin d'endpoint : un seul `/` en tête, aucun en fin. */
export function normalizeEndpoint(endpoint: string): string {
  return `/${endpoint.trim().replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

function parseLimit(name: string, raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === '') return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new HiggsfieldError('config', `${name} doit être un nombre positif.`);
  }

  return value;
}

export function readHiggsfieldConfig(env: Env = process.env): HiggsfieldConfig {
  return {
    credentials: parseCredentials(env.HF_CREDENTIALS),
    dryRun: env.HIGGSFIELD_DRY_RUN?.trim().toLowerCase() !== 'false',
    allowedEndpoints: new Set(
      (env.HIGGSFIELD_ALLOWED_ENDPOINTS ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map(normalizeEndpoint),
    ),
    maxCostUsdPerRequest: parseLimit(
      'HIGGSFIELD_MAX_COST_USD_PER_REQUEST',
      env.HIGGSFIELD_MAX_COST_USD_PER_REQUEST,
    ),
    dailyBudgetUsd: parseLimit(
      'HIGGSFIELD_DAILY_BUDGET_USD',
      env.HIGGSFIELD_DAILY_BUDGET_USD,
    ),
  };
}
