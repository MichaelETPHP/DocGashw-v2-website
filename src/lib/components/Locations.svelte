<script>
  import { onMount } from 'svelte';

  let visible = false;

  function checkVisibility() {
    const element = document.getElementById('locations');
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight * 0.75) visible = true;
  }

  onMount(() => {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    return () => window.removeEventListener('scroll', checkVisibility);
  });

  const locations = [
    {
      name: "Black Lion Hospital",
      role: "Senior Consultant",
      address: "Churchill Avenue, Addis Ababa, Ethiopia",
      hours: "Monday, Wednesday, Friday: 8:00 AM - 4:00 PM",
      description: "Dr. Gashaw Arega serves as a senior consultant at Black Lion Hospital, Ethiopia's premier referral and teaching hospital. Here, he leads the pediatric hematology-oncology team and supervises complex cases referred from throughout the country.",
      type: "Public Hospital"
    },
    {
      name: "Betzata Private Clinic",
      role: "Specialist Consultant",
      address: "Bole Road, Addis Ababa, Ethiopia",
      hours: "Tuesday, Thursday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM",
      description: "At Betzata Private Clinic, Dr. Gashaw Arega provides specialized care in a private setting. The clinic offers personalized attention, shorter waiting times, and continuity of care for patients requiring ongoing treatment.",
      type: "Private Clinic"
    }
  ];
</script>

<section id="locations" class="locations">
  <div class="locations__container">
    <!-- Section Header -->
    <div class="locations__header">
      <span class="locations__label">Locations</span>
      <h2 class="locations__title">Where to Find<br/>Dr. Gashaw Arega</h2>
      <div class="locations__line" />
    </div>

    <!-- Locations Grid -->
    <div class="locations__grid">
      {#each locations as location, i}
        <div
          class="locations__card"
          class:locations__card--visible={visible}
          style="transition-delay: {i * 150}ms"
        >
          <div class="locations__card-header">
            <span class="locations__card-type">{location.type}</span>
            <h3 class="locations__card-name">{location.name}</h3>
            <span class="locations__card-role">{location.role}</span>
          </div>

          <p class="locations__card-desc">{location.description}</p>

          <div class="locations__card-details">
            <div class="locations__detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{location.address}</span>
            </div>
            <div class="locations__detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{location.hours}</span>
            </div>
          </div>

          <a href="#contact" class="locations__card-link">
            <span>Book an appointment</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

          <div class="locations__card-accent" />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .locations {
    padding: 7rem 0;
    background: #1a1a2e;
    position: relative;
    overflow: hidden;
  }

  .locations::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(197, 145, 83, 0.06), transparent 70%);
    pointer-events: none;
  }

  .locations__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
    position: relative;
    z-index: 1;
  }

  .locations__header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .locations__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .locations__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #f5f0e8;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }

  .locations__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  /* Grid */
  .locations__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .locations__grid { grid-template-columns: 1fr; }
    .locations__container { padding: 0 1.25rem; }
    .locations { padding: 5rem 0; }
  }

  /* Card */
  .locations__card {
    position: relative;
    background: rgba(245, 240, 232, 0.04);
    border: 1px solid rgba(245, 240, 232, 0.08);
    border-radius: 4px;
    padding: 2.5rem;
    overflow: hidden;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .locations__card--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .locations__card:hover {
    background: rgba(245, 240, 232, 0.07);
    border-color: rgba(197, 145, 83, 0.2);
  }

  .locations__card-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: #c59153;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .locations__card:hover .locations__card-accent {
    width: 100%;
  }

  .locations__card-header {
    margin-bottom: 1.5rem;
  }

  .locations__card-type {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #c59153;
    margin-bottom: 0.5rem;
  }

  .locations__card-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #f5f0e8;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .locations__card-role {
    font-size: 0.85rem;
    color: rgba(245, 240, 232, 0.5);
    font-weight: 500;
  }

  .locations__card-desc {
    font-size: 0.95rem;
    color: rgba(245, 240, 232, 0.6);
    line-height: 1.7;
    margin-bottom: 1.75rem;
  }

  .locations__card-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(245, 240, 232, 0.08);
  }

  .locations__detail {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.88rem;
    color: rgba(245, 240, 232, 0.6);
    line-height: 1.5;
  }

  .locations__detail svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: #c59153;
    opacity: 0.7;
    margin-top: 2px;
  }

  .locations__card-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #c59153;
    text-decoration: none;
    transition: all 0.3s;
  }

  .locations__card-link svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
  }

  .locations__card-link:hover {
    color: #e8c88a;
  }

  .locations__card-link:hover svg {
    transform: translateX(4px);
  }
</style>
