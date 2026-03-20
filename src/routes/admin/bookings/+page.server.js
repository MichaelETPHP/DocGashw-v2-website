import { redirect } from '@sveltejs/kit';

/** Bookings hidden for v2 - redirect to dashboard */
export function load() {
  throw redirect(302, '/admin');
}
