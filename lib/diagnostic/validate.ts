import {
  companySizes,
  diagnosticContent,
  expectedOutcomes,
  limits,
  monthlyVolumes,
  problemChoices,
  sectors,
  tools as toolChoices,
  type Choice,
} from '@/lib/content/diagnostic';

/**
 * La validation du formulaire de diagnostic, partagée par le navigateur
 * (validation étape par étape) et la route serveur (app/api/diagnostic),
 * qui seule fait foi : le navigateur n'est qu'une commodité, tout ce
 * qu'il envoie est revérifié ici.
 *
 * Aucune dépendance : des listes fermées (lib/content/diagnostic.ts), des
 * longueurs maximales et deux expressions régulières.
 */

/** Ce que le formulaire tient en mémoire, et ce qu'il envoie. */
export type DiagnosticFields = {
  company: string;
  sector: string;
  companySize: string;
  problem: string;
  problemDetails: string;
  tools: string[];
  monthlyVolume: string;
  expectedOutcome: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
};

export type FieldName = keyof DiagnosticFields;

export type FieldErrors = Partial<Record<FieldName, string>>;

export const emptyFields: DiagnosticFields = {
  company: '',
  sector: '',
  companySize: '',
  problem: '',
  problemDetails: '',
  tools: [],
  monthlyVolume: '',
  expectedOutcome: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  consent: false,
};

/** Les champs de chaque étape, dans l'ordre d'affichage. */
export const stepFields: readonly (readonly FieldName[])[] = [
  ['company', 'sector', 'companySize'],
  ['problem', 'problemDetails'],
  ['tools', 'monthlyVolume', 'expectedOutcome'],
  ['firstName', 'lastName', 'email', 'phone', 'consent'],
];

export const TOTAL_STEPS = stepFields.length;

/** L'étape (0 à 3) qui porte un champ. */
export function stepOf(field: FieldName): number {
  return stepFields.findIndex((fields) => fields.includes(field));
}

/** En dessous, l'envoi est celui d'un robot : 4 étapes ne se remplissent pas en 3 s. */
export const MIN_ELAPSED_MS = 3000;

const errors = diagnosticContent.errors;

/**
 * Forme d'une adresse, pas sa validité (seul un envoi la prouverait) :
 * une partie locale, un domaine avec au moins un point, une extension
 * alphabétique. Ni espace, ni chevron, ni point doublé.
 */
export function isValidEmail(value: string): boolean {
  if (value.length > limits.email || value.includes('..')) return false;

  return /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/.test(value);
}

