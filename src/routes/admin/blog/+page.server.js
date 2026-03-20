import { getSupabaseAdmin } from '$lib/supabase/server.js';

const TABLE = 'blog_posts';

export async function load() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { posts: [] };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, body, category, image_url, is_published, published_at, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase list error:', error);
    return { posts: [] };
  }

  const posts = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    image_url: row.image_url,
    is_published: row.is_published,
    date: row.published_at || row.created_at,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));

  return { posts };
}
