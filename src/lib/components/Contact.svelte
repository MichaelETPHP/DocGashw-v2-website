<script>
  import { onMount } from 'svelte';
  import BookingForm from './BookingForm.svelte';

  let visible = false;
  let name = '';
  let email = '';
  let phone = '';
  let message = '';
  let formSubmitted = false;
  let formError = false;
  let activeTab = 'contact';

  function checkVisibility() {
    const element = document.getElementById('contact');
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

  function handleSubmit(event) {
    event.preventDefault();
    if (!name || !email || !message) {
      formError = true;
      return;
    }
    formSubmitted = true;
    formError = false;
    name = '';
    email = '';
    phone = '';
    message = '';
  }

  function setActiveTab(tab) {
    activeTab = tab;
  }
</script>

<section id="contact" class="contact">
  <div class="contact__container">
    <!-- Section Header -->
    <div class="contact__header">
      <span class="contact__label">Contact</span>
      <h2 class="contact__title">Get in Touch</h2>
      <p class="contact__subtitle">Schedule an appointment or inquire about consultations with Dr. Gashaw Arega.</p>
      <div class="contact__line"></div>
    </div>

    <!-- Quick Contact Links -->
    <div class="contact__quick" class:contact__quick--visible={visible}>
      <a href="mailto:gashawarega@gmail.com" class="contact__quick-link">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span>gashawarega@gmail.com</span>
      </a>
      <a href="tel:+251911417235" class="contact__quick-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        <span>+251 911 417 235</span>
      </a>
      <a href="https://wa.me/251911417235" target="_blank" rel="noopener noreferrer" class="contact__quick-link contact__quick-link--whatsapp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>WhatsApp</span>
      </a>
      <a href="https://t.me/DrGashawA" target="_blank" rel="noopener noreferrer" class="contact__quick-link contact__quick-link--telegram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        <span>Telegram</span>
      </a>
    </div>

    <!-- Tabs: Send Message / Book Appointment - hidden for now (set showTabs = true to restore) -->
    {#if false}
    <div class="contact__tabs" class:contact__tabs--visible={visible}>
      <button
        class="contact__tab"
        class:contact__tab--active={activeTab === 'contact'}
        on:click={() => setActiveTab('contact')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        <span>Send Message</span>
      </button>
      <button
        class="contact__tab"
        class:contact__tab--active={activeTab === 'booking'}
        on:click={() => setActiveTab('booking')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span>Book Appointment</span>
      </button>
    </div>
    {/if}

    <!-- Content Grid -->
    <div class="contact__grid">
      <!-- Contact Info -->
      <div class="contact__info" class:contact__info--visible={visible}>
        <div class="contact__info-card">
          <h3 class="contact__info-title">Contact Information</h3>

          <div class="contact__info-items">
            <div class="contact__info-item">
              <div class="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <h4>Email</h4>
                <a href="mailto:gashawarega@gmail.com">gashawarega@gmail.com</a>
                <p>For appointments and inquiries</p>
              </div>
            </div>

            <div class="contact__info-item">
              <div class="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <h4>Phone</h4>
                <a href="tel:+251911417235">+251 911 417 235</a>
                <a href="tel:+251947433309">+251 947 433 309</a>
                <p>Monday to Friday, 9AM-5PM</p>
              </div>
            </div>

            <div class="contact__info-item">
              <div class="contact__info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h4>Working Hours</h4>
                <p><strong>Black Lion Hospital:</strong> Mon, Wed, Fri (8AM-4PM)</p>
                <p><strong>Betzata Clinic:</strong> Tue, Thu (9AM-6PM), Sat (9AM-1PM)</p>
              </div>
            </div>
          </div>

          <!-- Emergency -->
          <div class="contact__emergency">
            <div class="contact__emergency-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h4>Emergency Contact</h4>
              <p>For urgent medical matters, contact Black Lion Hospital emergency department:</p>
              <a href="tel:+251115513456">+251 11 551 3456</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Form / Booking -->
      <div class="contact__form-wrap" class:contact__form-wrap--visible={visible}>
        {#if activeTab === 'contact'}
          {#if formSubmitted}
            <div class="contact__success">
              <div class="contact__success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Dr. Gashaw Arega's office will contact you shortly.</p>
              <button on:click={() => formSubmitted = false} class="contact__success-btn">Send Another Message</button>
            </div>
          {:else}
            <form on:submit={handleSubmit} class="contact__form">
              <h3 class="contact__form-title">Send a Message</h3>

              {#if formError}
                <div class="contact__error">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p>Please fill in all required fields.</p>
                </div>
              {/if}

              <div class="contact__field">
                <label for="name">Full Name *</label>
                <input type="text" id="name" bind:value={name} required placeholder="Your full name" />
              </div>

              <div class="contact__field">
                <label for="email">Email Address *</label>
                <input type="email" id="email" bind:value={email} required placeholder="Your email address" />
              </div>

              <div class="contact__field">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" bind:value={phone} placeholder="Your phone number (optional)" />
              </div>

              <div class="contact__field">
                <label for="message">Message *</label>
                <textarea id="message" bind:value={message} rows="4" required placeholder="Your message to Dr. Gashaw Arega"></textarea>
              </div>

              <button type="submit" class="contact__submit">
                <span>Send Message</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              <p class="contact__policy">* Required fields. By submitting, you agree to our privacy policy.</p>
            </form>
          {/if}
        {:else if activeTab === 'booking'}
          <BookingForm />
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .contact {
    padding: 7rem 0;
    background: #f5f0e8;
    position: relative;
  }

  .contact__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .contact__header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .contact__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .contact__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .contact__subtitle {
    font-size: 1.05rem;
    color: #4a4a6a;
    max-width: 500px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .contact__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  /* Quick Links */
  .contact__quick {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .contact__quick--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .contact__quick-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(26, 26, 46, 0.08);
    border-radius: 4px;
    font-size: 0.82rem;
    font-weight: 500;
    color: #1a1a2e;
    text-decoration: none;
    transition: all 0.2s;
  }

  .contact__quick-link svg {
    width: 16px;
    height: 16px;
    color: #4a4a6a;
  }

  .contact__quick-link:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: #c59153;
    transform: translateY(-1px);
  }

  .contact__quick-link:hover svg {
    color: #c59153;
  }

  .contact__quick-link--whatsapp svg { color: #25D366; }
  .contact__quick-link--telegram svg { color: #0088cc; }

  /* Tabs */
  .contact__tabs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
  }

  .contact__tabs--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .contact__tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1.5px solid rgba(26, 26, 46, 0.12);
    border-radius: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #4a4a6a;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .contact__tab svg {
    width: 16px;
    height: 16px;
  }

  .contact__tab:hover {
    border-color: #c59153;
    color: #c59153;
  }

  .contact__tab--active {
    background: #1a1a2e;
    border-color: #1a1a2e;
    color: #f5f0e8;
  }

  .contact__tab--active:hover {
    background: #c59153;
    border-color: #c59153;
    color: #1a1a2e;
  }

  /* Grid */
  .contact__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  @media (max-width: 900px) {
    .contact__grid { grid-template-columns: 1fr; }
    .contact__container { padding: 0 1.25rem; }
    .contact { padding: 5rem 0; }
  }

  /* Info Card */
  .contact__info {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
  }

  .contact__info--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .contact__info-card {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 2rem;
  }

  .contact__info-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(26, 26, 46, 0.08);
  }

  .contact__info-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact__info-item {
    display: flex;
    gap: 1rem;
  }

  .contact__info-icon {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: rgba(197, 145, 83, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .contact__info-icon svg {
    width: 18px;
    height: 18px;
    color: #c59153;
  }

  .contact__info-item h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.25rem;
  }

  .contact__info-item a {
    display: block;
    font-size: 0.9rem;
    color: #c59153;
    text-decoration: none;
    transition: color 0.2s;
  }

  .contact__info-item a:hover {
    color: #a67840;
  }

  .contact__info-item p {
    font-size: 0.82rem;
    color: #8a8a9a;
    margin-top: 0.2rem;
    line-height: 1.4;
  }

  .contact__info-item p strong {
    color: #4a4a6a;
    font-weight: 600;
  }

  /* Emergency */
  .contact__emergency {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(26, 26, 46, 0.08);
    background: rgba(197, 145, 83, 0.06);
    border-radius: 4px;
    padding: 1.25rem;
    margin-bottom: 0;
  }

  .contact__emergency-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(197, 145, 83, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .contact__emergency-icon svg {
    width: 18px;
    height: 18px;
    color: #c59153;
  }

  .contact__emergency h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.25rem;
  }

  .contact__emergency p {
    font-size: 0.82rem;
    color: #4a4a6a;
    line-height: 1.5;
    margin-bottom: 0.25rem;
  }

  .contact__emergency a {
    font-size: 0.9rem;
    font-weight: 600;
    color: #c59153;
    text-decoration: none;
  }

  .contact__emergency a:hover {
    color: #a67840;
  }

  /* Form */
  .contact__form-wrap {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;
  }

  .contact__form-wrap--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .contact__form {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 2rem;
  }

  .contact__form-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(26, 26, 46, 0.08);
  }

  .contact__error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.15);
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }

  .contact__error svg {
    width: 18px;
    height: 18px;
    color: #ef4444;
    flex-shrink: 0;
  }

  .contact__error p {
    font-size: 0.85rem;
    color: #dc2626;
  }

  .contact__field {
    margin-bottom: 1.25rem;
  }

  .contact__field label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.4rem;
    letter-spacing: 0.02em;
  }

  .contact__field input,
  .contact__field textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.12);
    border-radius: 4px;
    font-size: 0.9rem;
    color: #1a1a2e;
    transition: all 0.2s;
    font-family: 'Instrument Sans', system-ui, sans-serif;
  }

  .contact__field input::placeholder,
  .contact__field textarea::placeholder {
    color: #8a8a9a;
  }

  .contact__field input:focus,
  .contact__field textarea:focus {
    outline: none;
    border-color: #c59153;
    box-shadow: 0 0 0 3px rgba(197, 145, 83, 0.1);
  }

  .contact__field textarea {
    resize: none;
  }

  .contact__submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
    padding: 0.9rem 2rem;
    background: #1a1a2e;
    color: #f5f0e8;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Instrument Sans', system-ui, sans-serif;
  }

  .contact__submit svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
  }

  .contact__submit:hover {
    background: #c59153;
    color: #1a1a2e;
  }

  .contact__submit:hover svg {
    transform: translateX(4px);
  }

  .contact__policy {
    font-size: 0.75rem;
    color: #8a8a9a;
    margin-top: 1rem;
    line-height: 1.5;
  }

  /* Success */
  .contact__success {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 3rem 2rem;
    text-align: center;
  }

  .contact__success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .contact__success-icon svg {
    width: 28px;
    height: 28px;
    color: #22c55e;
  }

  .contact__success h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
  }

  .contact__success p {
    font-size: 0.95rem;
    color: #4a4a6a;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .contact__success-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: #1a1a2e;
    color: #f5f0e8;
    border: none;
    border-radius: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Instrument Sans', system-ui, sans-serif;
  }

  .contact__success-btn:hover {
    background: #c59153;
    color: #1a1a2e;
  }
</style>
