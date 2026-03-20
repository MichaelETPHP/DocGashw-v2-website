<script>
  export let data;
  $: user = data?.user ?? {};

  // Dashboard stats (these would come from API in production)
  const stats = [
    { label: 'Total Posts', value: '5', change: '+2 this month', icon: 'posts', color: 'blue' },
    { label: 'Published', value: '5', change: 'All visible', icon: 'published', color: 'green' },
    { label: 'Categories', value: '4', change: 'Active topics', icon: 'categories', color: 'purple' },
    { label: 'Views', value: '1.2k', change: '+15% vs last month', icon: 'views', color: 'amber' },
  ];

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/blog', icon: 'plus', description: 'Write and publish a new article' },
    { label: 'View Bookings', href: '/admin/bookings', icon: 'calendar', description: 'Manage patient appointments' },
    { label: 'View Site', href: '/', icon: 'external', description: 'See your public portfolio' },
  ];

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
</script>

<svelte:head>
  <title>Dashboard – Admin</title>
</svelte:head>

<div class="dashboard">
  <!-- Welcome Section -->
  <div class="welcome-section">
    <div class="welcome-text">
      <h1 class="welcome-title">{getGreeting()}, {user.full_name?.split(' ')[0] || 'Admin'}</h1>
      <p class="welcome-subtitle">Here's what's happening with your portfolio today.</p>
    </div>
    <div class="welcome-date">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid">
    {#each stats as stat}
      <div class="stat-card stat-{stat.color}">
        <div class="stat-icon">
          {#if stat.icon === 'posts'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          {:else if stat.icon === 'published'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          {:else if stat.icon === 'categories'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          {:else if stat.icon === 'views'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          {/if}
        </div>
        <div class="stat-content">
          <span class="stat-value">{stat.value}</span>
          <span class="stat-label">{stat.label}</span>
        </div>
        <span class="stat-change">{stat.change}</span>
      </div>
    {/each}
  </div>

  <!-- Quick Actions & Activity -->
  <div class="content-grid">
    <!-- Quick Actions -->
    <div class="card actions-card">
      <div class="card-header">
        <h2 class="card-title">Quick Actions</h2>
        <p class="card-description">Common tasks at your fingertips</p>
      </div>
      <div class="actions-list">
        {#each quickActions as action}
          <a href={action.href} class="action-item">
            <div class="action-icon">
              {#if action.icon === 'plus'}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              {:else if action.icon === 'calendar'}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              {:else if action.icon === 'external'}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              {/if}
            </div>
            <div class="action-text">
              <span class="action-label">{action.label}</span>
              <span class="action-desc">{action.description}</span>
            </div>
            <svg class="action-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        {/each}
      </div>
    </div>

    <!-- System Info -->
    <div class="card info-card">
      <div class="card-header">
        <h2 class="card-title">System Info</h2>
        <p class="card-description">Your account details</p>
      </div>
      <div class="info-list">
        <div class="info-item">
          <span class="info-label">Role</span>
          <span class="info-value role-badge">{user.role || 'admin'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Username</span>
          <span class="info-value">{user.username || 'N/A'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">{user.email || 'N/A'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Session</span>
          <span class="info-value status-active">Active</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ===== Welcome ===== */
  .welcome-section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .welcome-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .welcome-subtitle {
    font-size: 0.95rem;
    color: #64748b;
  }

  .welcome-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #64748b;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }

  .welcome-date svg {
    width: 16px;
    height: 16px;
  }

  /* ===== Stats Grid ===== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: all 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0,0,0,0.08);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-icon svg {
    width: 20px;
    height: 20px;
  }

  .stat-blue .stat-icon {
    background: #eff6ff;
    color: #3b82f6;
  }

  .stat-green .stat-icon {
    background: #f0fdf4;
    color: #22c55e;
  }

  .stat-purple .stat-icon {
    background: #faf5ff;
    color: #a855f7;
  }

  .stat-amber .stat-icon {
    background: #fffbeb;
    color: #f59e0b;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .stat-change {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* ===== Content Grid ===== */
  .content-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1rem;
  }

  .card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .card-header {
    padding: 1.25rem 1.25rem 0;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  .card-description {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  /* ===== Actions ===== */
  .actions-list {
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid transparent;
  }

  .action-item:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
  }

  .action-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #475569;
  }

  .action-item:hover .action-icon {
    background: #eff6ff;
    color: #3b82f6;
  }

  .action-icon svg {
    width: 18px;
    height: 18px;
  }

  .action-text {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .action-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
  }

  .action-desc {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .action-arrow {
    width: 18px;
    height: 18px;
    color: #cbd5e1;
    flex-shrink: 0;
    transition: transform 0.15s;
  }

  .action-item:hover .action-arrow {
    transform: translateX(3px);
    color: #3b82f6;
  }

  /* ===== Info Card ===== */
  .info-list {
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 0.85rem;
    color: #64748b;
  }

  .info-value {
    font-size: 0.85rem;
    font-weight: 500;
    color: #1e293b;
  }

  .role-badge {
    background: #eff6ff;
    color: #2563eb;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    text-transform: capitalize;
  }

  .status-active {
    color: #16a34a;
  }

  .status-active::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    margin-right: 0.4rem;
  }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
