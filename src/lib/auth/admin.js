import { getSessionCookieName, validateSession } from '$lib/auth/session.js';

/**
 * Require admin or super_admin role
 * @param {object} cookies - SvelteKit cookies
 * @returns {object|null} user object if authorized, null otherwise
 */
export function requireAdmin(cookies) {
  const token = cookies.get(getSessionCookieName());
  const user = validateSession(token);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return null;
  }
  return user;
}

/**
 * Require super_admin role
 * @param {object} cookies - SvelteKit cookies
 * @returns {object|null} user object if authorized, null otherwise
 */
export function requireSuperAdmin(cookies) {
  const token = cookies.get(getSessionCookieName());
  const user = validateSession(token);
  if (!user || user.role !== 'super_admin') {
    return null;
  }
  return user;
}

/**
 * Require any authenticated user
 * @param {object} cookies - SvelteKit cookies
 * @returns {object|null} user object if authorized, null otherwise
 */
export function requireAuth(cookies) {
  const token = cookies.get(getSessionCookieName());
  return validateSession(token);
}
