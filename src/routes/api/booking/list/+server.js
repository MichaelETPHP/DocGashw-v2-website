
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    await fs.mkdir(path.dirname(BOOKINGS_FILE), { recursive: true });
    
    let bookings = [];
    try {
      const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
      bookings = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      if (error.code !== 'ENOENT') throw error;
    }
    
    return json({ bookings });
  } catch (error) {
    console.error('Error reading bookings:', error);
    return json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
