
import { json } from '@sveltejs/kit';
import { sendBookingConfirmation } from '$lib/utils/sendEmail.js';
import fs from 'fs/promises';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const booking = await request.json();
    
    // Validate required fields
    const requiredFields = ['patientName', 'email', 'phone', 'service', 'date', 'timeSlot'];
    const missingFields = requiredFields.filter(field => !booking[field]);
    
    if (missingFields.length > 0) {
      return json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Create data directory if it doesn't exist
    await fs.mkdir(path.dirname(BOOKINGS_FILE), { recursive: true });
    
    // Read existing bookings
    let bookings = [];
    try {
      const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
      bookings = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    
    // Check for duplicate booking
    const isDuplicate = bookings.some(b => 
      b.date === booking.date && 
      b.timeSlot === booking.timeSlot
    );
    
    if (isDuplicate) {
      return json({
        success: false,
        message: 'This time slot is already booked'
      }, { status: 409 });
    }
    
    // Add new booking
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    
    // Save to file
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    // Send email notifications
    await sendBookingConfirmation(newBooking);
    
    return json({
      success: true,
      message: 'Booking request received. We will contact you to confirm your appointment.'
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    return json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    }, { status: 500 });
  }
}
