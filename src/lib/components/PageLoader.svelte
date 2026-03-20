<script>
  import { onDestroy } from 'svelte';
  import { navigating } from '$app/stores';
  import { dataLoading } from '$lib/stores/loading.js';

  let visible = false;
  let timeout;

  $: isActive = $navigating || $dataLoading;
  $: if (isActive) {
    visible = true;
    clearTimeout(timeout);
  } else if (visible) {
    timeout = setTimeout(() => {
      visible = false;
    }, 300);
  }

  onDestroy(() => clearTimeout(timeout));
</script>

{#if visible}
  <div class="loader-overlay" role="status" aria-live="polite" aria-label="Loading">
    <div class="loader-backdrop"></div>
    <div class="loader-spinner">
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <circle class="loader-spinner__track" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
        <circle class="loader-spinner__head" cx="25" cy="25" r="20" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="30 95" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .loader-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }

  .loader-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .loader-spinner {
    position: relative;
    z-index: 1;
    width: 48px;
    height: 48px;
  }

  .loader-spinner svg {
    width: 100%;
    height: 100%;
    animation: loader-spin 0.8s linear infinite;
  }

  .loader-spinner__track {
    stroke: rgba(26, 26, 46, 0.1);
  }

  .loader-spinner__head {
    stroke: #c59153;
    transform: rotate(-90deg);
    transform-origin: center;
  }

  @keyframes loader-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
