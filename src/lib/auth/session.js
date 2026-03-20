const ADMIN_SESSION_COOKIE = 'admin_session';
const sessions = new Map();

export function getSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

/**
 * Create a new session with user data
 * @param {object} user - user object to store with session
 * @returns {string} session token
 */
export function createSession(user = null) {
  const token = crypto.randomUUID();
  sessions.set(token, {
    token,
    user,
    createdAt: Date.now()
  });
  return token;
}

/**
 * Validate a session token and return user data
 * @param {string} token - session token
 * @returns {object|null} user data or null
 */
export function validateSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  return session.user;
}

/**
 * Get full session data
 * @param {string} token - session token
 * @returns {object|null} session data or null
 */
export function getSession(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}

/**
 * Destroy a session
 * @param {string} token - session token
 */
export function destroySession(token) {
  if (token) sessions.delete(token);
}
