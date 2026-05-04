import { error } from '@sveltejs/kit';

export async function GET({ url }) {
  const imageUrl = url.searchParams.get('url');
  
  if (!imageUrl) {
    throw error(400, 'Missing image URL');
  }

  // Basic security: only proxy images from the allowed storage domain
  if (!imageUrl.includes('db.selamdelivery.xyz')) {
    throw error(403, 'Unauthorized domain');
  }

  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw error(response.status, 'Failed to fetch image');
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (e) {
    console.error('Image proxy error:', e);
    throw error(500, 'Internal server error');
  }
}
