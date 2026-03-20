<script>
  import { onMount } from 'svelte';

  let form = {
    patientName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    timeSlot: '',
    isZoomConsultation: false,
    message: ''
  };

  let status = {
    submitting: false,
    success: false,
    error: null
  };

  let availableTimeSlots = [];
  let bookedSlots = new Set(); // In real app, fetch from backend

  const services = [
    'Initial Consultation',
    'Follow-up Appointment',
    'Zoom Consultation',
    'Chemotherapy Plan Review',
    'Diagnostic Consultation',
    'Second Opinion'
  ];

  function generateTimeSlots() {
    const slots = [];
    const start = 9; // 9 AM
    const end = 17; // 5 PM

    for (let hour = start; hour < end; hour++) {
      // Two 30-minute slots per hour
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots.filter(slot => !bookedSlots.has(slot));
  }

  $: {
    if (form.date) {
      availableTimeSlots = generateTimeSlots();
    }
  }

  let today = '';
  onMount(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    today = `${year}-${month}-${day}`;
  });

  async function handleSubmit() {
    status.submitting = true;
    status.success = false;
    status.error = null;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        status.success = true;
        form = {
          patientName: '',
          email: '',
          phone: '',
          service: '',
          date: '',
          timeSlot: '',
          isZoomConsultation: false,
          message: ''
        };
      } else {
        status.error = result.message || 'An error occurred while processing your request.';
      }
    } catch (error) {
      console.error('Booking form error:', error);
      status.error = 'An unexpected error occurred. Please try again later.';
    } finally {
      status.submitting = false;
    }
  }
</script>

<div class="bg-white rounded-xl shadow-lg p-8">
  <div class="flex items-center space-x-4 mb-8">
    <img src="/images/dr-gasah-profile.jpg" alt="Dr. Gashaw Arega" class="w-16 h-16 rounded-full ring-4 ring-blue-100"/>
    <div>
      <h3 class="text-2xl font-semibold text-blue-900">Book an Appointment</h3>
      <p class="text-blue-600">30-minute consultation slots available</p>
    </div>
  </div>

  {#if status.success}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p class="text-gray-600 mb-6">
            Thank you for booking an appointment. We'll send you an email with all the details
            {#if form.isZoomConsultation}including the Zoom meeting link{/if}.
          </p>
          <div class="space-y-3">
            <button 
              class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              on:click={() => status.success = false}
            >
              Book Another Appointment
            </button>
            <button 
              class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              on:click={() => window.location.href = '/admin/bookings'}
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
          <input
            type="text"
            bind:value={form.patientName}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            bind:value={form.email}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
        <select
          id="serviceType"
          bind:value={form.service}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-required="true"
        >
          <option value="">Select a service</option>
          {#each services as service}
            <option value={service}>{service}</option>
          {/each}
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
          <input
            type="date"
            bind:value={form.date}
            min={today}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Available Time Slots *</label>
          <select
            bind:value={form.timeSlot}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a time slot</option>
            {#each availableTimeSlots as slot}
              <option value={slot}>{slot} (30 min)</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg">
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={form.isZoomConsultation}
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-blue-900">I prefer a Zoom video consultation</span>
        </label>
        {#if form.isZoomConsultation}
          <p class="text-sm text-blue-600 mt-2">
            You'll receive the Zoom meeting link via email after booking confirmation
          </p>
        {/if}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea
          bind:value={form.message}
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        disabled={status.submitting}
      >
        {#if status.submitting}
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Schedule Appointment</span>
        {/if}
      </button>

      <p class="text-sm text-gray-500 mt-4">
        * Required fields. Each appointment slot is 30 minutes.
      </p>
    </form>
  {/if}
</div>