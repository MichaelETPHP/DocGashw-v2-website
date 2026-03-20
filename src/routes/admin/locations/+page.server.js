import { getSupabaseAdmin } from '$lib/supabase/server.js';

const TABLE = 'hospital_locations';

export async function load() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { locations: [] };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, type, role, description, address, working_hours, display_order, is_active, created_at, updated_at')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Supabase locations list error:', error);
    return { locations: [] };
  }

  const locations = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    role: row.role,
    description: row.description,
    address: row.address,
    working_hours: row.working_hours,
    display_order: row.display_order,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));

  return { locations };
}
