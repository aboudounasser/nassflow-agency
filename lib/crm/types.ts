/**
 * Le CRM de prospection : les types partagés par le scoring, la cadence
 * des actions, le stockage et le tableau.
 *
 * Un prospect a deux parties :
 * - ce qu'on sait de lui (`ProspectInput`), saisi ou importé ;
 * - où on en est avec lui (étape, action en cours, historique).
 *
 * Le score, sa justification et le premier message ne sont PAS stockés
 * comme une vérité : ils se recalculent depuis `ProspectInput` (voir
 * lib/crm/scoring.ts). Une règle de scoring qui change s'applique donc
 * à toute la base au chargement suivant, sans migration.
 */

/** Les colonnes du tableau, dans l'ordre d'affichage. */
export const STAGES = [
  'nouveaux',
  'contactes',
  'interesses',
  'qualifies',
  'conclus',
  'non_pertinent',
] as const;

export type Stage = (typeof STAGES)[number];

/** Les colonnes du pipeline actif : tout sauf « Non pertinent ». */
export type ActiveStage = Exclude<Stage, 'non_pertinent'>;

export const STAGE_LABELS: Record<Stage, string> = {
  nouveaux: 'Nouveaux prospects',
  contactes: 'Contactés',
  interesses: 'Intéressés',
  qualifies: 'Qualifiés',
  conclus: 'Conclus',
  non_pertinent: 'Non pertinent',
};

/** En dessous de ce score, un prospect est écarté automatiquement. */
export const MIN_SCORE = 5;

export function isStage(value: unknown): value is Stage {
  return typeof value === 'string' && (STAGES as readonly string[]).includes(value);
}

/** Ce qu'on sait du prospect. Tout est facultatif sauf ce qui l'identifie. */
export type ProspectInput = {
  company: string | null;
  contactName: string | null;
  contactRole: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sector: string | null;
  /** Effectif, si connu. */
  employees: number | null;
  /** Le besoin, les notes, ce qu'il a dit ou écrit. */
  need: string | null;
  /** D'où vient la fiche : manuel, csv, site:assistant, site:solution… */
  source: string;
};

/** Ce qui s'est passé sur une fiche, du plus ancien au plus récent. */
export type ActivityKind =
  | 'cree'
  | 'fait'
  | 'ignore'
  | 'reporte'
  | 'deplace'
  | 'exclu'
  | 'reintegre'
  | 'modifie';

export type Activity = {
  kind: ActivityKind;
  /** Jour de l'événement, AAAA-MM-JJ (heure de Paris). */
  on: string;
  /** Libellé lisible : l'action faite, l'étape quittée… */
  label: string;
  stepId?: string;
  from?: Stage;
  to?: Stage;
};

export type Prospect = ProspectInput & {
  id: string;
  createdAt: string;
  stage: Stage;
  /**
   * Qui a classé la fiche en « Non pertinent » : le score (`auto`), et
   * seule cette exclusion-là est levée quand le score repasse à 5, ou
   * l'utilisateur (`manual`), qui seul peut la lever.
   */
  excludedBy: 'auto' | 'manual' | null;
  /** Position dans la cadence de l'étape (voir lib/crm/cadence.ts). */
  stepIndex: number;
  /** Échéance de l'action en cours, AAAA-MM-JJ. */
  dueOn: string;
  activity: Activity[];
};
