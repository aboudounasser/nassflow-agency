import type { SupabaseClient } from '@supabase/supabase-js';
import {
  NON_BILLED_STATUSES,
  type GenerationPatch,
  type GenerationRecord,
  type GenerationStore,
} from './tracking';

/**
 * Le suivi des générations dans Supabase, table
 * `higgsfield_generations` (schéma : supabase/higgsfield_generations.sql).
 *
 * La table a RLS sans policy : seule la clé service_role y accède, donc
 * ce module ne tourne que côté serveur, avec le client de
 * `lib/supabase/admin.ts`.
 */

const TABLE = 'higgsfield_generations';

type Row = {
  id: string;
  created_at: string;
  endpoint: string;
  status: GenerationRecord['status'];
  dry_run: boolean;
  request_id: string | null;
  estimated_credits: number | null;
  source: string | null;
  metadata: Record<string, unknown>;
  input: Record<string, unknown>;
  image_urls: string[];
  video_url: string | null;
  error_code: string | null;
  error_message: string | null;
  completed_at: string | null;
};

function toRow(record: GenerationRecord): Row {
  return {
    id: record.id,
    created_at: record.createdAt,
    endpoint: record.endpoint,
    status: record.status,
    dry_run: record.dryRun,
    request_id: record.requestId,
    estimated_credits: record.estimatedCredits,
    source: record.source,
    metadata: record.metadata,
    input: record.input,
    image_urls: record.imageUrls,
    video_url: record.videoUrl,
    error_code: record.errorCode,
    error_message: record.errorMessage,
    completed_at: record.completedAt,
  };
}

function fromRow(row: Row): GenerationRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    endpoint: row.endpoint,
    status: row.status,
    dryRun: row.dry_run,
    requestId: row.request_id,
    estimatedCredits: row.estimated_credits === null ? null : Number(row.estimated_credits),
    source: row.source,
    metadata: row.metadata ?? {},
    input: row.input ?? {},
    imageUrls: row.image_urls ?? [],
    videoUrl: row.video_url,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    completedAt: row.completed_at,
  };
}

const PATCH_COLUMNS: Record<keyof GenerationPatch, keyof Row> = {
  status: 'status',
  requestId: 'request_id',
  imageUrls: 'image_urls',
  videoUrl: 'video_url',
  errorCode: 'error_code',
  errorMessage: 'error_message',
  completedAt: 'completed_at',
};

export function createSupabaseGenerationStore(supabase: SupabaseClient): GenerationStore {
  return {
    async create(record) {
      const { error } = await supabase.from(TABLE).insert(toRow(record));
      if (error) throw new Error(`Supabase (${TABLE}) : ${error.message}`);
    },

    async update(id, patch) {
      const values: Record<string, unknown> = { updated_at: new Date().toISOString() };

      for (const [key, column] of Object.entries(PATCH_COLUMNS)) {
        const value = patch[key as keyof GenerationPatch];
        if (value !== undefined) values[column] = value;
      }

      const { error } = await supabase.from(TABLE).update(values).eq('id', id);
      if (error) throw new Error(`Supabase (${TABLE}) : ${error.message}`);
    },

    async findByRequestId(requestId) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('request_id', requestId)
        .maybeSingle<Row>();

      if (error) throw new Error(`Supabase (${TABLE}) : ${error.message}`);

      return data ? fromRow(data) : null;
    },

    async sumEstimatedCreditsSince(since) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('estimated_credits')
        .eq('dry_run', false)
        .not('status', 'in', `(${[...NON_BILLED_STATUSES].join(',')})`)
        .gte('created_at', since.toISOString());

      if (error) throw new Error(`Supabase (${TABLE}) : ${error.message}`);

      return (data ?? []).reduce(
        (total, row) => total + Number(row.estimated_credits ?? 0),
        0,
      );
    },
  };
}
