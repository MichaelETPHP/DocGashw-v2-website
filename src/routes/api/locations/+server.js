import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';
import { getSupabaseAdmin, getSupabasePublic } from '$lib/supabase/server.js';

const TABLE = 'hospital_locations';

export async function GET() {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return json({ locations: [] });
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, type, role, description, address, working_hours, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Supabase locations list error:', error);
    return json({ locations: [] });
  }
  const locations = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    role: row.role,
    description: row.description,
    address: row.address,
    hours: row.working_hours,
    display_order: row.display_order
  }));
  return json({ locations });
}

export async function POST({ request, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, type, role, description, address, working_hours, display_order } = body || {};

  if (!name || !address || !working_hours) {
    return json({ error: 'Name, address, and working hours are required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json(
      {
        error:
          'Database not configured. Set SUPABASE_URL + SUPABASE_SERVICE_KEY in .env.'
      },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name,
      type: type || 'Public Hospital',
      role: role || 'Consultant',
      description: description || '',
      address,
      working_hours,
      display_order: display_order ?? 0,
      is_active: true
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase locations insert error:', error);
    return json({ error: 'Failed to create location.' }, { status: 500 });
  }

  return json({ ok: true, id: data?.id });
}
