// Postgres data layer for Mo's Yard. Provider-agnostic: point DATABASE_URL at
// any Postgres (Neon, Supabase, Railway, …). Used both by the public API routes
// (to log every submission) and by the /admin dashboard (to read + manage them).
//
// Best-effort for writes: if DATABASE_URL is unset or a write fails, the public
// routes still succeed — a logging outage must never block a customer.
//
// Required env to switch it on (set in Netlify):
//   DATABASE_URL     e.g. postgres://user:pass@host/db?sslmode=require
//   DATABASE_SSL     set to "disable" only for a local non-SSL Postgres

import postgres from 'postgres';
import { randomUUID } from 'crypto';
import { env } from './env';

export type SubmissionType = 'enquiry' | 'booking' | 'order' | 'quote';
export type SubmissionStatus =
  | 'new'
  | 'in_progress'
  | 'scheduled'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export const STATUSES: SubmissionStatus[] = [
  'new',
  'in_progress',
  'scheduled',
  'delivered',
  'completed',
  'cancelled',
];

export interface SubmissionInput {
  reference: string;
  type: SubmissionType;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  summary?: string | null;
  amountCents?: number | null;
  fulfillment?: string | null;
  details?: Record<string, unknown>;
}

export interface SubmissionRow {
  id: string;
  reference: string;
  type: SubmissionType;
  status: SubmissionStatus;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  summary: string | null;
  amount_cents: number | null;
  fulfillment: string | null;
  details: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

type Sql = ReturnType<typeof postgres>;

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

/** Returns a lazily-created client, or null when no database is configured. */
export function getSql(): Sql | null {
  const url = env('DATABASE_URL');
  if (!url) return null;
  if (!client) {
    client = postgres(url, {
      ssl: env('DATABASE_SSL') === 'disable' ? false : 'require',
      max: 1, // serverless: keep the pool tiny
      idle_timeout: 20,
      connect_timeout: 15,
      prepare: false, // compatible with transaction poolers (PgBouncer/Supabase)
    });
  }
  return client;
}

/** Idempotently create the table + indexes. Runs once per warm instance. */
function ready(sql: Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id            text PRIMARY KEY,
          reference     text NOT NULL,
          type          text NOT NULL,
          status        text NOT NULL DEFAULT 'new',
          name          text,
          email         text,
          phone         text,
          company       text,
          summary       text,
          amount_cents  integer,
          fulfillment   text,
          details       jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_at    timestamptz NOT NULL DEFAULT now(),
          updated_at    timestamptz NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS submissions_created_idx ON submissions (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS submissions_type_status_idx ON submissions (type, status)`;
    })().catch((err) => {
      schemaReady = null; // let a later call retry
      throw err;
    });
  }
  return schemaReady;
}

export async function recordSubmission(
  input: SubmissionInput
): Promise<{ saved: boolean; id?: string; error?: string }> {
  const sql = getSql();
  if (!sql) return { saved: false, error: 'no_database' };
  try {
    await ready(sql);
    const id = randomUUID();
    await sql`
      INSERT INTO submissions
        (id, reference, type, name, email, phone, company, summary, amount_cents, fulfillment, details)
      VALUES
        (${id}, ${input.reference}, ${input.type}, ${input.name ?? null}, ${input.email ?? null},
         ${input.phone ?? null}, ${input.company ?? null}, ${input.summary ?? null},
         ${input.amountCents ?? null}, ${input.fulfillment ?? null}, ${sql.json((input.details ?? {}) as never)})`;
    return { saved: true, id };
  } catch (err) {
    console.error('[db] recordSubmission failed', err);
    return { saved: false, error: 'exception' };
  }
}

/** null return = database not configured (distinct from an empty list). */
export async function listSubmissions(opts: {
  type?: string;
  status?: string;
} = {}): Promise<SubmissionRow[] | null> {
  const sql = getSql();
  if (!sql) return null;
  await ready(sql);
  const type = opts.type && opts.type !== 'all' ? opts.type : null;
  const status = opts.status && opts.status !== 'all' ? opts.status : null;
  const rows = await sql<SubmissionRow[]>`
    SELECT * FROM submissions
    WHERE (${type}::text IS NULL OR type = ${type})
      AND (${status}::text IS NULL OR status = ${status})
    ORDER BY created_at DESC
    LIMIT 500`;
  return rows;
}

export async function countsByStatus(): Promise<Record<string, number> | null> {
  const sql = getSql();
  if (!sql) return null;
  await ready(sql);
  const rows = await sql<{ status: string; n: string }[]>`
    SELECT status, COUNT(*)::text AS n FROM submissions GROUP BY status`;
  const out: Record<string, number> = {};
  for (const r of rows) out[r.status] = Number(r.n);
  return out;
}

export async function updateStatus(
  id: string,
  status: SubmissionStatus
): Promise<{ ok: boolean; error?: string }> {
  const sql = getSql();
  if (!sql) return { ok: false, error: 'no_database' };
  try {
    await ready(sql);
    const rows = await sql`
      UPDATE submissions SET status = ${status}, updated_at = now()
      WHERE id = ${id} RETURNING id`;
    return { ok: rows.length > 0 };
  } catch (err) {
    console.error('[db] updateStatus failed', err);
    return { ok: false, error: 'exception' };
  }
}
