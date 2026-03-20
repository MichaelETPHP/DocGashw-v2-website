import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '$lib/supabase/server.js';
import { createSession, validateSession, destroySession, getSessionCookieName } from './session.js';

const USERS_TABLE = 'users';
const SALT_ROUNDS = 12;

/**
 * Authenticate user against the users table
 * @param {string} login - email or username
 * @param {string} password - plain text password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function authenticateUser(login, password) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      success: false,
      error:
        'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in `.env` (see .env.example).'
    };
  }

  const loginTrimmed = String(login || '').trim();
  if (!loginTrimmed) {
    return { success: false, error: 'Invalid credentials' };
  }

  let user = null;
  let err = null;
  const select = 'id, email, username, password_hash, full_name, role, is_active';

  const byEmail = await supabase.from(USERS_TABLE).select(select).eq('email', loginTrimmed).maybeSingle();
  if (byEmail.data) {
    user = byEmail.data;
  } else {
    const byUsername = await supabase.from(USERS_TABLE).select(select).eq('username', loginTrimmed).maybeSingle();
    user = byUsername.data;
    err = byUsername.error;
  }

  if (err || !user) {
    return { success: false, error: 'Invalid credentials' };
  }

  if (!user.is_active) {
    return { success: false, error: 'Account is deactivated' };
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Update last_login
  await supabase
    .from(USERS_TABLE)
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    }
  };
}

/**
 * Get user by session token
 * @param {string} token - session token
 * @returns {object|null} user object or null
 */
export function getUserFromSession(token) {
  return validateSession(token);
}

/**
 * Check if user has required role
 * @param {string} role - user's role
 * @param {string[]} allowedRoles - roles that are allowed
 * @returns {boolean}
 */
export function hasRole(role, allowedRoles) {
  return allowedRoles.includes(role);
}

/**
 * Check if user is admin or super_admin
 * @param {object} user - user object
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user && ['admin', 'super_admin'].includes(user.role);
}

/**
 * Check if user is super_admin
 * @param {object} user - user object
 * @returns {boolean}
 */
export function isSuperAdmin(user) {
  return user && user.role === 'super_admin';
}

/**
 * Hash a password
 * @param {string} password - plain text password
 * @returns {Promise<string>} hashed password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export { createSession, validateSession, destroySession, getSessionCookieName };
