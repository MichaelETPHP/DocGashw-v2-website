<script>
  export let data;
  $: locations = data?.locations ?? [];

  let showForm = false;
  let editingLocation = null;
  let name = '';
  let type = 'Public Hospital';
  let role = 'Consultant';
  let description = '';
  let address = '';
  let workingHours = '';
  let displayOrder = 0;
  let message = '';
  let messageType = 'success';
  let loading = false;

  let deletingId = '';
  let togglingId = '';
  let toastMessage = '';
  let expandedId = '';
  let searchQuery = '';

  $: filteredLocations = locations.filter((loc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      (loc.description || '').toLowerCase().includes(q)
    );
  });

  function openCreateForm() {
    editingLocation = null;
    name = '';
    type = 'Public Hospital';
    role = 'Consultant';
    description = '';
    address = '';
    workingHours = '';
    displayOrder = locations.length;
    message = '';
    showForm = true;
  }

  function openEditForm(loc) {
    editingLocation = loc;
    name = loc.name;
    type = loc.type || 'Public Hospital';
    role = loc.role || 'Consultant';
    description = loc.description || '';
    address = loc.address || '';
    workingHours = loc.working_hours || '';
    displayOrder = loc.display_order ?? 0;
    message = '';
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingLocation = null;
    message = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    message = '';
    loading = true;

    try {
      const payload = {
        name,
        type,
        role,
        description,
        address,
        working_hours: workingHours,
        display_order: displayOrder
      };

      let result;
      try {
        let res;
        if (editingLocation) {
          res = await fetch(`/api/locations/${editingLocation.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
          });
        } else {
          res = await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
          });
        }
        result = await res.json();
        if (!res.ok) {
          message = result.error || 'Operation failed';
          messageType = 'error';
          loading = false;
          return;
        }
      } catch (err) {
        message = err.message || 'Operation failed';
        messageType = 'error';
        loading = false;
        return;
      }

      message = editingLocation ? 'Location updated successfully.' : 'Location created successfully.';
      messageType = 'success';
      loading = false;
      toastMessage = editingLocation ? 'Location updated successfully.' : 'Location created successfully.';

      closeForm();
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      message = 'Network error. Please try again.';
      messageType = 'error';
      loading = false;
    }
  }

  async function deleteLocation(loc) {
    if (!confirm(`Delete "${loc.name}"? This cannot be undone.`)) return;
    if (deletingId) return;
    deletingId = loc.id;
    try {
      const delRes = await fetch(`/api/locations/${loc.id}`, { method: 'DELETE', credentials: 'include' });
      if (!delRes.ok) throw new Error('Failed to delete');
      toastMessage = 'Location deleted successfully.';
      setTimeout(() => { toastMessage = ''; }, 2500);
      window.location.reload();
    } catch (err) {
      alert('Failed to delete location');
    } finally {
      deletingId = '';
    }
  }

  async function toggleActive(loc) {
    if (togglingId) return;
    togglingId = loc.id;
    try {
      const toggleRes = await fetch(`/api/locations/${loc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !loc.is_active }),
        credentials: 'include'
      });
      if (!toggleRes.ok) throw new Error('Failed to update');
      toastMessage = loc.is_active ? 'Location hidden.' : 'Location visible.';
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      alert('Failed to update');
    } finally {
      togglingId = '';
    }
  }

  function toggleAccordion(id) {
    expandedId = expandedId === id ? '' : id;
  }
</script>

<svelte:head>
  <title>Locations – Admin</title>
</svelte:head>

