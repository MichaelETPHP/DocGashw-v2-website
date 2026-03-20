<script>
  import { onMount } from 'svelte';

  let visible = false;

  function checkVisibility() {
    const element = document.getElementById('services');
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

  const services = [
    {
      num: '01',
      title: 'Pediatric Cancer Care',
      titleAm: 'የህፃናት የካንሰር ህክምና',
      description: 'Childhood cancer diagnosis & treatment, blood cancer management & comprehensive follow-up care for young patients.',
      tags: ['Diagnosis', 'Treatment', 'Follow-up']
    },
    {
      num: '02',
      title: 'Transplant & Immunodeficiency',
      titleAm: 'የቅድመና ድኅረ ንቅለ ተከላ',
      description: 'Pre- & post-transplant consultation and primary immunodeficiency diagnosis & management services.',
      tags: ['Transplant', 'Immunodeficiency', 'Consultation']
    },
    {
      num: '03',
      title: 'Blood Disorders',
      titleAm: 'የደም ህመሞች ምርመራ',
      description: 'Diagnosis and treatment of anemia, bleeding disorders, thrombosis, and other hematological conditions in children.',
      tags: ['Anemia', 'Bleeding', 'Thrombosis']
    },
    {
      num: '04',
      title: 'Bone Marrow & Blood Cancer',
      titleAm: 'የአጥንት መቅኔ ምርመራ',
      description: 'Bone marrow biopsy & evaluation, and treatment of bone marrow failure syndromes in pediatric patients.',
      tags: ['Biopsy', 'Evaluation', 'Treatment']
    },
    {
      num: '05',
      title: 'Patient Consultations',
      titleAm: 'የታካሚ ምክር',
      description: 'Comprehensive evaluations and second opinions for complex hematological and oncological conditions.',
      tags: ['Second Opinion', 'Evaluation', 'Planning']
    },
    {
      num: '06',
      title: 'Family Support & Education',
      titleAm: 'የቤተሰብ ድጋፍ',
      description: 'Guidance and resources for families navigating pediatric cancer diagnosis, treatment, and survivorship journey.',
      tags: ['Support', 'Education', 'Resources']
    }
  ];
</script>

<section id="services" class="services">
  <div class="services__container">
    <!-- Section Header -->
    <div class="services__header">
      <span class="services__label">Services & Specialties</span>
      <h2 class="services__title">Comprehensive Care for<br/>Young Patients</h2>
      <p class="services__subtitle">Specialized care for children with blood disorders and cancer, delivered with compassion and expertise.</p>
      <div class="services__line" />
    </div>

    <!-- Services Grid -->
    <div class="services__grid">
      {#each services as service, i}
        <div
          class="services__card"
          class:services__card--visible={visible}
          style="transition-delay: {i * 80}ms"
        >
          <div class="services__card-num">{service.num}</div>
          <h3 class="services__card-title">{service.title}</h3>
          <p class="services__card-amharic">{service.titleAm}</p>
          <p class="services__card-desc">{service.description}</p>
          <div class="services__card-tags">
            {#each service.tags as tag}
              <span class="services__tag">{tag}</span>
            {/each}
          </div>
          <div class="services__card-accent" />
        </div>
      {/each}
    </div>

    <!-- CTA -->
    <div class="services__cta-wrap" class:services__cta-wrap--visible={visible}>
      <a href="#contact" class="services__cta">
        <span>Book an Appointment</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

<style>
  .services {
    padding: 7rem 0;
    background: #f5f0e8;
    position: relative;
  }

  .services__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .services__header {
    text-align: center;
    margin-bottom: 4.5rem;
  }

  .services__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .services__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .services__subtitle {
    font-size: 1.05rem;
    color: #4a4a6a;
    max-width: 520px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .services__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  /* Grid */
  .services__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .services__grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    .services__grid { grid-template-columns: 1fr; }
    .services__container { padding: 0 1.25rem; }
    .services { padding: 5rem 0; }
  }

  /* Card */
  .services__card {
    position: relative;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 2rem;
    overflow: hidden;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .services__card--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .services__card:hover {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 12px 40px rgba(26, 26, 46, 0.06);
    transform: translateY(-4px);
  }

  .services__card-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 0;
    background: #c59153;
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .services__card:hover .services__card-accent {
    height: 100%;
  }

  .services__card-num {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 300;
    color: rgba(197, 145, 83, 0.2);
    line-height: 1;
    margin-bottom: 0.75rem;
  }

  .services__card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .services__card-amharic {
    font-size: 0.78rem;
    color: #8a8a9a;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .services__card-desc {
    font-size: 0.9rem;
    color: #4a4a6a;
    line-height: 1.65;
    margin-bottom: 1.25rem;
  }

  .services__card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .services__tag {
    font-size: 0.68rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.6rem;
    background: rgba(197, 145, 83, 0.08);
    color: #c59153;
    border-radius: 2px;
  }

  /* CTA */
  .services__cta-wrap {
    text-align: center;
    margin-top: 3.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
  }

  .services__cta-wrap--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .services__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 2.5rem;
    background: #1a1a2e;
    color: #f5f0e8;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .services__cta svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
  }

  .services__cta:hover {
    background: #c59153;
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(197, 145, 83, 0.25);
  }

  .services__cta:hover svg {
    transform: translateX(4px);
  }
</style>
