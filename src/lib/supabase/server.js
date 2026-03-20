/**
 * All server-side database access goes through Supabase JS.
 * Configure the root `.env` file:
 * - SUPABASE_URL + SUPABASE_KEY (anon) + SUPABASE_SERVICE_KEY (service role)
 * - DATABASE_URL is optional here for direct Postgres (migrations, psql); the app uses HTTP via Supabase.
 */
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const SCHEMA = 'DRGASHAW';

/** Postgres connection string from `.env` (tools/scripts only; not used by createClient). */
export function getDatabaseUrl() {
  return env.DATABASE_URL || process.env.DATABASE_URL || '';
}

/** Resolve URL: prefers SvelteKit public name, then .env-style SUPABASE_URL */
function getSupabaseUrl() {
  return (
    env.PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    process.env.PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  );
}

/** Service role: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY from .env */
function getSupabaseServiceRoleKey() {
  return (
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ''
  );
}

/** Anon key: PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY from .env */
function getSupabaseAnonKey() {
  return (
    env.PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_KEY ||
    process.env.PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    ''
  );
}

export function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema: SCHEMA }
  });
}

export function getSupabasePublic() {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false },
    db: { schema: SCHEMA }
  });
}
