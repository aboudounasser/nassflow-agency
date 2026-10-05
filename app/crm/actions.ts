'use server';

import { headers } from 'next/headers';
import { checkCrmAccess } from '@/lib/crm/auth';
import { readProspectCsv } from '@/lib/crm/csv';
import { todayInParis } from '@/lib/crm/dates';
import { readProspectInput } from '@/lib/crm/input';
import {
  applyStepAction,
  createProspect,
  moveProspect,
  reconcile,
  updateProspect,
  type StepAction,
} from '@/lib/crm/prospect';
import {
  fromChatLead,
  fromSolutionRequest,
  type ChatLeadRow,
  type SiteLead,
  type SolutionRequestRow,
} from '@/lib/crm/site-leads';
import { CrmStoreError, getCrmStore, type CrmStore } from '@/lib/crm/store';
import { isStage, type Prospect, type ProspectInput } from '@/lib/crm/types';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Les écritures du CRM.
 *
 * Chaque action revérifie l'accès : une Server Action se joint par un
 * POST direct, sans passer par la page (voir lib/crm/auth.ts). Et
 * chacune revalide ce qu'elle reçoit — identifiants, colonnes, durées —
 * puisque le navigateur peut envoyer n'importe quoi.
 *
 * Une action rend la fiche à jour : le tableau la remplace telle quelle,
 * sans recharger la page. « Aujourd'hui » est celui de Paris, calculé
 * ici et non reçu du navigateur.
 */

export type ActionResult<T> = ({ ok: true } & T) | { ok: false; error: string };

const MAX_CSV_CHARS = 2_000_000;

async function guard(): Promise<void> {
  const authorization = (await headers()).get('authorization');

  if (checkCrmAccess(authorization) !== 'granted') {
    throw new Error('Accès au CRM refusé.');
  }
}

/** Rend l'erreur lisible pour une panne de base, générique sinon. */
async function run<T>(work: (store: CrmStore) => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  await guard();

  try {
    return await work(getCrmStore());
  } catch (error) {
    if (error instanceof CrmStoreError) return { ok: false, error: error.message };

    console.error('CRM — action en échec :', error);

    return { ok: false, error: 'L’opération a échoué. Réessayez.' };
  }
}

function isId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(value);
}

/** La fiche telle qu'en base, avec la règle d'exclusion appliquée au score du jour. */
async function load(store: CrmStore, id: unknown, today: string): Promise<Prospect | null> {
  if (!isId(id)) return null;

  const prospect = await store.get(id);

  return prospect ? reconcile(prospect, today) : null;
}

const NOT_FOUND = { ok: false as const, error: 'Cette fiche n’existe plus. Rechargez la page.' };

function fields(raw: unknown): Record<string, unknown> {
  return typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
}

export async function createProspectAction(raw: unknown): Promise<ActionResult<{ prospect: Prospect }>> {
  return run(async (store) => {
    const read = readProspectInput(fields(raw), 'manuel');

    if (!read.ok) return read;

    const today = todayInParis();
    const prospect = createProspect(read.input, {
      id: crypto.randomUUID(),
      today,
      createdAt: new Date().toISOString(),
    });

    await store.insert([{ prospect }]);

    return { ok: true, prospect };
  });
}

export async function updateProspectAction(
  id: unknown,
  raw: unknown,
): Promise<ActionResult<{ prospect: Prospect }>> {
  return run(async (store) => {
    const today = todayInParis();
    const current = await load(store, id, today);

    if (!current) return NOT_FOUND;

    const read = readProspectInput(fields(raw), current.source);

    if (!read.ok) return read;

    const prospect = updateProspect(current, read.input, today);

    await store.update(prospect);

    return { ok: true, prospect };
  });
}

export async function moveProspectAction(
  id: unknown,
  stage: unknown,
): Promise<ActionResult<{ prospect: Prospect }>> {
  return run(async (store) => {
    if (!isStage(stage)) return { ok: false, error: 'Colonne inconnue.' };

    const today = todayInParis();
    const current = await load(store, id, today);

    if (!current) return NOT_FOUND;

    const result = moveProspect(current, stage, today);

    if (!result.ok) return result;

    await store.update(result.prospect);

    return { ok: true, prospect: result.prospect };
  });
}

function readStepAction(raw: unknown): StepAction | null {
  const action = fields(raw);

  if (action.type === 'fait' || action.type === 'ignore') return { type: action.type };

  if (
    action.type === 'reporter' &&
    typeof action.days === 'number' &&
    Number.isInteger(action.days) &&
    action.days >= 1 &&
    action.days <= 60
  ) {
    return { type: 'reporter', days: action.days };
  }

  return null;
}

