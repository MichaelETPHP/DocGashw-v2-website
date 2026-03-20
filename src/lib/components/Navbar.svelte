<script>
  import { onMount } from 'svelte';

  let isMenuOpen = false;
  let scrolled = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScroll() {
    scrolled = window.scrollY > 50;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header class={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
  <div class="navbar__container">
    <a href="/" class="navbar__brand" aria-label="Home">
      <div class="navbar__avatar">
        <img src="/images/dr-gasah-profile.jpg" alt="Dr. Gashaw Arega" />
      </div>
      <div class="navbar__brand-text">
        <span class="navbar__name">Dr. Gashaw Arega</span>
        <span class="navbar__title">Pediatric Oncologist</span>
      </div>
    </a>

    <!-- Desktop Navigation -->
    <nav class="navbar__nav">
      <a href="#about" class="navbar__link">About</a>
      <a href="#education" class="navbar__link">Education</a>
      <a href="#services" class="navbar__link">Services</a>
      <a href="#research" class="navbar__link">Research</a>
      <a href="#locations" class="navbar__link">Locations</a>
      <a href="/blog" class="navbar__link">Blog</a>
      <a href="#contact" class="navbar__cta">Contact</a>
    </nav>

    <!-- Mobile Menu Button -->
    <button
      class="navbar__toggle"
      aria-label="Toggle menu"
      on:click={toggleMenu}
    >
      <div class="navbar__toggle-bars">
        <span class="navbar__bar" class:navbar__bar--open={isMenuOpen}></span>
        <span class="navbar__bar navbar__bar--mid" class:navbar__bar--mid-open={isMenuOpen}></span>
        <span class="navbar__bar" class:navbar__bar--bottom-open={isMenuOpen}></span>
      </div>
    </button>
  </div>

  <!-- Mobile Navigation -->
  <div
    class="navbar__mobile-overlay"
    class:navbar__mobile-overlay--open={isMenuOpen}
    role="button"
    tabindex="0"
    aria-label="Close menu"
    on:click={toggleMenu}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleMenu())}
  ></div>
  <div class="navbar__mobile" class:navbar__mobile--open={isMenuOpen}>
    <div class="navbar__mobile-inner">
      <div class="navbar__mobile-header">
        <div class="navbar__avatar navbar__avatar--sm">
          <img src="/images/dr-gasah-profile.jpg" alt="Dr. Gashaw Arega" />
        </div>
        <span class="navbar__name">Dr. Gashaw Arega</span>
        <button class="navbar__close" on:click={toggleMenu} aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="navbar__mobile-nav">
        {#each [
          {href: "#about", text: "About"},
          {href: "#education", text: "Education"},
          {href: "#services", text: "Services"},
          {href: "#research", text: "Research"},
          {href: "#locations", text: "Locations"},
          {href: "/blog", text: "Blog & News"}
        ] as item}
          <a href={item.href} class="navbar__mobile-link" on:click={toggleMenu}>{item.text}</a>
        {/each}
        <a href="#contact" class="navbar__mobile-cta" on:click={toggleMenu}>Contact</a>
      </nav>

      <div class="navbar__mobile-footer">
        <p>&copy; 2025 Dr. Gashaw Arega</p>
      </div>
    </div>
  </div>
</header>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(245, 240, 232, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
  }

  .navbar--scrolled {
    background: rgba(245, 240, 232, 0.95);
    border-bottom-color: rgba(26, 26, 46, 0.08);
    box-shadow: 0 4px 20px rgba(26, 26, 46, 0.04);
  }

  .navbar__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.85rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .navbar__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
  }

  .navbar__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid rgba(197, 145, 83, 0.3);
    transition: border-color 0.3s;
  }

  .navbar__avatar--sm {
    width: 36px;
    height: 36px;
  }

  .navbar__brand:hover .navbar__avatar {
    border-color: #c59153;
  }

  .navbar__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .navbar__name {
    display: block;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.2;
  }

  .navbar__title {
    display: block;
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8a8a9a;
  }

  .navbar__nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .navbar__link {
    font-size: 0.82rem;
    font-weight: 500;
    color: #4a4a6a;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s;
    position: relative;
  }

  .navbar__link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: #c59153;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .navbar__link:hover {
    color: #1a1a2e;
  }

  .navbar__link:hover::after {
    width: 100%;
  }

  .navbar__cta {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f5f0e8;
    background: #1a1a2e;
    padding: 0.65rem 1.5rem;
    border-radius: 3px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .navbar__cta:hover {
    background: #c59153;
    color: #1a1a2e;
  }

  /* Mobile Toggle */
  .navbar__toggle {
    display: none;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    justify-content: center;
    align-items: center;
  }

  .navbar__toggle-bars {
    width: 24px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .navbar__bar {
    display: block;
    width: 100%;
    height: 1.5px;
    background: #1a1a2e;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: center;
  }

  .navbar__bar--open {
    transform: translateY(6.5px) rotate(45deg);
  }

  .navbar__bar--mid {
    opacity: 1;
  }

  .navbar__bar--mid-open {
    opacity: 0;
    transform: scaleX(0);
  }

  .navbar__bar--bottom-open {
    transform: translateY(-6.5px) rotate(-45deg);
  }

  /* Mobile Overlay */
  .navbar__mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 46, 0.3);
    z-index: 40;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .navbar__mobile-overlay--open {
    opacity: 1;
    pointer-events: auto;
  }

  /* Mobile Menu */
  .navbar__mobile {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    max-width: 85vw;
    height: 100vh;
    background: #f5f0e8;
    z-index: 45;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -8px 0 40px rgba(26, 26, 46, 0.1);
  }

  .navbar__mobile--open {
    transform: translateX(0);
  }

  .navbar__mobile-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.5rem;
  }

  .navbar__mobile-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(26, 26, 46, 0.08);
    margin-bottom: 1.5rem;
  }

  .navbar__mobile-header .navbar__name {
    flex: 1;
    font-size: 1rem;
  }

  .navbar__close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .navbar__close:hover {
    background: rgba(26, 26, 46, 0.06);
  }

  .navbar__close svg {
    width: 20px;
    height: 20px;
    color: #4a4a6a;
  }

  .navbar__mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .navbar__mobile-link {
    font-size: 1rem;
    font-weight: 500;
    color: #1a1a2e;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .navbar__mobile-link:hover {
    background: rgba(197, 145, 83, 0.08);
    color: #c59153;
  }

  .navbar__mobile-cta {
    display: block;
    text-align: center;
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f5f0e8;
    background: #1a1a2e;
    padding: 0.85rem 1.5rem;
    border-radius: 3px;
    text-decoration: none;
    margin-top: 1rem;
    transition: background 0.3s;
  }

  .navbar__mobile-cta:hover {
    background: #c59153;
    color: #1a1a2e;
  }

  .navbar__mobile-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(26, 26, 46, 0.08);
    text-align: center;
  }

  .navbar__mobile-footer p {
    font-size: 0.75rem;
    color: #8a8a9a;
  }

  @media (max-width: 900px) {
    .navbar__nav {
      display: none;
    }
    .navbar__toggle {
      display: flex;
    }
    .navbar__container {
      padding: 0.75rem 1.25rem;
    }
  }
</style>
