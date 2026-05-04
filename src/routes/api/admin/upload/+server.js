import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';
import { getSupabaseAdmin } from '$lib/supabase/server.js';

export async function POST({ request, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return json({ error: 'No file uploaded' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ error: 'Database connection failed' }, { status: 503 });
  }

  const bucket = 'GashwIMAGE';
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `blog/${fileName}`;

  // Convert File to ArrayBuffer for Supabase upload
  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    return json({ error: 'Failed to upload image' }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return json({ url: publicUrl });
}
