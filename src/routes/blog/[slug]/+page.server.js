import { getSupabasePublic } from '$lib/supabase/server.js';

const TABLE = 'blog_posts';

export async function load({ params }) {
  const slug = params.slug;
  if (!slug) return { post: null };

  const supabase = getSupabasePublic();
  if (!supabase) {
    return { post: null };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, body, category, image_url, images, published_at, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) {
    return { post: null };
  }

  return {
    post: {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: data.body,
      category: data.category,
      image_url: data.image_url,
      images: data.images || [],
      date: data.published_at || data.created_at
    }
  };
}
