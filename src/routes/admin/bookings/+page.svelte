<script>
  import { onMount } from 'svelte';
  let bookings = [];
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/booking/list');
      const data = await res.json();
      bookings = (data.bookings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Bookings – Admin</title>
</svelte:head>

<div class="bookings-admin">
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">Appointments</h1>
      <p class="page-subtitle">Manage patient booking requests</p>
    </div>
    <div class="header-stats">
      <div class="stat-pill">
        <span class="stat-number">{bookings.length}</span>
        <span class="stat-text">Total</span>
      </div>
      <div class="stat-pill pending">
        <span class="stat-number">{bookings.filter(b => b.status === 'pending').length}</span>
        <span class="stat-text">Pending</span>
      </div>
      <div class="stat-pill confirmed">
        <span class="stat-number">{bookings.filter(b => b.status === 'confirmed').length}</span>
        <span class="stat-text">Confirmed</span>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Loading appointments...</span>
    </div>
  {:else if bookings.length === 0}
    <div class="empty-state">
      <svg viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#f1f5f9" />
        <path d="M16 18h16M16 24h12M16 30h8" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
      </svg>
      <h3>No appointments yet</h3>
      <p>Patient booking requests will appear here</p>
    </div>
  {:else}
    <div class="bookings-table-wrapper">
      <table class="bookings-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Service</th>
            <th>Appointment</th>
            <th>Contact</th>
            <th>Submitted</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each bookings as booking}
            <tr>
              <td class="patient-cell">
                <div class="patient-avatar">{booking.patientName?.charAt(0)?.toUpperCase() || '?'}</div>
                <span class="patient-name">{booking.patientName}</span>
              </td>
              <td>
                <span class="service-tag">{booking.service}</span>
              </td>
              <td>
                <div class="appt-info">
                  <span class="appt-date">{formatDate(booking.date)}</span>
                  <span class="appt-time">{booking.timeSlot}</span>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span class="contact-email">{booking.email}</span>
                  <span class="contact-phone">{booking.phone}</span>
                </div>
              </td>
              <td class="date-cell">{formatDate(booking.createdAt)}</td>
              <td>
                <span class="status-badge status-{booking.status}">
                  {booking.status}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .bookings-admin {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
    color: #64748b;
  }

  .header-stats {
    display: flex;
    gap: 0.5rem;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
  }

  .stat-pill.pending {
    background: #fffbeb;
    border-color: #fde68a;
  }

  .stat-pill.confirmed {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .stat-number {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-text {
    font-size: 0.75rem;
    color: #64748b;
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 3rem;
    text-align: center;
  }

  .empty-state svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .empty-state p {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .bookings-table-wrapper {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .bookings-table {
    width: 100%;
    border-collapse: collapse;
  }

  .bookings-table th {
    text-align: left;
    padding: 0.85rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .bookings-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  .bookings-table tr:last-child td {
    border-bottom: none;
  }

  .bookings-table tr:hover {
    background: #fafbfd;
  }

  .patient-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .patient-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
    color: #4338ca;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .patient-name {
    font-weight: 500;
    color: #1e293b;
  }

  .service-tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #475569;
  }

  .appt-info {
    display: flex;
    flex-direction: column;
  }

  .appt-date {
    font-weight: 500;
    color: #1e293b;
  }

  .appt-time {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
  }

  .contact-email {
    color: #1e293b;
  }

  .contact-phone {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .date-cell {
    color: #64748b;
    white-space: nowrap;
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.65rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .status-confirmed { background: #f0fdf4; color: #16a34a; }
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-cancelled { background: #fef2f2; color: #dc2626; }

  @media (max-width: 768px) {
    .bookings-table-wrapper {
      overflow-x: auto;
    }
    .bookings-table {
      min-width: 700px;
    }
  }
</style>
