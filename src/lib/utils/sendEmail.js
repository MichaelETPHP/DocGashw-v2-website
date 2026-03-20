import sgMail from '@sendgrid/mail';
import { env } from '$env/dynamic/private';

function getSendgridApiKey() {
  return env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY || '';
}

/**
 * Send an email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} options.html - HTML email content
 * @returns {Promise<boolean>} - Success status
 */
export async function sendEmail(options) {
  try {
    const apiKey = getSendgridApiKey();
    if (!apiKey) {
      console.error('SendGrid: set SENDGRID_API_KEY in .env');
      return false;
    }
    sgMail.setApiKey(apiKey);

    // Default sender email is contact@drgasah.com
    const msg = {
      to: options.to,
      from: 'michaeltaye012@gmail.com', // Use your verified sender
      subject: options.subject,
      text: options.text,
      html: options.html || options.text // Fall back to text if HTML not provided
    };

    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

/**
 * Send a booking confirmation email
 * @param {Object} booking - Booking details
 * @returns {Promise<boolean>} - Success status
 */
export async function sendBookingConfirmation(booking) {
  const subject = `Appointment Request: ${booking.patientName} for ${booking.service}`;
  
  // HTML email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background-color: #f87171; width: 40px; height: 40px; border-radius: 50%; margin-bottom: 10px;">
          <!-- Heart logo representation -->
        </div>
        <h1 style="margin: 0; font-size: 24px; color: #1e40af;">Dr. Gashaw Arega</h1>
        <p style="margin: 5px 0 0; color: #6b7280;">Pediatric Hematology Oncologist</p>
      </div>
    
      <div style="background-color: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; position: relative;">
        <h2 style="margin: 0; font-size: 20px;">New Appointment Request</h2>
        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 50px; height: 3px; background-color: #f87171;"></div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e5e7eb;">
        <div style="background-color: #ebf5ff; border: 1px solid #dbeafe; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 30px; height: 30px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: #2563eb; font-weight: bold;">i</span>
            </div>
            <p style="margin: 0; font-weight: bold; color: #1e40af;">Appointment Details</p>
          </div>
          <p style="margin: 0; color: #4b5563;">The following patient has requested an appointment with Dr. Gashaw Arega.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold; width: 40%;">Patient Name:</td>
            <td style="padding: 10px 0;">${booking.patientName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0;">${booking.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0;">${booking.phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold;">Service Requested:</td>
            <td style="padding: 10px 0;">${booking.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold;">Preferred Date:</td>
            <td style="padding: 10px 0;">${booking.date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; font-weight: bold;">Preferred Time:</td>
            <td style="padding: 10px 0;">${booking.time}</td>
          </tr>
          ${booking.message ? `
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Additional Message:</td>
            <td style="padding: 10px 0;">${booking.message}</td>
          </tr>` : ''}
        </table>
        
        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-weight: bold;">Action Required:</p>
          <p style="margin: 5px 0 0;">Please contact the patient to confirm this appointment request.</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">Dr. Gashaw Arega | Pediatric Hematology Oncologist</p>
        <p style="margin: 5px 0 0;">Black Lion Hospital & Betzata Private Clinic, Ethiopia</p>
      </div>
    </div>
  `;
  
  // Plain text version
  const textContent = `
    DR. GASAH A - PEDIATRIC HEMATOLOGY ONCOLOGIST
    =============================================
    
    NEW APPOINTMENT REQUEST
    
    APPOINTMENT DETAILS:
    -------------------
    Patient Name: ${booking.patientName}
    Email: ${booking.email}
    Phone: ${booking.phone}
    Service Requested: ${booking.service}
    Preferred Date: ${booking.date}
    Preferred Time: ${booking.time}
    ${booking.message ? `\nAdditional Message: ${booking.message}` : ''}
    
    ACTION REQUIRED:
    --------------
    Please contact the patient to confirm this appointment request.
    
    --
    Dr. Gashaw Arega | Pediatric Hematology Oncologist
    Black Lion Hospital & Betzata Private Clinic, Ethiopia
  `;
  
  return sendEmail({
    to: 'michaeltaye012@gmail.com', // Replace with your actual email
    subject,
    text: textContent,
    html: htmlContent
  });
}