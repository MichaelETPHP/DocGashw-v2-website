import { json } from '@sveltejs/kit';
import { authenticateUser, createSession, getSessionCookieName } from '$lib/auth/auth.js';
import { validateSession } from '$lib/auth/session.js';

export async function POST({ request, cookies }) {
  const body = await request.json();
  const { login, password } = body || {};

  if (!login || !password) {
    return json({ ok: false, error: 'Username/email and password are required' }, { status: 400 });
  }

  const result = await authenticateUser(login, password);

  if (!result.success) {
    return json({ ok: false, error: result.error }, { status: 401 });
  }

  const token = createSession(result.user);
  cookies.set(getSessionCookieName(), token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production'
  });

  return json({
    ok: true,
    redirect: '/admin',
    user: {
      username: result.user.username,
      full_name: result.user.full_name,
      role: result.user.role
    }
  });
}

export async function GET({ cookies }) {
  const token = cookies.get(getSessionCookieName());
  const user = validateSession(token);
  if (user) {
    return json({ ok: true, authenticated: true, user });
  }
  return json({ ok: true, authenticated: false });
}
