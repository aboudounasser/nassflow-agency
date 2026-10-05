/**
 * Les dates du CRM sont des jours, pas des instants : « relancer le
 * 12 » ne dépend pas de l'heure. Elles s'écrivent AAAA-MM-JJ, se
 * comparent comme des chaînes, et « aujourd'hui » est celui de Paris —
 * sur un serveur Vercel en UTC, minuit à Paris tombe la veille à 22 h
 * ou 23 h.
 */

const PARIS = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Le jour qu'il est à Paris à l'instant `now`. */
export function todayInParis(now: Date = new Date()): string {
  return PARIS.format(now);
}

export function isDay(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  return toUtc(value).toISOString().slice(0, 10) === value;
}

function toUtc(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

export function addDays(day: string, days: number): string {
  const date = toUtc(day);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

/** Nombre de jours de `from` à `to` (négatif si `to` est avant). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000);
}

export function maxDay(a: string, b: string): string {
  return a > b ? a : b;
}

const LONG = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

/** « lun. 12 oct. » */
export function formatDay(day: string): string {
  return LONG.format(toUtc(day));
}

/** « aujourd'hui », « demain », « dans 3 j », « en retard de 2 j ». */
export function relativeDay(day: string, today: string): string {
  const delta = daysBetween(today, day);

  if (delta === 0) return 'aujourd’hui';
  if (delta === 1) return 'demain';
  if (delta === -1) return 'en retard d’1 j';
  if (delta < 0) return `en retard de ${-delta} j`;

  return `dans ${delta} j`;
}
