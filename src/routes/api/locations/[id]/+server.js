import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';
import { getSupabaseAdmin } from '$lib/supabase/server.js';

const TABLE = 'hospital_locations';

export async function PUT({ params, request, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  if (!id) return json({ error: 'ID required' }, { status: 400 });

  const body = await request.json();
  const { name, type, role, description, address, working_hours, display_order, is_active } = body || {};

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ error: 'Database not configured' }, { status: 503 });
  }

  const updateData = { updated_at: new Date().toISOString() };
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (role !== undefined) updateData.role = role;
  if (description !== undefined) updateData.description = description;
  if (address !== undefined) updateData.address = address;
  if (working_hours !== undefined) updateData.working_hours = working_hours;
  if (display_order !== undefined) updateData.display_order = display_order;
  if (is_active !== undefined) updateData.is_active = is_active;

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq('id', id)
    .select('id')
    .single();

  if (error) {
    console.error('Supabase locations update error:', error);
    return json({ error: 'Failed to update location.' }, { status: 500 });
  }

  return json({ ok: true, id: data?.id });
}

export async function DELETE({ params, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  if (!id) return json({ error: 'ID required' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ error: 'Database not configured' }, { status: 503 });
  }

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase locations delete error:', error);
    return json({ error: 'Failed to delete location.' }, { status: 500 });
  }

  return json({ ok: true });
}
