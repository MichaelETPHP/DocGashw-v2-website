import { env } from '$env/dynamic/private';
import crypto from 'crypto';

const ADMIN_SESSION_COOKIE = 'admin_session';
const FALLBACK_SECRET = 'drgashaw-dev-secret-change-in-production';

function getSecret() {
  try {
    return env?.SESSION_SECRET || env?.SECRET_KEY || process.env.SESSION_SECRET || process.env.SECRET_KEY || FALLBACK_SECRET;
  } catch {
    return FALLBACK_SECRET;
  }
}

export function getSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

/**
 * Sign payload with HMAC
 */
function sign(payload) {
  const secret = getSecret();
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/**
 * Verify and decode signed payload
 */
function unsign(token) {
  if (!token || typeof token !== 'string') return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const secret = getSecret();
  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Create a new session with user data (stored in signed cookie, survives server restart)
 * @param {object} user - user object to store with session
 * @returns {string} signed session token
 */
export function createSession(user = null) {
  if (!user) return '';
  return sign({ user, createdAt: Date.now() });
}

/**
 * Validate a session token and return user data
 * @param {string} token - signed session token
 * @returns {object|null} user data or null
 */
export function validateSession(token) {
  if (!token) return null;
  const payload = unsign(token);
  if (!payload || !payload.user) return null;
  return payload.user;
}

/**
 * Get full session data
 * @param {string} token - session token
 * @returns {object|null} session data or null
 */
export function getSession(token) {
  if (!token) return null;
  return unsign(token);
}

/**
 * Destroy a session (client must clear cookie)
 * @param {string} token - session token
 */
export function destroySession(token) {
  // No-op: signed cookies are stateless; logout clears the cookie
}