/** Chiffres, espaces, +, points, tirets, parenthèses ; 6 chiffres au moins. */
export function isValidPhone(value: string): boolean {
  if (value.length > limits.phone) return false;
  if (!/^\+?[0-9 ().-]+$/.test(value)) return false;

  return value.replace(/\D/g, '').length >= 6;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function inList(list: readonly Choice[], value: string): boolean {
  return list.some((choice) => choice.value === value);
}

function labelOf(list: readonly Choice[], value: string): string | null {
  return list.find((choice) => choice.value === value)?.label ?? null;
}

/**
 * Les erreurs d'une étape. Champs requis : l'entreprise, le problème, le
 * prénom, l'e-mail et le consentement. Les autres sont facultatifs, mais
 * s'ils sont remplis, ils doivent l'être correctement (valeur de la
 * liste, longueur).
 */
export function validateStep(step: number, fields: DiagnosticFields): FieldErrors {
  const out: FieldErrors = {};
  const t = (value: string) => value.trim();

  if (step === 0) {
    if (!t(fields.company)) out.company = errors.company;
    else if (t(fields.company).length > limits.company) out.company = errors.companyTooLong;

    if (fields.sector && !inList(sectors, fields.sector)) out.sector = errors.sector;

    if (fields.companySize && !inList(companySizes, fields.companySize)) {
      out.companySize = errors.companySize;
    }
  }

  if (step === 1) {
    if (!inList(problemChoices, fields.problem)) out.problem = errors.problem;

    if (t(fields.problemDetails).length > limits.problemDetails) {
      out.problemDetails = errors.problemDetailsTooLong;
    }
  }

  if (step === 2) {
    const unique = new Set(fields.tools);

    if (
      unique.size !== fields.tools.length ||
      fields.tools.some((tool) => !inList(toolChoices, tool))
    ) {
      out.tools = errors.tools;
    }

    if (fields.monthlyVolume && !inList(monthlyVolumes, fields.monthlyVolume)) {
      out.monthlyVolume = errors.monthlyVolume;
    }

    if (fields.expectedOutcome && !inList(expectedOutcomes, fields.expectedOutcome)) {
      out.expectedOutcome = errors.expectedOutcome;
    }
  }

  if (step === 3) {
    if (!t(fields.firstName)) out.firstName = errors.firstName;
    else if (t(fields.firstName).length > limits.firstName) out.firstName = errors.firstNameTooLong;

    if (t(fields.lastName).length > limits.lastName) out.lastName = errors.lastNameTooLong;

    if (!isValidEmail(t(fields.email))) out.email = errors.email;

    if (t(fields.phone) && !isValidPhone(t(fields.phone))) out.phone = errors.phone;

    if (fields.consent !== true) out.consent = errors.consent;
  }

  return out;
}

/** Ce que la route enregistre : des libellés, pas des codes. */
export type DiagnosticRequest = {
  company: string;
  sector: string | null;
  companySize: string | null;
  problem: string;
  problemDetails: string | null;
  tools: string[];
  monthlyVolume: string | null;
  expectedOutcome: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
};

export type SubmissionResult =
  | { kind: 'ok'; submissionId: string; request: DiagnosticRequest }
  /** Le champ piège est rempli : on fait semblant d'accepter. */
  | { kind: 'bot' }
  /** Envoyé trop vite après l'affichage. */
  | { kind: 'too-fast' }
  | { kind: 'invalid'; error: string; field?: FieldName };

const MAX_BODY_KEYS = 32;

/**
 * Lit et vérifie le corps envoyé à /api/diagnostic. Rien n'est tronqué
 * ni réparé en silence : une valeur hors liste ou trop longue est
 * refusée, avec le nom du champ pour que le formulaire y ramène.
 */
export function readSubmission(body: unknown): SubmissionResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { kind: 'invalid', error: 'Requête illisible.' };
  }

  const raw = body as Record<string, unknown>;

  if (Object.keys(raw).length > MAX_BODY_KEYS) {
    return { kind: 'invalid', error: 'Requête illisible.' };
  }

  // Le champ piège, invisible pour un visiteur : seul un robot le remplit.
  if (typeof raw.reference === 'string' && raw.reference.trim() !== '') {
    return { kind: 'bot' };
  }

  const elapsed = raw.elapsedMs;

  if (typeof elapsed !== 'number' || !Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return { kind: 'too-fast' };
  }

  if (typeof raw.submissionId !== 'string' || !UUID.test(raw.submissionId)) {
    return { kind: 'invalid', error: 'Identifiant d’envoi manquant.' };
  }

  const str = (key: FieldName): string | null => {
    const value = raw[key];
    if (value === undefined || value === null) return '';
    return typeof value === 'string' ? value : null;
  };

  const fields: DiagnosticFields = { ...emptyFields };

  for (const key of [
    'company',
    'sector',
    'companySize',
    'problem',
    'problemDetails',
    'monthlyVolume',
    'expectedOutcome',
    'firstName',
    'lastName',
    'email',
    'phone',
  ] as const) {
    const value = str(key);
    if (value === null) return { kind: 'invalid', error: 'Champ illisible.', field: key };
    fields[key] = value;
  }

  if (raw.tools !== undefined && raw.tools !== null) {
    if (
      !Array.isArray(raw.tools) ||
      raw.tools.length > toolChoices.length ||
      raw.tools.some((tool) => typeof tool !== 'string')
    ) {
      return { kind: 'invalid', error: errors.tools, field: 'tools' };
    }

    fields.tools = raw.tools as string[];
  }

  fields.consent = raw.consent === true;

  for (let step = 0; step < TOTAL_STEPS; step += 1) {
    const stepErrors = validateStep(step, fields);
    const field = stepFields[step].find((name) => stepErrors[name]);

    if (field) return { kind: 'invalid', error: stepErrors[field]!, field };
  }

  const opt = (value: string) => value.trim() || null;

  return {
    kind: 'ok',
    submissionId: raw.submissionId.toLowerCase(),
    request: {
      company: fields.company.trim(),
      sector: labelOf(sectors, fields.sector),
      companySize: labelOf(companySizes, fields.companySize),
      problem: labelOf(problemChoices, fields.problem)!,
      problemDetails: opt(fields.problemDetails),
      tools: fields.tools.map((tool) => labelOf(toolChoices, tool)!),
      monthlyVolume: labelOf(monthlyVolumes, fields.monthlyVolume),
      expectedOutcome: labelOf(expectedOutcomes, fields.expectedOutcome),
      firstName: fields.firstName.trim(),
      lastName: opt(fields.lastName),
      email: fields.email.trim(),
      phone: opt(fields.phone),
    },
  };
}
