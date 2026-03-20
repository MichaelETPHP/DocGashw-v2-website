import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/admin.js';

export function load({ cookies }) {
  const user = requireAdmin(cookies);
  if (!user) {
    throw redirect(302, '/login');
  }
  return { user };
}
