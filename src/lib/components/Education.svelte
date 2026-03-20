<script>
  import { onMount } from 'svelte';

  let visible = false;

  function checkVisibility() {
    const element = document.getElementById('education');
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

  const educationText =
    "Dr. Gashaw Arega holds a Doctor of Medicine (MD) degree from Addis Ababa University. He completed his specialty training in Pediatrics and Child Health at Tikur Anbessa Specialized Hospital, Addis Ababa University. He pursued subspecialty fellowship training in Pediatric Hematology and Oncology at Addis Ababa University, Aga Khan University and Indus Hospital, Pakistan. In addition, he holds a Master of Public Health (MPH) degree.";

  const expertiseText =
    "His expertise focuses on childhood cancers, hematologic disorders, pediatric solid tumors, and strengthening pediatric oncology services in Ethiopia. He is an active member of the Ethiopian Society of Pediatric Hematology and Oncology (ESHO), Ethiopian Society of Hematology and Oncology (ESHO), SIOP Africa, and the International Society of Pediatric Oncology (SIOP).";
</script>

<section id="education" class="education">
  <div class="education__container">
    <div class="education__header">
      <span class="education__label">Education & Expertise</span>
      <h2 class="education__title">Training & Professional<br/>Memberships</h2>
      <div class="education__line"></div>
    </div>

    <div class="education__content" class:education__content--visible={visible}>
      <div class="education__card">
        <h3 class="education__card-title">Education</h3>
        <p class="education__text">{educationText}</p>
      </div>
      <div class="education__card">
        <h3 class="education__card-title">Expertise & Memberships</h3>
        <p class="education__text">{expertiseText}</p>
      </div>
      <a href="#contact" class="education__cta">
        <span>Schedule a Consultation</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

<style>
  .education {
    padding: 7rem 0;
    background: #fff;
    position: relative;
  }

  .education__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .education__header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .education__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .education__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }

  .education__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  .education__content {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .education__content--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .education__card {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    padding: 2rem;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .education__card:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 32px rgba(26, 26, 46, 0.06);
  }

  .education__card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .education__text {
    color: #4a4a6a;
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .education__cta {
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

  .education__cta svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
  }

  .education__cta:hover {
    background: #c59153;
    color: #1a1a2e;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(197, 145, 83, 0.25);
  }

  .education__cta:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    .education {
      padding: 5rem 0;
    }
    .education__container {
      padding: 0 1.25rem;
    }
    .education__card {
      padding: 1.5rem;
    }
  }
</style>
