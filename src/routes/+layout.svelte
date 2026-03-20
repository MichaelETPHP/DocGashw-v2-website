<script>
  import { page } from '$app/stores';
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import PageLoader from "$lib/components/PageLoader.svelte";

  $: isAdminOrLogin = $page.url.pathname.startsWith('/admin') || $page.url.pathname === '/login';
</script>

<PageLoader />

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
</svelte:head>

{#if !isAdminOrLogin}
  <Navbar />
{/if}

<main class:admin-main={isAdminOrLogin}>
  <slot />
</main>

{#if !isAdminOrLogin}
  <Footer />
{/if}
