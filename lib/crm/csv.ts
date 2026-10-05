import { normalize } from './scoring';

/**
 * L'import d'une liste de prospects en CSV, tel qu'un export Excel,
 * Google Sheets, LinkedIn Sales Navigator ou un annuaire le produit.
 *
 * Le séparateur (virgule, point-virgule — celui d'Excel en français —
 * ou tabulation) est deviné sur la ligne d'en-tête. Les colonnes sont
 * reconnues par leur nom, en français ou en anglais, sans tenir compte
 * des accents ni des majuscules ; les colonnes inconnues sont ignorées.
 */

export const MAX_CSV_ROWS = 500;

/** Découpe un CSV en lignes de cellules (guillemets et "" compris). */
export function parseCsv(content: string): string[][] {
  const textContent = content.replace(/^﻿/, '');
  const firstLine = textContent.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = (['\t', ';', ','] as const).reduce((best, candidate) =>
    firstLine.split(candidate).length > firstLine.split(best).length ? candidate : best,
  );

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < textContent.length; i++) {
    const char = textContent[i];

    if (quoted) {
      if (char === '"' && textContent[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"' && cell.trim() === '') {
      quoted = true;
      cell = '';
    } else if (char === delimiter) {
      row.push(cell);
      cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && textContent[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((value) => value.trim() !== ''));
}

const HEADER_ALIASES: Record<string, string[]> = {
  company: ['entreprise', 'societe', 'company', 'raison sociale', 'organisation', 'organization', 'nom de l entreprise', 'company name', 'structure'],
  contactName: ['responsable', 'contact', 'nom', 'name', 'nom complet', 'full name', 'prenom nom', 'interlocuteur', 'dirigeant'],
  contactRole: ['fonction', 'poste', 'role', 'title', 'job title', 'titre'],
  email: ['email', 'e-mail', 'mail', 'courriel', 'adresse e-mail', 'adresse email', 'email address'],
  phone: ['telephone', 'tel', 'phone', 'mobile', 'portable', 'numero', 'phone number'],
  website: ['site', 'site web', 'site internet', 'website', 'url', 'web'],
  sector: ['secteur', 'secteur d activite', 'activite', 'industry', 'industrie', 'sector', 'naf'],
  employees: ['effectif', 'salaries', 'employes', 'employees', 'taille', 'company size', 'nombre de salaries'],
  need: ['besoin', 'notes', 'note', 'commentaire', 'commentaires', 'description', 'need', 'remarques', 'contexte'],
};

function fieldFor(header: string): string | null {
  const key = normalize(header).replace(/[_.]/g, ' ').trim();

  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(key)) return field;
  }

  return null;
}

export type CsvRead =
  | { ok: true; rows: Record<string, string>[]; ignoredColumns: string[]; truncated: boolean }
  | { ok: false; error: string };

/** Le CSV en fiches brutes, à passer ensuite à `readProspectInput`. */
export function readProspectCsv(content: string): CsvRead {
  const [header, ...lines] = parseCsv(content);

  if (!header) return { ok: false, error: 'Le fichier est vide.' };

  const fields = header.map(fieldFor);

  if (!fields.some(Boolean)) {
    return {
      ok: false,
      error: 'Aucune colonne reconnue. La première ligne doit nommer les colonnes : Entreprise, Responsable, E-mail, Téléphone, Besoin…',
    };
  }

  const rows = lines.slice(0, MAX_CSV_ROWS).map((cells) => {
    const row: Record<string, string> = {};

    fields.forEach((field, index) => {
      const value = cells[index]?.trim();
      // Deux colonnes « notes » se cumulent au lieu de s'écraser.
      if (field && value) row[field] = row[field] ? `${row[field]} — ${value}` : value;
    });

    return row;
  });

  return {
    ok: true,
    rows,
    ignoredColumns: header.filter((_, index) => !fields[index]).map((name) => name.trim()).filter(Boolean),
    truncated: lines.length > MAX_CSV_ROWS,
  };
}
