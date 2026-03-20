<script>
  import { onMount } from 'svelte';

  let visible = false;
  let expanded = false;
  let slideIndex = 0;
  let slideInterval;

  const slides = [
    { src: '/images/dr-gasah-profile.jpg', alt: 'Dr. Gashaw Arega – Pediatric Hematology Oncologist' },
    { src: '/a.png', alt: 'Dr. Gashaw Arega presenting at a medical conference' }
  ];

  const aboutIntro =
    "Dr. Gashaw Arega is a consultant pediatrician and pediatric hematology–oncology specialist based in Ethiopia, working at Tikur Anbessa Specialized Hospital and the Department of Pediatrics and Child Health at Addis Ababa University. He is dedicated to improving outcomes for children with cancer through clinical care, research, and capacity building. As part of the national pediatric oncology team, he contributes to the diagnosis, treatment, and long-term follow-up of children with hematologic and solid malignancies.";

  const aboutMore = [
    "Dr. Gashaw Arega has been actively involved in strengthening pediatric oncology services in Ethiopia, including supporting the expansion of satellite pediatric oncology centers and promoting multidisciplinary care. His academic interests focus on childhood cancer epidemiology, Acute leukemia, Lymphoma, Wilm's Tumors, neuroblastoma, pediatric brain tumors, survivorship, and health system strengthening in low- and middle-income countries. He is also engaged in several research initiatives aimed at addressing diagnostic delays, improving treatment outcomes, and developing national collaborative frameworks for pediatric oncology care.",
    "In addition to his clinical and research work, Dr. Gashaw Arega is passionate about training the next generation of pediatricians and oncology specialists. He advocates for national and international collaboration to improve access to quality cancer care for children across Ethiopia and Africa."
  ];

  function goToSlide(index) {
    slideIndex = ((index % slides.length) + slides.length) % slides.length;
  }

  function checkVisibility() {
    const element = document.getElementById('about');
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight * 0.75) visible = true;
  }

  onMount(() => {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    slideInterval = setInterval(() => {
      slideIndex = (slideIndex + 1) % slides.length;
    }, 5000);
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      if (slideInterval) clearInterval(slideInterval);
    };
  });
</script>

<section id="about" class="about">
  <div class="about__container">
    <!-- Section Header -->
    <div class="about__header">
      <span class="about__label">About</span>
      <h2 class="about__title">A Life Dedicated to<br/>Children's Health</h2>
      <div class="about__line" />
    </div>

    <div class="about__grid">
      <!-- Image Column -->
      <div class="about__image-col" class:about__image-col--visible={visible}>
        <div class="about__image-frame">
          {#each slides as slide, i}
            <div class="about__slide" class:about__slide--active={slideIndex === i}>
              <img
                src={slide.src}
                alt={slide.alt}
                class="about__img"
                loading="lazy"
                decoding="async"
              />
            </div>
          {/each}
          <div class="about__img-overlay" />
        </div>
        <div class="about__dots">
          {#each slides as _, i}
            <button
              type="button"
              class="about__dot"
              class:about__dot--active={slideIndex === i}
              aria-label="View slide {i + 1}"
              on:click={() => goToSlide(i)}
            />
          {/each}
        </div>
      </div>

      <!-- Content Column -->
      <div class="about__content" class:about__content--visible={visible}>
        <div class="about__card">
          <h3 class="about__card-title">Professional Background</h3>
          <p class="about__text">{aboutIntro}</p>
          <div
            class="about__expand"
            style="max-height: {expanded ? '700px' : '0'}; opacity: {expanded ? 1 : 0};"
          >
            <div class="about__expand-inner">
              {#each aboutMore as paragraph}
                <p class="about__text">{paragraph}</p>
              {/each}
            </div>
          </div>
          <button
            type="button"
            on:click={() => (expanded = !expanded)}
            class="about__toggle"
          >
            {expanded ? 'Show less' : 'Read more'}
            <svg xmlns="http://www.w3.org/2000/svg" class="about__chevron" class:about__chevron--open={expanded} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div class="about__card">
          <h3 class="about__card-title">Education & Expertise</h3>
          <p class="about__text">
            Dr. Gashaw Arega holds a Doctor of Medicine (MD) degree from Addis Ababa University. He completed his specialty training in Pediatrics and Child Health at Tikur Anbessa Specialized Hospital, Addis Ababa University. He pursued subspecialty fellowship training in Pediatric Hematology and Oncology at Addis Ababa University, Aga Khan University and Indus Hospital, Pakistan. In addition, he holds a Master of Public Health (MPH) degree.
          </p>
          <p class="about__text about__text--mt">
            His expertise focuses on childhood cancers, hematologic disorders, pediatric solid tumors, and strengthening pediatric oncology services in Ethiopia. He is an active member of the Ethiopian Society of Pediatric Hematology and Oncology (ESHO), Ethiopian Society of Hematology and Oncology (ESHO), SIOP Africa, and the International Society of Pediatric Oncology (SIOP).
          </p>
        </div>

        <a href="#contact" class="about__cta">
          <span>Schedule a Consultation</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .about {
    padding: 6rem 0;
    background: #f5f0e8;
    position: relative;
  }

  .about__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .about__header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .about__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .about__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }

  .about__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  .about__grid {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 4rem;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .about__grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .about__container {
      padding: 0 1.5rem;
    }
  }

  /* Image Column */
  .about__image-col {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .about__image-col--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .about__image-frame {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 20px 60px -12px rgba(26, 26, 46, 0.12);
    aspect-ratio: 4/3;
  }

  .about__slide {
    display: none;
    width: 100%;
    height: 100%;
  }

  .about__slide--active {
    display: block;
    animation: aboutFade 0.5s ease;
  }

  @keyframes aboutFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .about__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .about__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(26, 26, 46, 0.15) 100%);
    pointer-events: none;
  }

  .about__dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .about__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(26, 26, 46, 0.15);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .about__dot:hover {
    background: rgba(197, 145, 83, 0.4);
  }

  .about__dot--active {
    background: #c59153;
    transform: scale(1.2);
  }

  /* Content Column */
  .about__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
  }

  .about__content--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .about__card {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    padding: 2rem;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .about__card:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px rgba(26, 26, 46, 0.06);
  }

  .about__card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .about__text {
    color: #4a4a6a;
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .about__text--mt {
    margin-top: 1rem;
  }

  .about__expand {
    overflow: hidden;
    transition: max-height 0.35s ease-out, opacity 0.25s ease;
  }

  .about__expand-inner {
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .about__toggle {
    margin-top: 1.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: rgba(197, 145, 83, 0.1);
    color: #c59153;
    border: none;
    border-radius: 3px;
    font-weight: 600;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .about__toggle:hover {
    background: rgba(197, 145, 83, 0.18);
  }

  .about__chevron {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  .about__chevron--open {
    transform: rotate(180deg);
  }

  .about__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 2rem;
    background: #1a1a2e;
    color: #f5f0e8;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    align-self: flex-start;
  }

  .about__cta svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
  }

  .about__cta:hover {
    background: #c59153;
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(197, 145, 83, 0.25);
  }

  .about__cta:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    .about {
      padding: 4rem 0;
    }
    .about__container {
      padding: 0 1.25rem;
    }
    .about__header {
      margin-bottom: 3rem;
    }
    .about__card {
      padding: 1.5rem;
    }
  }
</style>