export async function stepAction(id: unknown, raw: unknown): Promise<ActionResult<{ prospect: Prospect }>> {
  return run(async (store) => {
    const action = readStepAction(raw);

    if (!action) return { ok: false, error: 'Action inconnue.' };

    const today = todayInParis();
    const current = await load(store, id, today);

    if (!current) return NOT_FOUND;

    const prospect = applyStepAction(current, action, today);

    await store.update(prospect);

    return { ok: true, prospect };
  });
}

export async function deleteProspectAction(id: unknown): Promise<ActionResult<{ id: string }>> {
  return run(async (store) => {
    if (!isId(id)) return NOT_FOUND;

    await store.remove(id);

    return { ok: true, id };
  });
}

export type ImportSummary = {
  prospects: Prospect[];
  /** Fiches créées mais exclues d'office (score sous 5). */
  excluded: number;
  /** Lignes illisibles, déjà importées ou sans rien pour identifier qui que ce soit. */
  skipped: number;
  notes: string[];
};

function createAll(inputs: { input: ProspectInput; createdAt?: string }[], today: string) {
  return inputs.map(({ input, createdAt }) =>
    createProspect(input, {
      id: crypto.randomUUID(),
      today,
      createdAt: createdAt ?? new Date().toISOString(),
    }),
  );
}

function summarize(prospects: Prospect[], skipped: number, notes: string[]): ActionResult<ImportSummary> {
  return {
    ok: true,
    prospects,
    excluded: prospects.filter((prospect) => prospect.stage === 'non_pertinent').length,
    skipped,
    notes,
  };
}

export async function importCsvAction(content: unknown): Promise<ActionResult<ImportSummary>> {
  return run(async (store) => {
    if (typeof content !== 'string' || content.trim() === '') {
      return { ok: false, error: 'Le fichier est vide.' };
    }

    if (content.length > MAX_CSV_CHARS) {
      return { ok: false, error: 'Fichier trop lourd : découpez-le en plusieurs imports.' };
    }

    const csv = readProspectCsv(content);

    if (!csv.ok) return csv;

    const inputs: { input: ProspectInput }[] = [];
    let skipped = 0;

    for (const row of csv.rows) {
      const read = readProspectInput(row, 'csv');

      if (read.ok) inputs.push({ input: read.input });
      else skipped++;
    }

    const prospects = createAll(inputs, todayInParis());

    await store.insert(prospects.map((prospect) => ({ prospect })));

    const notes: string[] = [];

    if (csv.truncated) notes.push('Seules les 500 premières lignes ont été importées.');
    if (csv.ignoredColumns.length > 0) notes.push(`Colonnes ignorées : ${csv.ignoredColumns.join(', ')}.`);

    return summarize(prospects, skipped, notes);
  });
}

/**
 * Relit les demandes déposées sur le site et crée une fiche pour chaque
 * demande pas encore importée.
 */
export async function importSiteLeadsAction(): Promise<ActionResult<ImportSummary>> {
  return run(async (store) => {
    const supabase = getSupabaseAdminClient();

    if (store.kind !== 'supabase' || !supabase) {
      return { ok: false, error: 'L’import des demandes du site demande Supabase.' };
    }

    const [chat, solution] = await Promise.all([
      supabase
        .from('chat_leads')
        .select('id, created_at, email, first_name, need, page')
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('solution_requests')
        .select('id, created_at, solution_slug, company, contact_name, email, phone, sector, answers')
        .order('created_at', { ascending: false })
        .limit(500),
    ]);

    const notes: string[] = [];
    const leads: SiteLead[] = [];
    let skipped = 0;

    if (chat.error) {
      console.error('CRM — lecture de chat_leads :', chat.error);
      notes.push('Les demandes de l’assistant (chat_leads) n’ont pas pu être lues.');
    } else {
      for (const row of chat.data as ChatLeadRow[]) {
        const lead = fromChatLead(row);
        if (lead) leads.push(lead);
        else skipped++;
      }
    }

    if (solution.error) {
      console.error('CRM — lecture de solution_requests :', solution.error);
      notes.push('Les demandes de solution (solution_requests) n’ont pas pu être lues.');
    } else {
      for (const row of solution.data as SolutionRequestRow[]) {
        const lead = fromSolutionRequest(row);
        if (lead) leads.push(lead);
        else skipped++;
      }
    }

    const known = await store.existingRefs(leads.map((lead) => lead.ref));
    const fresh = leads.filter((lead) => !known.has(lead.ref));
    const prospects = createAll(fresh, todayInParis());

    await store.insert(prospects.map((prospect, index) => ({ prospect, sourceRef: fresh[index].ref })));

    if (fresh.length === 0 && notes.length === 0) notes.push('Aucune nouvelle demande depuis le dernier import.');

    return summarize(prospects, skipped, notes);
  });
}
