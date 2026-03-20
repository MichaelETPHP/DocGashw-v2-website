<script>
  import { onMount } from 'svelte';

  let visible = false;

  function checkVisibility() {
    const element = document.getElementById('research');
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

  const researchIntro = "Dr. Gashaw Arega is a prolific pediatric hematology–oncology researcher with 40+ scientific publications focused on childhood cancer in low-resource settings, particularly Ethiopia. His work encompasses epidemiology, clinical outcomes, and health systems research in pediatric oncology and hematologic disorders.";

  const researchThemes = [
    { title: "Patterns & Outcomes", text: "Childhood cancer patterns and outcomes, including studies on leukemia, lymphoma, and solid tumors, with analyses of survival, morbidity, and factors influencing treatment success." },
    { title: "Brain Tumors & Diagnostic Delays", text: "Pediatric brain tumors and diagnostic delays, documenting clinical presentations, time to diagnosis, and advocating for multidisciplinary care approaches." },
    { title: "Rare Malignancies", text: "Rare pediatric malignancies, such as germ cell tumors, intracranial yolk sac tumors, and other uncommon pediatric cancers, contributing valuable case series and clinicopathological insights." },
    { title: "Service Delivery & Systems", text: "Service delivery challenges, including studies on safe chemotherapy handling, surgical infections, and barriers to early diagnosis and referral in low- and middle-income settings." },
    { title: "Survivorship & Late Effects", text: "Survivorship and late effects, highlighting the need for structured follow-up care for childhood cancer survivors." }
  ];

  const impactStats = [
    { number: '5000+', label: 'Patients Managed' },
    { number: '40+', label: 'Published Papers' },
    { number: '15+', label: 'Fellows Mentored' },
    { number: '500+', label: 'Residents Trained' },
    { number: '5+', label: 'Int\'l Collaborations' },
    { number: '2+', label: 'Grant Awards' }
  ];
</script>

<section id="research" class="research">
  <div class="research__container">
    <!-- Section Header -->
    <div class="research__header">
      <span class="research__label">Research</span>
      <h2 class="research__title">Advancing Pediatric<br/>Oncology Science</h2>
      <p class="research__subtitle">Clinical research and innovation improving childhood cancer outcomes in sub-Saharan Africa.</p>
      <div class="research__line"></div>
    </div>

    <!-- Intro -->
    <div class="research__intro" class:research__intro--visible={visible}>
      <p>{researchIntro}</p>
    </div>

    <!-- Themes Grid -->
    <div class="research__themes">
      <h3 class="research__themes-title">Key Research Themes</h3>
      <div class="research__themes-grid">
        {#each researchThemes as theme, i}
          <div
            class="research__theme"
            class:research__theme--visible={visible}
            style="transition-delay: {100 + i * 80}ms"
          >
            <div class="research__theme-num">{i + 1}</div>
            <h4 class="research__theme-title">{theme.title}</h4>
            <p class="research__theme-text">{theme.text}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Narrative + Grants -->
    <div class="research__narrative" class:research__narrative--visible={visible}>
      <div class="research__narrative-text">
        <p>Dr. Gashaw Arega's research blends clinical evidence with health systems strengthening, informing both local practice and broader policy efforts to improve pediatric oncology care in sub-Saharan Africa.</p>
      </div>

      <div class="research__grants">
        <h4 class="research__grants-title">Grant Awards & Recognition</h4>
        <p class="research__grants-intro">Recognized for contributions to service development and capacity building through major grant awards:</p>
        <div class="research__grants-list">
          <div class="research__grant">
            <span class="research__grant-num">01</span>
            <div>
              <strong>Medical Capacity Mobilization (MCM)</strong>
              <span>— Pediatric neuro-oncology capacity building</span>
            </div>
          </div>
          <div class="research__grant">
            <span class="research__grant-num">02</span>
            <div>
              <strong>Tzu Chi Charity Foundation</strong>
              <span>— Expansion of pediatric oncology services</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Impact Stats -->
    <div class="research__impact" class:research__impact--visible={visible}>
      <h3 class="research__impact-title">Research Impact</h3>
      <p class="research__impact-desc">Dr. Gashaw Arega's research has contributed to improved survival rates for children with blood cancers in Ethiopia.</p>
      <div class="research__impact-grid">
        {#each impactStats as stat, i}
          <div class="research__impact-stat" style="transition-delay: {400 + i * 60}ms">
            <span class="research__impact-number">{stat.number}</span>
            <span class="research__impact-label">{stat.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .research {
    padding: 7rem 0;
    background: #fff;
    position: relative;
  }

  .research__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .research__header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .research__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .research__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .research__subtitle {
    font-size: 1.05rem;
    color: #4a4a6a;
    max-width: 520px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .research__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  /* Intro */
  .research__intro {
    max-width: 800px;
    margin: 0 auto 4rem;
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .research__intro--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .research__intro p {
    font-size: 1.1rem;
    color: #4a4a6a;
    line-height: 1.8;
  }

  /* Themes */
  .research__themes {
    margin-bottom: 4rem;
  }

  .research__themes-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 2rem;
  }

  .research__themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .research__theme {
    background: #f5f0e8;
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 1.75rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .research__theme--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .research__theme:hover {
    box-shadow: 0 8px 24px rgba(26, 26, 46, 0.06);
    transform: translateY(-2px);
  }

  .research__theme-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1a1a2e;
    color: #c59153;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .research__theme-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .research__theme-text {
    font-size: 0.88rem;
    color: #4a4a6a;
    line-height: 1.65;
  }

  /* Narrative + Grants */
  .research__narrative {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
  }

  .research__narrative--visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .research__narrative { grid-template-columns: 1fr; }
    .research__container { padding: 0 1.25rem; }
    .research { padding: 5rem 0; }
  }

  .research__narrative-text p {
    font-size: 1.05rem;
    color: #4a4a6a;
    line-height: 1.8;
  }

  .research__grants {
    background: #f5f0e8;
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 2rem;
    border-left: 3px solid #c59153;
  }

  .research__grants-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
  }

  .research__grants-intro {
    font-size: 0.9rem;
    color: #4a4a6a;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  .research__grants-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .research__grant {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    font-size: 0.9rem;
    color: #4a4a6a;
    line-height: 1.6;
  }

  .research__grant strong {
    color: #1a1a2e;
  }

  .research__grant-num {
    flex-shrink: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #c59153;
  }

  /* Impact Stats */
  .research__impact {
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
  }

  .research__impact--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .research__impact-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .research__impact-desc {
    font-size: 0.95rem;
    color: #4a4a6a;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }

  .research__impact-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0;
    border: 1px solid rgba(26, 26, 46, 0.08);
    border-radius: 4px;
    overflow: hidden;
  }

  @media (max-width: 1024px) {
    .research__impact-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 640px) {
    .research__impact-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .research__impact-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    border-right: 1px solid rgba(26, 26, 46, 0.06);
    border-bottom: 1px solid rgba(26, 26, 46, 0.06);
  }

  .research__impact-stat:nth-child(even) {
    border-right: none;
  }

  @media (min-width: 641px) {
    .research__impact-stat:nth-child(3n) {
      border-right: none;
    }
    .research__impact-stat:nth-child(-n+3) {
      border-bottom: 1px solid rgba(26, 26, 46, 0.06);
    }
  }

  @media (min-width: 1025px) {
    .research__impact-stat {
      border-bottom: none;
    }
    .research__impact-stat:nth-child(6n) {
      border-right: none;
    }
    .research__impact-stat:nth-child(3n) {
      border-right: 1px solid rgba(26, 26, 46, 0.06);
    }
  }

  .research__impact-number {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .research__impact-label {
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #8a8a9a;
    text-align: center;
    line-height: 1.3;
  }
</style>
