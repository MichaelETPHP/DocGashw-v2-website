import { json } from '@sveltejs/kit';
import { getSessionCookieName, destroySession } from '$lib/auth/session.js';

export async function POST({ cookies }) {
  const token = cookies.get(getSessionCookieName());
  if (token) destroySession(token);
  cookies.delete(getSessionCookieName(), { path: '/' });
  return json({ ok: true });
}
