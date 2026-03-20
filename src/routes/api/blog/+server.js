import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';
import { getSupabaseAdmin, getSupabasePublic } from '$lib/supabase/server.js';

const TABLE = 'blog_posts';

export async function GET() {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return json({ posts: [] });
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, body, category, image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) {
    console.error('Supabase list error:', error);
    return json({ posts: [] });
  }
  const posts = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    image_url: row.image_url,
    date: row.published_at || row.created_at,
    published_at: row.published_at,
    created_at: row.created_at
  }));
  return json({ posts });
}

export async function POST({ request, cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, body: content, category, image_url } = body || {};

  if (!title || !slug || !excerpt) {
    return json({ error: 'Title, slug, and excerpt are required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json(
      {
        error:
          'Database not configured. Set SUPABASE_URL + SUPABASE_SERVICE_KEY (or PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) in .env.'
      },
      { status: 503 }
    );
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title,
      slug,
      excerpt,
      body: content || '',
      category: category || 'Research',
      image_url: image_url || null,
      author_id: user.id,
      is_published: true,
      published_at: now,
      created_at: now,
      updated_at: now
    })
    .select('id, slug')
    .single();

  if (error) {
    if (error.code === '23505') return json({ error: 'A post with this slug already exists.' }, { status: 400 });
    console.error('Supabase insert error:', error);
    return json({ error: 'Failed to create post.' }, { status: 500 });
  }

  return json({ ok: true, id: data?.id, slug: data?.slug });
}
