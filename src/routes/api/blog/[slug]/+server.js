import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';
import { getSupabaseAdmin, getSupabasePublic } from '$lib/supabase/server.js';

const TABLE = 'blog_posts';

export async function GET({ params }) {
  const slug = params.slug;
  if (!slug) return json({ error: 'Slug required' }, { status: 400 });

  const supabase = getSupabasePublic();
  if (!supabase) {
    return json({ post: null });
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, body, category, image_url, published_at, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Supabase get error:', error);
    return json({ post: null });
  }

  if (!data) {
    return json({ post: null });
  }

  const post = {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    image_url: data.image_url ? 
      (data.image_url.includes('db.selamdelivery.xyz') ? `/api/proxy/image?url=${encodeURIComponent(data.image_url.replace('https://', 'http://'))}` : data.image_url) 
      : null,
    date: data.published_at || data.created_at,
    published_at: data.published_at,
    created_at: data.created_at
  };

  return json({ post });
}

export async function PUT({ params, request, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = params.slug;
  if (!slug) return json({ error: 'Slug required' }, { status: 400 });

  const body = await request.json();
  const { title, slug: newSlug, excerpt, body: content, category, image_url, images, is_published } = body || {};

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ error: 'Database not configured' }, { status: 503 });
  }

  const updateData = { updated_at: new Date().toISOString() };
  if (title !== undefined) updateData.title = title;
  if (newSlug !== undefined) updateData.slug = newSlug;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (content !== undefined) updateData.body = content;
  if (category !== undefined) updateData.category = category;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (images !== undefined) updateData.images = images;
  if (is_published !== undefined) {
    updateData.is_published = is_published;
    if (is_published) updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq('slug', slug)
    .select('id, slug')
    .single();

  if (error) {
    if (error.code === '23505') return json({ error: 'A post with this slug already exists.' }, { status: 400 });
    console.error('Supabase update error:', error);
    return json({ error: 'Failed to update post.' }, { status: 500 });
  }

  return json({ ok: true, id: data?.id, slug: data?.slug });
}

export async function DELETE({ params, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = params.slug;
  if (!slug) return json({ error: 'Slug required' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ error: 'Database not configured' }, { status: 503 });
  }

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('Supabase delete error:', error);
    return json({ error: 'Failed to delete post.' }, { status: 500 });
  }

  return json({ ok: true });
}
