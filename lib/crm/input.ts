import type { ProspectInput } from './types';

/**
 * Lit une fiche telle qu'elle arrive (formulaire, CSV, base) et la
 * réduit à un `ProspectInput` propre.
 *
 * On ne refuse pas une fiche parce qu'un e-mail est mal formé : c'est
 * précisément ce que le scoring doit voir pour l'exclure. On refuse ce
 * qui n'est pas une fiche (rien pour identifier qui que ce soit) et ce
 * qui déborde.
 */

const LIMITS = {
  company: 200,
  contactName: 200,
  contactRole: 120,
  email: 320,
  phone: 40,
  website: 300,
  sector: 120,
  need: 4000,
} as const;

type TextField = keyof typeof LIMITS;

export const INPUT_FIELDS: TextField[] = Object.keys(LIMITS) as TextField[];

function text(value: unknown, max: number): string | null | { error: true } {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' && typeof value !== 'number') return { error: true };

  const trimmed = String(value).replace(/\s+/g, ' ').trim();

  if (trimmed.length > max) return { error: true };

  return trimmed.length > 0 ? trimmed : null;
}

/** « 12 », « 10-50 », « 10 à 50 salariés » → le premier nombre. */
export function readEmployees(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? Math.floor(value) : null;
  if (typeof value !== 'string') return null;

  const match = /\d[\d\s]*/.exec(value);

  if (!match) return null;

  const number = Number(match[0].replace(/\s/g, ''));

  return Number.isSafeInteger(number) ? number : null;
}

const FIELD_NAMES: Record<TextField, string> = {
  company: 'Entreprise',
  contactName: 'Responsable',
  contactRole: 'Fonction',
  email: 'E-mail',
  phone: 'Téléphone',
  website: 'Site web',
  sector: 'Secteur',
  need: 'Besoin',
};

export function readProspectInput(
  raw: Record<string, unknown>,
  source: string,
): { ok: true; input: ProspectInput } | { ok: false; error: string } {
  const values = {} as Record<TextField, string | null>;

  for (const field of INPUT_FIELDS) {
    const value = text(raw[field], LIMITS[field]);

    if (value !== null && typeof value === 'object') {
      return { ok: false, error: `${FIELD_NAMES[field]} : valeur illisible ou trop longue.` };
    }

    values[field] = value;
  }

  if (!values.company && !values.contactName && !values.email && !values.phone) {
    return { ok: false, error: 'Il faut au moins une entreprise, un nom, un e-mail ou un téléphone.' };
  }

  return {
    ok: true,
    input: { ...values, employees: readEmployees(raw.employees), source },
  };
}
