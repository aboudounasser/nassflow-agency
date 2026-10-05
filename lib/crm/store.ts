import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isDay } from './dates';
import { scoreProspect } from './scoring';
import { isStage, type Activity, type Prospect } from './types';
import { demoProspects } from './demo';

/**
 * Où vivent les fiches. Serveur uniquement : passe par la clé
 * service_role (lib/supabase/admin.ts).
 *
 * Sans Supabase configuré, et seulement en développement, les fiches
 * vivent en mémoire, pré-remplies d'exemples fictifs : le tableau se
 * voit et s'essaie sans base. Elles disparaissent au redémarrage du
 * serveur. En production, l'absence de base est une erreur affichée,
 * jamais un repli silencieux sur une mémoire que chaque instance aurait
 * à elle.
 */

export type CrmStore = {
  kind: 'supabase' | 'memoire';
  list(): Promise<Prospect[]>;
  get(id: string): Promise<Prospect | null>;
  insert(prospects: { prospect: Prospect; sourceRef?: string }[]): Promise<void>;
  /** Les `source_ref` déjà présents parmi ceux donnés. */
  existingRefs(refs: string[]): Promise<Set<string>>;
  update(prospect: Prospect): Promise<void>;
  remove(id: string): Promise<void>;
};

export class CrmStoreError extends Error {}

/* ───────────── Supabase ───────────── */

const TABLE = 'crm_prospects';

type Row = {
  id: string;
  created_at: string;
  company: string | null;
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sector: string | null;
  employees: number | null;
  need: string | null;
  source: string;
  stage: string;
  excluded_by: string | null;
  step_index: number;
  due_on: string;
  activity: unknown;
};

function toRow(prospect: Prospect) {
  return {
    id: prospect.id,
    company: prospect.company,
    contact_name: prospect.contactName,
    contact_role: prospect.contactRole,
    email: prospect.email,
    phone: prospect.phone,
    website: prospect.website,
    sector: prospect.sector,
    employees: prospect.employees,
    need: prospect.need,
    source: prospect.source,
    stage: prospect.stage,
    excluded_by: prospect.excludedBy,
    step_index: prospect.stepIndex,
    due_on: prospect.dueOn,
    score: scoreProspect(prospect).score,
    activity: prospect.activity,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: Row): Prospect {
  return {
    id: row.id,
    createdAt: row.created_at,
    company: row.company,
    contactName: row.contact_name,
    contactRole: row.contact_role,
    email: row.email,
    phone: row.phone,
    website: row.website,
    sector: row.sector,
    employees: row.employees,
    need: row.need,
    source: row.source,
    // Une valeur inattendue (édition à la main dans Supabase) ne doit
    // pas casser le tableau : la fiche revient au début du pipeline.
    stage: isStage(row.stage) ? row.stage : 'nouveaux',
    excludedBy: row.excluded_by === 'auto' || row.excluded_by === 'manual' ? row.excluded_by : null,
    stepIndex: Number.isInteger(row.step_index) && row.step_index >= 0 ? row.step_index : 0,
    dueOn: isDay(row.due_on) ? row.due_on : row.created_at.slice(0, 10),
    activity: Array.isArray(row.activity) ? (row.activity as Activity[]) : [],
  };
}

function fail(operation: string, error: { message: string; code?: string }): never {
  console.error(`CRM — Supabase (${operation}) :`, error);

  // 42P01 : la table n'existe pas encore.
  if (error.code === '42P01' || /does not exist|schema cache/i.test(error.message)) {
    throw new CrmStoreError('La table crm_prospects n’existe pas : exécutez supabase/crm_prospects.sql.');
  }

  throw new CrmStoreError('La base de données a refusé l’opération. Réessayez.');
}

function supabaseStore(): CrmStore | null {
  const supabase = getSupabaseAdminClient();

  if (!supabase) return null;

  return {
    kind: 'supabase',

    async list() {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('due_on', { ascending: true })
        .limit(2000);

      if (error) fail('list', error);

      return (data as Row[]).map(fromRow);
    },

    async get(id) {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();

      if (error) fail('get', error);

      return data ? fromRow(data as Row) : null;
    },

    async insert(items) {
      if (items.length === 0) return;

      const rows = items.map(({ prospect, sourceRef }) => ({
        ...toRow(prospect),
        created_at: prospect.createdAt,
        source_ref: sourceRef ?? null,
      }));

      // Un import concurrent a pu écrire la même source_ref entre-temps :
      // le doublon est ignoré au lieu de faire échouer tout le lot.
      const { error } = await supabase
        .from(TABLE)
        .upsert(rows, { onConflict: 'source_ref', ignoreDuplicates: true });

      if (error) fail('insert', error);
    },

    async existingRefs(refs) {
      if (refs.length === 0) return new Set();

      const { data, error } = await supabase.from(TABLE).select('source_ref').in('source_ref', refs);

      if (error) fail('existingRefs', error);

      return new Set((data as { source_ref: string }[]).map((row) => row.source_ref));
    },

    async update(prospect) {
      const { error } = await supabase.from(TABLE).update(toRow(prospect)).eq('id', prospect.id);

      if (error) fail('update', error);
    },

    async remove(id) {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);

      if (error) fail('remove', error);
    },
  };
}

/* ───────────── Mémoire (développement) ───────────── */

type Memory = { prospects: Map<string, Prospect>; refs: Set<string> };

// Sur globalThis : le rechargement à chaud du serveur de développement
// réévalue ce module, et effacerait sinon les fiches à chaque sauvegarde.
const globalMemory = globalThis as typeof globalThis & { __crmMemory?: Memory };

function memoryStore(): CrmStore {
  if (!globalMemory.__crmMemory) {
    globalMemory.__crmMemory = {
      prospects: new Map(demoProspects().map((prospect) => [prospect.id, prospect])),
      refs: new Set(),
    };
  }

  const memory = globalMemory.__crmMemory;

  return {
    kind: 'memoire',
    async list() {
      return [...memory.prospects.values()];
    },
    async get(id) {
      return memory.prospects.get(id) ?? null;
    },
    async insert(items) {
      for (const { prospect, sourceRef } of items) {
        if (sourceRef && memory.refs.has(sourceRef)) continue;
        if (sourceRef) memory.refs.add(sourceRef);
        memory.prospects.set(prospect.id, prospect);
      }
    },
    async existingRefs(refs) {
      return new Set(refs.filter((ref) => memory.refs.has(ref)));
    },
    async update(prospect) {
      memory.prospects.set(prospect.id, prospect);
    },
    async remove(id) {
      memory.prospects.delete(id);
    },
  };
}

export function getCrmStore(): CrmStore {
  const store = supabaseStore();

  if (store) return store;

  if (process.env.NODE_ENV === 'production') {
    throw new CrmStoreError(
      'Supabase n’est pas configuré (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).',
    );
  }

  return memoryStore();
}
