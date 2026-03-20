import { json } from '@sveltejs/kit';
import { getSupabaseAdmin } from '$lib/supabase/server.js';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const url = env.SUPABASE_URL || env.PUBLIC_SUPABASE_URL || '';
    const key = env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return json({
        ok: false,
        database: 'not_configured',
        message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env'
      }, { status: 503 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return json({
        ok: false,
        database: 'not_configured',
        message: 'Could not create Supabase client. Check .env variables.'
      }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      const msg = error.message || 'Database error';
      const hint = getErrorHint(error);
      return json({
        ok: false,
        database: 'disconnected',
        message: msg,
        hint
      }, { status: 503 });
    }

    return json({
      ok: true,
      database: 'connected',
      message: 'Database connected successfully'
    });
  } catch (err) {
    return json({
      ok: false,
      database: 'error',
      message: err?.message || 'Unknown error',
      hint: 'Check SUPABASE_URL (e.g. http://db.selamdelivery.xyz) is reachable and DRGASHAW schema exists.'
    }, { status: 503 });
  }
}

function getErrorHint(error) {
  const msg = (error.message || '').toLowerCase();
  if (msg.includes('relation') && msg.includes('does not exist')) {
    return 'Run SETUP_COMPLETE.sql in Supabase SQL Editor to create DRGASHAW schema and users table.';
  }
  if (msg.includes('schema') || msg.includes('permission')) {
    return 'Add DRGASHAW to exposed schemas: Supabase Dashboard → Settings → API → Schema.';
  }
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('econnrefused')) {
    return 'Cannot reach database. Check SUPABASE_URL and network/firewall.';
  }
  return null;
}
