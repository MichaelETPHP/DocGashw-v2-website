<script>
  import { page } from '$app/stores';
  export let data;
  $: user = data?.user ?? {};
  $: currentPath = $page?.url?.pathname ?? '';

  let sidebarOpen = false;
  let logoutLoading = false;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  async function handleLogout() {
    if (logoutLoading) return;
    logoutLoading = true;
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/login';
    } catch (err) {
      logoutLoading = false;
    }
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/blog', label: 'Blog Posts', icon: 'blog' },
    { href: '/admin/locations', label: 'Locations', icon: 'locations' },
    // Bookings hidden for v2 - { href: '/admin/bookings', label: 'Bookings', icon: 'bookings' },
  ];

  function isActive(href, path) {
    if (href === '/admin') return path === '/admin';
    return path.startsWith(href);
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="admin-layout">
  <!-- Mobile overlay -->
  {#if sidebarOpen}
    <button class="sidebar-overlay" on:click={closeSidebar} aria-label="Close sidebar" tabindex="-1"></button>
  {/if}

  <!-- Sidebar -->
  <aside class="sidebar" class:open={sidebarOpen}>
    <div class="sidebar-header">
      <a href="/admin" class="sidebar-brand">
        <div class="brand-mark">
          <img src="/doctor-profile.jpg" alt="Dr. Gashaw" class="brand-mark-img" />
        </div>
        <div class="brand-text">
          <span class="brand-name">Dr. Gashaw</span>
          <span class="brand-role">Admin Panel</span>
        </div>
      </a>
      <button class="sidebar-close" on:click={closeSidebar} aria-label="Close sidebar">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      {#each navItems as item}
        <a
          href={item.href}
          class="nav-item"
          class:active={isActive(item.href, currentPath)}
          on:click={closeSidebar}
        >
          {#if item.icon === 'dashboard'}
            <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          {:else if item.icon === 'blog'}
            <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          {:else if item.icon === 'locations'}
            <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          {/if}
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">
          <img src="/doctor-profile.jpg" alt={user.full_name || 'Admin'} class="user-avatar-img" />
        </div>
        <div class="user-info">
          <span class="user-name">{user.full_name || user.username || 'Admin'}</span>
          <span class="user-role">{user.role || 'admin'}</span>
        </div>
      </div>
      <button class="logout-btn" on:click={handleLogout} title="Sign out" aria-label="Sign out" disabled={logoutLoading}>
        {#if logoutLoading}
          <svg class="btn-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
        {:else}
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <div class="main-wrapper">
    <!-- Top bar -->
    <header class="topbar">
      <button class="menu-toggle" on:click={toggleSidebar} aria-label="Open sidebar">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <div class="topbar-right">
        <a href="/" class="view-site-btn" target="_blank">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          <span>View site</span>
        </a>
      </div>
    </header>

    <!-- Page content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: #0f172a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ===== Sidebar - Dark professional ===== */
  .sidebar {
    width: 260px;
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 35;
    border: none;
    cursor: pointer;
    backdrop-filter: blur(2px);
  }

  .sidebar-close {
    display: none;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #94a3b8;
  }

  .sidebar-close:hover {
    color: #f8fafc;
  }

  .sidebar-close svg {
    width: 20px;
    height: 20px;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .brand-mark-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: #f8fafc;
    letter-spacing: -0.01em;
  }

  .brand-role {
    font-size: 0.68rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  /* ===== Nav ===== */
  .sidebar-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.9rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #94a3b8;
    transition: all 0.15s;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f8fafc;
  }

  .nav-item.active {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    font-weight: 600;
    border: 1px solid rgba(59, 130, 246, 0.25);
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: 0.9;
  }

  .nav-item.active .nav-icon {
    color: #60a5fa;
  }

  /* ===== Sidebar Footer ===== */
  .sidebar-footer {
    padding: 1rem 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .user-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .user-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .user-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f8fafc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: 0.7rem;
    color: #64748b;
    text-transform: capitalize;
  }

  .logout-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  .logout-btn svg {
    width: 18px;
    height: 18px;
  }

  .logout-btn:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .btn-spinner {
    width: 18px;
    height: 18px;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ===== Main Wrapper ===== */
  .main-wrapper {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #f8fafc;
  }

  /* ===== Topbar ===== */
  .topbar {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 20;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #475569;
    border-radius: 8px;
  }

  .menu-toggle:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .menu-toggle svg {
    width: 22px;
    height: 22px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .view-site-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.15s;
  }

  .view-site-btn:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .view-site-btn svg {
    width: 16px;
    height: 16px;
  }

  /* ===== Main Content ===== */
  .main-content {
    flex: 1;
    padding: 1.5rem;
    background: #f8fafc;
  }

  /* ===== Responsive - Mobile First ===== */
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      width: min(280px, 85vw);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-overlay {
      display: block;
    }

    .sidebar-close {
      display: block;
    }

    .main-wrapper {
      margin-left: 0;
    }

    .menu-toggle {
      display: flex;
      min-width: 44px;
      min-height: 44px;
      align-items: center;
      justify-content: center;
    }

    .view-site-btn {
      min-height: 44px;
      padding: 0.6rem 1rem;
    }

    .view-site-btn span {
      display: none;
    }

    .main-content {
      padding: 1rem;
    }

    .topbar {
      height: 56px;
      padding: 0 1rem;
    }

    .nav-item {
      min-height: 44px;
      padding: 0.75rem 1rem;
    }

    .logout-btn {
      min-width: 44px;
      min-height: 44px;
    }
  }

  @media (max-width: 480px) {
    .main-content {
      padding: 0.75rem;
    }
  }
</style>