{#if toastMessage}
  <div class="toast" role="status" aria-live="polite">
    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
    <span>{toastMessage}</span>
  </div>
{/if}

<div class="locations-admin">
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">Hospital Locations</h1>
      <p class="page-subtitle">Manage "Where to Find Dr. Gashaw Arega" section</p>
    </div>
    <button class="create-btn" on:click={openCreateForm}>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      <span>Add Location</span>
    </button>
  </div>

  <div class="filters-bar">
    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search locations..."
        class="search-input"
      />
    </div>
    <span class="item-count">{filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}</span>
  </div>

  <div class="table-wrapper">
    {#if filteredLocations.length === 0}
      <div class="empty-state">
        <svg viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="#f1f5f9" />
          <path d="M16 18h16M16 24h12M16 30h8" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
        </svg>
        <h3>No locations found</h3>
        <p>{searchQuery ? 'Try adjusting your search' : 'Add your first hospital or clinic location'}</p>
        {#if !searchQuery}
          <button class="create-btn" on:click={openCreateForm}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>Add Location</span>
          </button>
        {/if}
      </div>
    {:else}
      <!-- Desktop: Table -->
      <div class="locations-table-desktop">
        <table class="data-table">
          <thead>
            <tr>
              <th>Hospital</th>
              <th>Type</th>
              <th>Address</th>
              <th>Working Hours</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredLocations as loc}
              <tr class="data-row" class:inactive={!loc.is_active}>
                <td class="name-cell">
                  <strong>{loc.name}</strong>
                  <span class="role-text">{loc.role}</span>
                </td>
                <td><span class="type-badge">{loc.type}</span></td>
                <td class="address-cell">{loc.address}</td>
                <td class="hours-cell">{loc.working_hours}</td>
                <td>{loc.display_order}</td>
                <td>
                  <button
                    class="status-toggle"
                    class:active={loc.is_active}
                    class:loading={togglingId === loc.id}
                    on:click={() => toggleActive(loc)}
                    disabled={togglingId === loc.id}
                    title={loc.is_active ? 'Hide from site' : 'Show on site'}
                  >
                    {#if togglingId === loc.id}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <span class="status-dot"></span>
                    {/if}
                    {togglingId === loc.id ? 'Updating...' : (loc.is_active ? 'Visible' : 'Hidden')}
                  </button>
                </td>
                <td class="actions-cell">
                  <button class="action-btn edit" on:click={() => openEditForm(loc)} title="Edit" aria-label="Edit location">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button class="action-btn delete" on:click={() => deleteLocation(loc)} title="Delete" aria-label="Delete location" disabled={deletingId === loc.id}>
                    {#if deletingId === loc.id}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    {/if}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Mobile: Accordion -->
      <div class="locations-accordion-mobile">
        {#each filteredLocations as loc}
          <div class="accordion-item" class:inactive={!loc.is_active}>
            <button
              class="accordion-header"
              class:expanded={expandedId === loc.id}
              on:click={() => toggleAccordion(loc.id)}
              aria-expanded={expandedId === loc.id}
            >
              <span class="accordion-title">{loc.name}</span>
              <span class="type-badge">{loc.type}</span>
              <span class="accordion-status" class:active={loc.is_active}>{loc.is_active ? 'Visible' : 'Hidden'}</span>
              <svg class="accordion-chevron" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if expandedId === loc.id}
              <div class="accordion-body">
                <p class="accordion-meta"><strong>{loc.role}</strong></p>
                <p class="accordion-address">{loc.address}</p>
                <p class="accordion-hours">{loc.working_hours}</p>
                <div class="accordion-actions">
                  <button class="accordion-btn edit" on:click={() => openEditForm(loc)}>
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    Edit
                  </button>
                  <button class="accordion-btn status" on:click={() => toggleActive(loc)} disabled={togglingId === loc.id}>
                    {#if togglingId === loc.id}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <span class="status-dot"></span>
                    {/if}
                    {loc.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button class="accordion-btn delete" on:click={() => deleteLocation(loc)} disabled={deletingId === loc.id}>
                    {#if deletingId === loc.id}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    {/if}
                    Delete
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
{#if showForm}
  <div
    class="modal-overlay"
    role="button"
    tabindex="-1"
    aria-label="Close modal"
    on:click={closeForm}
    on:keydown={(e) => {
      if (e.key === 'Escape') { closeForm(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('input, textarea, select')) return;
        e.preventDefault();
        closeForm();
      }
    }}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      on:click|stopPropagation
      on:keydown={(e) => {
        if (e.key !== 'Escape') e.stopPropagation();
      }}
    >
      <div class="modal-header">
        <h2 class="modal-title">{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
        <button class="modal-close" on:click={closeForm} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <form on:submit={handleSubmit} class="modal-form">
        {#if message}
          <div class="form-alert {messageType === 'error' ? 'alert-error' : 'alert-success'}">
            {message}
          </div>
        {/if}

        <div class="form-row">
          <div class="form-field">
            <label for="name">Hospital Name *</label>
            <input id="name" type="text" bind:value={name} required placeholder="e.g. Black Lion Hospital" />
          </div>
          <div class="form-field">
            <label for="type">Type</label>
            <select id="type" bind:value={type}>
              <option value="Public Hospital">Public Hospital</option>
              <option value="Private Clinic">Private Clinic</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="role">Role / Title</label>
          <input id="role" type="text" bind:value={role} placeholder="e.g. Senior Consultant" />
        </div>

        <div class="form-field">
          <label for="description">About Hospital (text)</label>
          <textarea id="description" bind:value={description} rows="4" placeholder="Description of the hospital and Dr. Gashaw's role there"></textarea>
        </div>

        <div class="form-field">
          <label for="address">Location / Address *</label>
          <input id="address" type="text" bind:value={address} required placeholder="e.g. Churchill Avenue, Addis Ababa, Ethiopia" />
        </div>

        <div class="form-field">
          <label for="workingHours">Working Hours *</label>
          <input id="workingHours" type="text" bind:value={workingHours} required placeholder="e.g. Monday, Wednesday, Friday: 8:00 AM - 4:00 PM" />
        </div>

        <div class="form-field field-small">
          <label for="displayOrder">Display Order</label>
          <input id="displayOrder" type="number" bind:value={displayOrder} min="0" />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" on:click={closeForm}>Cancel</button>
          <button type="submit" class="btn-primary" disabled={loading}>
            {#if loading}
              <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
              <span>Saving...</span>
            {:else}
              {editingLocation ? 'Update' : 'Add Location'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .locations-admin {
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

  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.25rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .create-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px -4px rgba(59, 130, 246, 0.4);
  }

  .create-btn svg {
    width: 18px;
    height: 18px;
  }

  .filters-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    background: white;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
  }

  .search-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .item-count {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-left: auto;
  }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: #166534;
    color: white;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    animation: toastIn 0.3s ease;
  }

  .toast svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .table-wrapper {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .locations-accordion-mobile {
    display: none;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
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

  .data-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  .data-row:last-child td {
    border-bottom: none;
  }

  .data-row:hover {
    background: #fafbfd;
  }

  .data-row.inactive {
    opacity: 0.6;
  }

  .name-cell {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .name-cell strong {
    color: #1e293b;
  }

  .role-text {
    font-size: 0.75rem;
    color: #64748b;
  }

  .type-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #e0f2fe;
    color: #0369a1;
  }

  .address-cell, .hours-cell {
    max-width: 200px;
    font-size: 0.8rem;
    color: #64748b;
  }

  .status-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .status-toggle.active {
    background: #dcfce7;
    border-color: #86efac;
    color: #166534;
  }

  .status-toggle:not(.active) {
    background: #fef2f2;
    border-color: #fecaca;
    color: #991b1b;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .action-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  .action-btn.edit:hover {
    background: #dbeafe;
    color: #2563eb;
  }

  .action-btn.delete:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  .action-btn svg {
    width: 16px;
    height: 16px;
  }

  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
  }

  .empty-state svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  .empty-state h3 {
    font-size: 1.1rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }

  .modal {
    background: white;
    border-radius: 16px;
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: #f1f5f9;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .modal-close:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  .modal-close svg {
    width: 20px;
    height: 20px;
  }

  .modal-form {
    padding: 1.5rem;
  }

  .form-alert {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .alert-error {
    background: #fee2e2;
    color: #991b1b;
  }

  .alert-success {
    background: #dcfce7;
    color: #166534;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-field {
    flex: 1;
    margin-bottom: 1rem;
  }

  .form-field.field-small {
    flex: 0 0 100px;
  }

  .form-field label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.4rem;
  }

  .form-field input,
  .form-field select,
  .form-field textarea {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-field input:focus,
  .form-field select:focus,
  .form-field textarea:focus {
    border-color: #3b82f6;
  }

  .form-field textarea {
    resize: vertical;
    min-height: 80px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .btn-secondary {
    padding: 0.6rem 1.25rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-secondary:hover {
    background: #f8fafc;
  }

  .btn-primary {
    padding: 0.6rem 1.25rem;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-spinner {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    animation: spin 0.8s linear infinite;
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-toggle.loading {
    opacity: 0.8;
  }

  .status-toggle .btn-spinner {
    width: 14px;
    height: 14px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Accordion (mobile) */
  .accordion-item {
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-item:last-child {
    border-bottom: none;
  }

  .accordion-item.inactive {
    opacity: 0.7;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: white;
    border: none;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    flex-wrap: wrap;
    min-height: 56px;
  }

  .accordion-header:hover {
    background: #f8fafc;
  }

  .accordion-header.expanded {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-title {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }

  .accordion-status {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #fef2f2;
    color: #991b1b;
  }

  .accordion-status.active {
    background: #f0fdf4;
    color: #166534;
  }

  .accordion-chevron {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.2s;
    color: #64748b;
  }

  .accordion-header.expanded .accordion-chevron {
    transform: rotate(180deg);
  }

  .accordion-body {
    padding: 1rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-meta,
  .accordion-address,
  .accordion-hours {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  .accordion-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .accordion-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }

  .accordion-btn svg {
    width: 16px;
    height: 16px;
  }

  .accordion-btn.edit:hover { background: #dbeafe; color: #2563eb; border-color: #bfdbfe; }
  .accordion-btn.status:hover { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
  .accordion-btn.delete:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .accordion-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .accordion-btn .btn-spinner {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    .locations-admin {
      padding: 0;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .create-btn {
      width: 100%;
      justify-content: center;
      min-height: 44px;
    }

    .locations-table-desktop {
      display: none;
    }

    .locations-accordion-mobile {
      display: block;
    }

    .table-wrapper {
      overflow: visible;
    }

    .action-btn {
      min-width: 40px;
      min-height: 40px;
    }

    .toast {
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      transform: none;
      max-width: none;
    }

    .modal-overlay {
      padding: 0.5rem;
      align-items: flex-start;
      padding-top: 2rem;
    }

    .modal {
      max-height: calc(100vh - 2rem);
    }

    .form-row {
      flex-direction: column;
    }

    .form-field.field-small {
      flex: 1;
    }

    .form-field input,
    .form-field textarea {
      font-size: 16px;
      min-height: 44px;
    }

    .modal-actions {
      flex-direction: column;
    }

    .modal-actions button {
      width: 100%;
      min-height: 44px;
    }
  }
</style>
