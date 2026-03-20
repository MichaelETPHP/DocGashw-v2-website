/**
 * Chrome DevTools requests this file when DevTools is open.
 * Return empty JSON to avoid 404 noise in the terminal.
 */
export function GET() {
  return new Response('{}', {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}
