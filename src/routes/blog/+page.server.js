import { getSupabasePublic } from '$lib/supabase/server.js';

const TABLE = 'blog_posts';

export async function load() {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return { posts: [] };
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, body, category, image_url, published_at, created_at')
    .order('published_at', { ascending: false });
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
    image_url: row.image_url ? 
      (row.image_url.includes('db.selamdelivery.xyz') ? `/api/proxy/image?url=${encodeURIComponent(row.image_url.replace('https://', 'http://'))}` : row.image_url) 
      : null,
    date: row.published_at || row.created_at
  }));
  return { posts };
}
