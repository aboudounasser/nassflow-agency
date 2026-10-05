import { solutions } from '@/lib/content/solutions';
import { readProspectInput } from './input';
import type { ProspectInput } from './types';

/**
 * Les demandes déposées sur le site, traduites en fiches prospect :
 * celles de l'assistant (`chat_leads`) et celles des fiches solution
 * (`solution_requests`). Chaque fiche garde la référence de sa ligne
 * d'origine (`source_ref`) : relancer l'import ne crée pas de doublon.
 */

export type SiteLead = { ref: string; createdAt: string; input: ProspectInput };

export type ChatLeadRow = {
  id: string;
  created_at: string;
  email: string;
  first_name: string | null;
  need: string | null;
  page: string | null;
};

export type SolutionRequestRow = {
  id: string;
  created_at: string;
  solution_slug: string;
  company: string | null;
  contact_name: string | null;
  email: string;
  phone: string | null;
  sector: string | null;
  answers: Record<string, unknown> | null;
};

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function fromChatLead(row: ChatLeadRow): SiteLead | null {
  const need = [row.need, row.page ? `(depuis ${row.page})` : null].filter(Boolean).join(' ');
  const read = readProspectInput(
    { contactName: row.first_name, email: row.email, need: clip(need, 4000) || null },
    'site:assistant',
  );

  return read.ok ? { ref: `chat_leads:${row.id}`, createdAt: row.created_at, input: read.input } : null;
}

/**
 * Le besoin d'une demande de solution : la catégorie et le titre de la
 * solution (ce que le scoring reconnaît), puis les réponses, avec le
 * libellé de leur question.
 */
export function fromSolutionRequest(row: SolutionRequestRow): SiteLead | null {
  const solution = solutions.find((item) => item.slug === row.solution_slug);
  const answers = row.answers ?? {};

  const lines = solution
    ? [
        `Demande « ${solution.categoryLabel} » : ${solution.title}.`,
        ...solution.questions
          .filter((question) => typeof answers[question.id] === 'string')
          .map((question) => `${question.label} ${answers[question.id] as string}`),
      ]
    : [`Demande de solution « ${row.solution_slug} ».`];

  const read = readProspectInput(
    {
      company: row.company,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      sector: row.sector,
      need: clip(lines.join(' '), 4000),
    },
    'site:solution',
  );

  return read.ok
    ? { ref: `solution_requests:${row.id}`, createdAt: row.created_at, input: read.input }
    : null;
}
