<script>
  import { navigating } from '$app/stores';

  let progress = 0;
  let visible = false;
  let interval;

  $: if ($navigating) {
    startLoading();
  } else {
    finishLoading();
  }

  function startLoading() {
    visible = true;
    progress = 0;

    clearInterval(interval);
    interval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 15 + 5;
        if (progress > 90) progress = 90;
      }
    }, 200);
  }

  function finishLoading() {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      visible = false;
      progress = 0;
    }, 400);
  }
</script>

{#if visible}
  <div class="loader" class:loader--done={progress === 100}>
    <div class="loader__bar" style="width: {progress}%" />
  </div>
{/if}

<style>
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 9999;
    background: transparent;
  }

  .loader__bar {
    height: 100%;
    background: linear-gradient(90deg, #c59153, #e8c88a, #c59153);
    transition: width 0.2s ease-out;
    box-shadow: 0 0 12px rgba(197, 145, 83, 0.5);
    border-radius: 0 2px 2px 0;
  }

  .loader--done .loader__bar {
    transition: width 0.3s ease-out;
  }
</style>
