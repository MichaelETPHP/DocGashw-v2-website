<script>
  import { onMount } from 'svelte';

  let login = '';
  let password = '';
  let error = '';
  let loading = false;
  let showPassword = false;
  let focusedField = '';
  let dbStatus = null; // null = checking, true = connected, false = disconnected
  let dbError = '';
  let dbHint = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      dbStatus = data.ok === true;
      dbError = data.message || '';
      dbHint = data.hint || '';
    } catch {
      dbStatus = false;
      dbError = 'Failed to reach health API';
      dbHint = 'Check if the server is running.';
    }
  });

  function setFocus(field) {
    focusedField = field;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        error = data.error || 'Login failed';
        loading = false;
        return;
      }
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      loading = false;
    } catch (err) {
      error = 'Network error. Please try again.';
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login – Dr. Gashaw Arega</title>
  <meta name="description" content="Secure admin login for Dr. Gashaw Arega's portfolio management" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="login-wrapper">
  <!-- Animated background -->
  <div class="bg-animation">
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-orb bg-orb-3"></div>
    <div class="bg-grid"></div>
  </div>

  <!-- Main content -->
  <div class="login-container">
    <!-- Left: Branding -->
    <div class="brand-panel">
      <div class="brand-content">
        <div class="brand-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" fill="url(#heartGrad)" />
            <path d="M24 34s-10-6.5-10-13c0-3.5 2.5-6 5.5-6 2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 5.5 6 0 6.5-10 13-10 13z" fill="white" opacity="0.95" />
            <defs>
              <linearGradient id="heartGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3B82F6" />
                <stop offset="1" stop-color="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 class="brand-title">Dr. Gashaw Arega</h2>
        <p class="brand-subtitle">Pediatric Oncologist</p>
        <div class="brand-divider"></div>
        <p class="brand-description">
          Admin portal for managing portfolio content, blog posts, and patient resources.
        </p>
        <div class="brand-features">
          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Manage Blog Posts</span>
          </div>
          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>View Appointments</span>
          </div>
          <div class="feature-item">
            <svg class="feature-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Secure Access</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Login Form -->
    <div class="form-panel">
      <div class="form-content">
        <div class="form-header">
          <h1 class="form-title">Welcome back</h1>
          <p class="form-subtitle">Sign in to your admin dashboard</p>
        </div>

        <form on:submit={handleSubmit} class="login-form">
          {#if error}
            <div class="error-alert" role="alert">
              <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          {/if}

          <div class="form-group" class:focused={focusedField === 'login'}>
            <label for="login" class="form-label">Email or Username</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <input
                id="login"
                type="text"
                bind:value={login}
                on:focus={() => setFocus('login')}
                on:blur={() => setFocus('')}
                required
                autocomplete="username"
                class="form-input"
                placeholder="Enter your email or username"
              />
            </div>
          </div>

          <div class="form-group" class:focused={focusedField === 'password'}>
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                bind:value={password}
                on:focus={() => setFocus('password')}
                on:blur={() => setFocus('')}
                required
                autocomplete="current-password"
                class="form-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                class="password-toggle"
                on:click={() => showPassword = !showPassword}
                tabindex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {#if showPassword}
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                {:else}
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="submit-btn"
          >
            {#if loading}
              <svg class="spinner" viewBox="0 0 24 24" fill="none">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                <path class="spinner-head" d="M12 2a10 10 0 019.95 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              <span>Signing in...</span>
            {:else}
              <span>Sign in</span>
              <svg class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            {/if}
          </button>
        </form>

        <!-- Database status -->
        <div class="db-status" class:db-status--checking={dbStatus === null} class:db-status--connected={dbStatus === true} class:db-status--disconnected={dbStatus === false}>
          {#if dbStatus === null}
            <span class="db-status-icon db-status-icon--spinner">...</span>
            <span class="db-status-text">Checking database...</span>
          {:else if dbStatus === true}
            <span class="db-status-icon db-status-icon--ok">✓</span>
            <span class="db-status-text">Database connected</span>
          {:else}
            <span class="db-status-icon db-status-icon--fail">✗</span>
            <div class="db-status-details">
              <span class="db-status-text">Database disconnected</span>
              {#if dbError}
                <span class="db-status-error">{dbError}</span>
              {/if}
              {#if dbHint}
                <span class="db-status-hint">{dbHint}</span>
              {/if}
            </div>
          {/if}
        </div>

        <div class="form-footer">
          <a href="/" class="back-link">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>Back to website</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* ===== Layout ===== */
  .login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    position: relative;
    overflow: hidden;
    background: #0f172a;
    font-family: 'Inter', sans-serif;
  }

  /* ===== Animated Background ===== */
  .bg-animation {
    position: fixed;
    inset: 0;
    z-index: 0;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    animation: float 20s ease-in-out infinite;
  }

  .bg-orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    top: -200px;
    right: -100px;
    animation-delay: 0s;
  }

  .bg-orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    bottom: -100px;
    left: -100px;
    animation-delay: -7s;
  }

  .bg-orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -14s;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(20px, 10px) scale(1.02); }
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ===== Container ===== */
  .login-container {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 600px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06),
      0 25px 50px -12px rgba(0,0,0,0.5),
      0 0 100px -20px rgba(59,130,246,0.3);
  }

  /* ===== Brand Panel (Left) ===== */
  .brand-panel {
    flex: 1;
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #172554 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .brand-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 1;
  }

  .brand-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }

  .brand-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  }

  .brand-icon svg {
    width: 100%;
    height: 100%;
  }

  .brand-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .brand-subtitle {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.7);
    font-weight: 400;
  }

  .brand-divider {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    margin: 1.5rem auto;
    border-radius: 2px;
  }

  .brand-description {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    max-width: 280px;
    margin: 0 auto 2rem;
  }

  .brand-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
    max-width: 220px;
    margin: 0 auto;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.8);
  }

  .feature-icon {
    width: 18px;
    height: 18px;
    color: #60a5fa;
    flex-shrink: 0;
  }

  /* ===== Form Panel (Right) ===== */
  .form-panel {
    flex: 1;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .form-content {
    width: 100%;
    max-width: 380px;
  }

  .form-header {
    margin-bottom: 2rem;
  }

  .form-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .form-subtitle {
    font-size: 0.95rem;
    color: #64748b;
  }

  /* ===== Form Elements ===== */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: #94a3b8;
    pointer-events: none;
    transition: color 0.2s;
  }

  .form-group.focused .input-icon {
    color: #3b82f6;
  }

  .form-input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.75rem;
    font-size: 0.95rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    outline: none;
    transition: all 0.2s;
    background: #f8fafc;
    color: #0f172a;
    font-family: inherit;
  }

  .form-input::placeholder {
    color: #94a3b8;
  }

  .form-input:hover {
    border-color: #cbd5e1;
  }

  .form-group.focused .form-input {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    background: white;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #94a3b8;
    transition: color 0.2s;
  }

  .password-toggle:hover {
    color: #475569;
  }

  .password-toggle svg {
    width: 20px;
    height: 20px;
  }

  /* ===== Error Alert ===== */
  .error-alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    color: #dc2626;
    font-size: 0.875rem;
    animation: shake 0.4s ease-out;
  }

  .error-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  /* ===== Submit Button ===== */
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.85rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .submit-btn:hover:not(:disabled)::before {
    opacity: 1;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px -5px rgba(59,130,246,0.4);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.2s;
  }

  .submit-btn:hover:not(:disabled) .btn-arrow {
    transform: translateX(3px);
  }

  /* ===== Spinner ===== */
  .spinner {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  .spinner-track {
    opacity: 0.25;
  }

  .spinner-head {
    opacity: 1;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ===== Database Status ===== */
  .db-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 1.5rem;
  }

  .db-status--checking {
    background: #f1f5f9;
    color: #64748b;
  }

  .db-status--connected {
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
  }

  .db-status--disconnected {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    flex-wrap: wrap;
  }

  .db-status-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .db-status-error {
    font-size: 0.75rem;
    color: #b91c1c;
    font-weight: 400;
  }

  .db-status-hint {
    font-size: 0.7rem;
    color: #991b1b;
    font-weight: 400;
    font-style: italic;
  }

  .db-status-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .db-status-icon--ok {
    background: #d1fae5;
    color: #059669;
  }

  .db-status-icon--fail {
    background: #fee2e2;
    color: #dc2626;
  }

  .db-status-icon--spinner {
    background: #e2e8f0;
    color: #64748b;
  }

  /* ===== Footer ===== */
  .form-footer {
    margin-top: 1rem;
    text-align: center;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #3b82f6;
  }

  .back-link svg {
    width: 16px;
    height: 16px;
  }

  /* ===== Responsive ===== */
  @media (max-width: 768px) {
    .login-container {
      flex-direction: column;
      max-width: 440px;
    }

    .brand-panel {
      padding: 2rem;
      min-height: auto;
    }

    .brand-features {
      display: none;
    }

    .brand-description {
      margin-bottom: 0;
    }

    .form-panel {
      padding: 2rem;
    }
  }

  @media (max-width: 480px) {
    .login-wrapper {
      padding: 0.5rem;
    }

    .login-container {
      border-radius: 16px;
    }

    .brand-panel {
      padding: 1.5rem;
    }

    .brand-title {
      font-size: 1.4rem;
    }

    .form-panel {
      padding: 1.5rem;
    }

    .form-title {
      font-size: 1.4rem;
    }
  }
</style>
