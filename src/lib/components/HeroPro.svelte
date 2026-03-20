<script>
  import { onMount } from 'svelte';

  let ready = false;
  let statsVisible = false;
  let counters = { years: 0, patients: 0, research: 0, countries: 0 };
  let currentSlide = 0;

  const targetStats = {
    years: 12,
    patients: 5000,
    research: 45,
    countries: 8
  };

  const stats = [
    { key: 'years', label: 'Years of Experience', suffix: '+', icon: 'clock' },
    { key: 'patients', label: 'Young Patients Treated', suffix: '+', icon: 'heart' },
    { key: 'research', label: 'Research Publications', suffix: '+', icon: 'book' },
    { key: 'countries', label: 'Countries Collaborating', suffix: '', icon: 'globe' }
  ];

  const rotatingWords = ['compassion', 'research', 'hope', 'dedication'];

  function animateCounter(key, target, duration = 2000) {
    const start = performance.now();
    const initial = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counters[key] = Math.round(initial + (target - initial) * eased);
      counters = { ...counters };

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function formatNumber(n) {
    if (n >= 1000) {
      return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
    }
    return n.toString();
  }

  onMount(() => {
    requestAnimationFrame(() => {
      ready = true;
    });

    // Rotate words
    const wordInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % rotatingWords.length;
    }, 3000);

    // Stats observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsVisible) {
          statsVisible = true;
          Object.keys(targetStats).forEach((key, i) => {
            setTimeout(() => animateCounter(key, targetStats[key], 2200), i * 150);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsEl = document.getElementById('hero-stats');
    if (statsEl) observer.observe(statsEl);

    return () => {
      observer.disconnect();
      clearInterval(wordInterval);
    };
  });
</script>

<section id="home" class="hero" class:hero--ready={ready}>
  <!-- Texture Overlay -->
  <div class="hero__texture"></div>

  <!-- Decorative Line Grid -->
  <div class="hero__lines">
    <div class="hero__line hero__line--1"></div>
    <div class="hero__line hero__line--2"></div>
    <div class="hero__line hero__line--3"></div>
    <div class="hero__line hero__line--4"></div>
  </div>

  <!-- Floating Geometric Accents -->
  <div class="hero__geo hero__geo--circle"></div>
  <div class="hero__geo hero__geo--ring"></div>
  <div class="hero__geo hero__geo--dot-cluster"></div>

  <!-- Main Content -->
  <div class="hero__container">
    <!-- Top Navigation Bar -->
    <div class="hero__topbar hero__anim hero__anim--0">
      <div class="hero__topbar-left">
        <span class="hero__topbar-tag">Pediatric Oncology</span>
        <span class="hero__topbar-divider">|</span>
        <span class="hero__topbar-location">Addis Ababa, Ethiopia</span>
      </div>
      <div class="hero__topbar-right">
        <span class="hero__topbar-year">Est. 2014</span>
      </div>
    </div>

    <!-- Main Grid: Editorial Layout -->
    <div class="hero__grid">
      <!-- Left Column: Large Text -->
      <div class="hero__col hero__col--text">
        <!-- Greeting -->
        <div class="hero__anim hero__anim--1">
          <p class="hero__greeting">Hello, I'm</p>
        </div>

        <!-- Name with dramatic sizing -->
        <div class="hero__anim hero__anim--2">
          <h1 class="hero__title">
            <span class="hero__title-line hero__title-line--1">Dr. Gashaw</span>
            <span class="hero__title-line hero__title-line--2">Arega</span>
          </h1>
        </div>

        <!-- Credentials strip -->
        <div class="hero__anim hero__anim--3">
          <div class="hero__credentials">
            <span class="hero__credential">MD</span>
            <span class="hero__credential-sep"></span>
            <span class="hero__credential">MPH</span>
            <span class="hero__credential-sep"></span>
            <span class="hero__credential">Pediatric Hematology-Oncology</span>
          </div>
        </div>

        <!-- Tagline with rotating word -->
        <div class="hero__anim hero__anim--4">
          <p class="hero__tagline">
            Fighting childhood cancer with
            {#each rotatingWords as word, i}
              <span class="hero__word" class:hero__word--active={currentSlide === i}>{word}</span>
            {/each}
          </p>
        </div>

        <!-- Amharic subtitle -->
        <div class="hero__anim hero__anim--5">
          <p class="hero__amharic">
            የህፃናት የደም ተያያዥ ህመሞች እና የህፃናት ካንሰር ህክምና ሰብ ስፔሻሊስት
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="hero__anim hero__anim--6">
          <div class="hero__actions">
            <a href="#contact" class="hero__btn hero__btn--primary">
              <span>Book Appointment</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#about" class="hero__btn hero__btn--outline">
              <span>Learn More</span>
            </a>
          </div>
        </div>

        <!-- Trust Bar -->
        <div class="hero__anim hero__anim--7">
          <div class="hero__trust">
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Board Certified</span>
            </div>
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span>SIOP Member</span>
            </div>
            <div class="hero__trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
              <span>AAU Faculty</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Image Composition -->
      <div class="hero__col hero__col--image hero__anim hero__anim--img">
        <!-- Image Frame - Asymmetric -->
        <div class="hero__image-comp">
          <!-- Background decorative block -->
          <div class="hero__image-block"></div>

          <!-- Main image -->
          <div class="hero__image-main">
            <img
              src="/images/dr-gasah-profile.jpg"
              alt="Dr. Gashaw Arega - Pediatric Oncologist"
              class="hero__image"
              loading="eager"
              fetchpriority="high"
            />
            <div class="hero__image-grain"></div>
          </div>

          <!-- Overlapping accent card -->
          <div class="hero__image-accent">
            <div class="hero__accent-number">12+</div>
            <div class="hero__accent-label">Years Saving<br/>Young Lives</div>
          </div>

          <!-- Small floating badge -->
          <div class="hero__image-badge">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>TASH</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar - Redesigned -->
    <div id="hero-stats" class="hero__stats hero__anim hero__anim--8">
      <div class="hero__stats-inner">
        {#each stats as stat, i}
          <div class="hero__stat" class:hero__stat--visible={statsVisible} style="transition-delay: {i * 100}ms">
            <div class="hero__stat-number">
              {formatNumber(counters[stat.key])}{stat.suffix}
            </div>
            <div class="hero__stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>
      <div class="hero__stats-accent"></div>
    </div>

    <!-- Scroll Indicator -->
    <div class="hero__scroll hero__anim hero__anim--9">
      <a href="#about" class="hero__scroll-link">
        <span>Scroll to explore</span>
        <div class="hero__scroll-line">
          <div class="hero__scroll-dot"></div>
        </div>
      </a>
    </div>
  </div>
</section>

<style>
  /* ===== CSS Variables ===== */
  :root {
    --hero-cream: #f5f0e8;
    --hero-warm: #ebe4d6;
    --hero-ink: #1a1a2e;
    --hero-ink-soft: #4a4a6a;
    --hero-ink-muted: #8a8a9a;
    --hero-amber: #c59153;
    --hero-amber-light: #e8c88a;
    --hero-amber-glow: rgba(197, 145, 83, 0.15);

    --hero-font-display: 'Cormorant Garamond', Georgia, serif;
    --hero-font-body: 'Instrument Sans', system-ui, sans-serif;

    --hero-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --hero-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ===== Hero Section ===== */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: var(--hero-cream);
    overflow: hidden;
    font-family: var(--hero-font-body);
  }

  /* ===== Texture Overlay ===== */
  .hero__texture {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.35;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
    background-size: 512px 512px;
  }

  /* ===== Decorative Lines ===== */
  .hero__lines {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .hero__line {
    position: absolute;
    background: var(--hero-ink);
    opacity: 0.04;
  }

  .hero__line--1 {
    width: 1px;
    height: 100%;
    left: 20%;
  }

  .hero__line--2 {
    width: 1px;
    height: 100%;
    right: 20%;
  }

  .hero__line--3 {
    width: 100%;
    height: 1px;
    top: 30%;
  }

  .hero__line--4 {
    width: 100%;
    height: 1px;
    bottom: 25%;
  }

  /* ===== Geometric Accents ===== */
  .hero__geo {
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }

  .hero__geo--circle {
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--hero-amber-glow), transparent 70%);
    top: -100px;
    right: -100px;
    animation: geoFloat 20s ease-in-out infinite;
  }

  .hero__geo--ring {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 1px solid var(--hero-amber);
    opacity: 0.08;
    bottom: 10%;
    left: 5%;
    animation: geoFloat 15s ease-in-out infinite reverse;
  }

  .hero__geo--dot-cluster {
    top: 15%;
    right: 15%;
    width: 120px;
    height: 120px;
    background-image: radial-gradient(var(--hero-amber) 1px, transparent 1px);
    background-size: 12px 12px;
    opacity: 0.1;
  }

  @keyframes geoFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(20px, -15px) rotate(2deg); }
    66% { transform: translate(-10px, 10px) rotate(-1deg); }
  }

  /* ===== Container ===== */
  .hero__container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 6rem 3rem 3rem;
  }

  /* ===== Top Bar ===== */
  .hero__topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(26, 26, 46, 0.08);
  }

  .hero__topbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .hero__topbar-tag {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--hero-amber);
  }

  .hero__topbar-divider {
    color: var(--hero-ink-muted);
    opacity: 0.3;
  }

  .hero__topbar-location {
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--hero-ink-muted);
  }

  .hero__topbar-year {
    font-family: var(--hero-font-display);
    font-size: 0.9rem;
    font-weight: 500;
    font-style: italic;
    color: var(--hero-ink-muted);
  }

  /* ===== Main Grid ===== */
  .hero__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    min-height: 65vh;
  }

  @media (max-width: 1024px) {
    .hero__grid {
      grid-template-columns: 1fr;
      gap: 3rem;
      min-height: auto;
    }
  }

  /* ===== Text Column ===== */
  .hero__col--text {
    max-width: 620px;
  }

  .hero__greeting {
    font-family: var(--hero-font-body);
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--hero-amber);
    margin-bottom: 1rem;
  }

  .hero__title {
    margin-bottom: 1.5rem;
    line-height: 0.95;
  }

  .hero__title-line {
    display: block;
    font-family: var(--hero-font-display);
    color: var(--hero-ink);
    letter-spacing: -0.03em;
  }

  .hero__title-line--1 {
    font-size: clamp(3rem, 6vw, 5.5rem);
    font-weight: 300;
    color: var(--hero-ink-soft);
  }

  .hero__title-line--2 {
    font-size: clamp(4rem, 8vw, 7.5rem);
    font-weight: 700;
    background: linear-gradient(135deg, var(--hero-ink) 30%, var(--hero-amber) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero__credentials {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .hero__credential {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--hero-ink-soft);
    letter-spacing: 0.03em;
  }

  .hero__credential-sep {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--hero-amber);
    opacity: 0.6;
  }

  .hero__tagline {
    font-family: var(--hero-font-display);
    font-size: clamp(1.15rem, 2vw, 1.45rem);
    font-weight: 400;
    font-style: italic;
    color: var(--hero-ink-soft);
    line-height: 1.6;
    margin-bottom: 0.75rem;
    min-height: 2.5em;
  }

  .hero__word {
    display: inline-block;
    position: absolute;
    opacity: 0;
    transform: translateY(8px);
    color: var(--hero-amber);
    font-weight: 600;
    transition: all 0.5s var(--hero-ease-out);
  }

  .hero__word--active {
    position: relative;
    opacity: 1;
    transform: translateY(0);
  }

  .hero__amharic {
    font-size: 0.95rem;
    color: var(--hero-ink-muted);
    line-height: 1.8;
    margin-bottom: 2rem;
    max-width: 480px;
  }

  /* ===== Action Buttons ===== */
  .hero__actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
  }

  .hero__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 2rem;
    border-radius: 4px;
    font-family: var(--hero-font-body);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: all 0.35s var(--hero-ease-out);
    position: relative;
    overflow: hidden;
  }

  .hero__btn svg {
    width: 16px;
    height: 16px;
    transition: transform 0.35s var(--hero-ease-out);
  }

  .hero__btn--primary {
    background: var(--hero-ink);
    color: var(--hero-cream);
    box-shadow: 0 4px 24px rgba(26, 26, 46, 0.2);
  }

  .hero__btn--primary:hover {
    background: var(--hero-amber);
    color: var(--hero-ink);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(197, 145, 83, 0.3);
  }

  .hero__btn--primary:hover svg {
    transform: translateX(4px);
  }

  .hero__btn--outline {
    background: transparent;
    color: var(--hero-ink);
    border: 1.5px solid rgba(26, 26, 46, 0.2);
  }

  .hero__btn--outline:hover {
    border-color: var(--hero-amber);
    color: var(--hero-amber);
    transform: translateY(-2px);
  }

  /* ===== Trust Bar ===== */
  .hero__trust {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .hero__trust-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--hero-ink-muted);
    letter-spacing: 0.02em;
  }

  .hero__trust-item svg {
    width: 16px;
    height: 16px;
    color: var(--hero-amber);
    opacity: 0.7;
  }

  /* ===== Image Column ===== */
  .hero__col--image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero__image-comp {
    position: relative;
    width: 100%;
    max-width: 460px;
  }

  /* Background decorative block */
  .hero__image-block {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--hero-amber-glow), rgba(197, 145, 83, 0.05));
    border-radius: 4px;
    z-index: 0;
  }

  /* Main image */
  .hero__image-main {
    position: relative;
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;
    box-shadow:
      0 20px 60px -12px rgba(26, 26, 46, 0.15),
      0 0 0 1px rgba(26, 26, 46, 0.05);
    aspect-ratio: 3/4;
  }

  .hero__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s var(--hero-ease-out);
  }

  .hero__image-main:hover .hero__image {
    transform: scale(1.03);
  }

  .hero__image-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  /* Overlapping accent card */
  .hero__image-accent {
    position: absolute;
    bottom: -10px;
    left: -30px;
    z-index: 5;
    background: var(--hero-ink);
    color: var(--hero-cream);
    padding: 1.25rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 12px 40px rgba(26, 26, 46, 0.2);
  }

  .hero__accent-number {
    font-family: var(--hero-font-display);
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--hero-amber-light);
    margin-bottom: 0.25rem;
  }

  .hero__accent-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1.4;
    color: rgba(245, 240, 232, 0.7);
  }

  /* Small floating badge */
  .hero__image-badge {
    position: absolute;
    top: 20px;
    right: -15px;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    padding: 0.6rem 1rem;
    border-radius: 4px;
    box-shadow: 0 8px 24px rgba(26, 26, 46, 0.1);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--hero-ink);
  }

  .hero__image-badge svg {
    width: 16px;
    height: 16px;
    color: var(--hero-amber);
  }

  /* ===== Stats Bar ===== */
  .hero__stats {
    margin-top: 3.5rem;
    position: relative;
  }

  .hero__stats-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid rgba(26, 26, 46, 0.08);
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
  }

  @media (max-width: 768px) {
    .hero__stats-inner {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .hero__stats-inner {
      grid-template-columns: 1fr;
    }
  }

  .hero__stats-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 3px;
    background: var(--hero-amber);
  }

  .hero__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    border-right: 1px solid rgba(26, 26, 46, 0.06);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s var(--hero-ease-out);
  }

  .hero__stat:last-child {
    border-right: none;
  }

  .hero__stat--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero__stat-number {
    font-family: var(--hero-font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--hero-ink);
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .hero__stat-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--hero-ink-muted);
    text-align: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ===== Scroll Indicator ===== */
  .hero__scroll {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }

  .hero__scroll-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--hero-ink-muted);
    transition: color 0.3s;
  }

  .hero__scroll-link:hover {
    color: var(--hero-amber);
  }

  .hero__scroll-link span {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
  }

  .hero__scroll-line {
    width: 1px;
    height: 40px;
    background: rgba(26, 26, 46, 0.1);
    position: relative;
    overflow: hidden;
  }

  .hero__scroll-dot {
    width: 3px;
    height: 12px;
    background: var(--hero-amber);
    border-radius: 2px;
    position: absolute;
    left: -1px;
    animation: scrollMove 2s ease-in-out infinite;
  }

  @keyframes scrollMove {
    0% { top: -12px; }
    50% { top: 40px; }
    100% { top: -12px; }
  }

  /* ===== Entrance Animations ===== */
  .hero__anim {
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.8s var(--hero-ease-out);
  }

  .hero--ready .hero__anim {
    opacity: 1;
    transform: translateY(0);
  }

  .hero__anim--0 { transition-delay: 0s; }
  .hero__anim--1 { transition-delay: 0.15s; }
  .hero__anim--2 { transition-delay: 0.3s; }
  .hero__anim--3 { transition-delay: 0.45s; }
  .hero__anim--4 { transition-delay: 0.6s; }
  .hero__anim--5 { transition-delay: 0.75s; }
  .hero__anim--6 { transition-delay: 0.9s; }
  .hero__anim--7 { transition-delay: 1.05s; }
  .hero__anim--8 { transition-delay: 1.2s; }
  .hero__anim--9 { transition-delay: 1.4s; }

  .hero__anim--img {
    transition-delay: 0.35s;
    transform: translateX(30px);
  }

  .hero--ready .hero__anim--img {
    transform: translateX(0);
  }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .hero__container {
      padding: 5rem 2rem 2.5rem;
    }
    .hero__col--text {
      max-width: 100%;
      text-align: center;
    }
    .hero__credentials {
      justify-content: center;
    }
    .hero__tagline {
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .hero__amharic {
      max-width: 100%;
      text-align: center;
    }
    .hero__actions {
      justify-content: center;
    }
    .hero__trust {
      justify-content: center;
    }
    .hero__image-comp {
      max-width: 380px;
      margin: 0 auto;
    }
  }

  @media (max-width: 640px) {
    .hero__container {
      padding: 4.5rem 1.25rem 2rem;
    }
    .hero__topbar {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
    .hero__topbar-right {
      display: none;
    }
    .hero__title-line--1 {
      font-size: 2.5rem;
    }
    .hero__title-line--2 {
      font-size: 3.5rem;
    }
    .hero__actions {
      flex-direction: column;
    }
    .hero__btn {
      justify-content: center;
    }
    .hero__trust {
      flex-direction: column;
      gap: 0.75rem;
    }
    .hero__image-accent {
      left: 10px;
      bottom: 10px;
    }
    .hero__image-accent {
      padding: 1rem 1.25rem;
    }
    .hero__accent-number {
      font-size: 2rem;
    }
    .hero__image-badge {
      right: 10px;
      top: 10px;
    }
  }
</style>
