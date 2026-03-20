<script>
  import { onMount } from 'svelte';

  const currentYear = new Date().getFullYear();
  let officeHours = [];
  let loadingHours = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      officeHours = (data.locations || []).map((loc) => ({
        name: loc.name,
        hours: loc.hours
      }));
    } catch (err) {
      console.error('Failed to load office hours:', err);
    } finally {
      loadingHours = false;
    }
  });
</script>

<footer class="footer">
  <!-- Decorative Top Line -->
  <div class="footer__accent"></div>

  <div class="footer__container">
    <div class="footer__grid">
      <!-- Brand Column -->
      <div class="footer__brand">
        <a href="/" class="footer__logo">
          <div class="footer__logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#1a1a2e" />
              <path d="M16 22s-7-4.5-7-9c0-2.5 1.75-4.25 3.85-4.25 1.4 0 2.45.7 3.15 1.75.7-1.05 1.75-1.75 3.15-1.75 2.1 0 3.85 1.75 3.85 4.25 0 4.5-7 9-7 9z" fill="#c59153" opacity="0.9" />
            </svg>
          </div>
          <div>
            <span class="footer__logo-name">Dr. Gashaw Arega</span>
            <span class="footer__logo-title">Pediatric Oncologist</span>
          </div>
        </a>
        <p class="footer__desc">
          Dedicated to advancing pediatric hematology and oncology care in Ethiopia through clinical excellence and innovative research.
        </p>
        <div class="footer__socials">
          <a href="mailto:gashawarega@gmail.com" class="footer__social" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
          <a href="tel:+251911417235" class="footer__social" aria-label="Phone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </a>
          <a href="https://wa.me/251911417235" target="_blank" rel="noopener" class="footer__social" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://t.me/DrGashawA" target="_blank" rel="noopener" class="footer__social" aria-label="Telegram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer__col">
        <h4 class="footer__col-title">Quick Links</h4>
        <nav class="footer__nav">
          {#each ['About', 'Education', 'Services', 'Research', 'Locations', 'Contact'] as link}
            <a href="#{link.toLowerCase()}" class="footer__link">{link}</a>
          {/each}
          <a href="/blog" class="footer__link">Blog & News</a>
        </nav>
      </div>

      <!-- Office Hours (from admin) -->
      <div class="footer__col">
        <h4 class="footer__col-title">Office Hours</h4>
        <div class="footer__hours">
          {#if loadingHours}
            <div class="footer__hours-placeholder">Loading…</div>
          {:else if officeHours.length === 0}
            <div class="footer__hours-placeholder">No hours available</div>
          {:else}
            {#each officeHours as loc}
              <div class="footer__hours-card">
                <h5 class="footer__hours-name">{loc.name}</h5>
                <div class="footer__hours-row">
                  <span>{loc.hours}</span>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer__bottom">
      <p class="footer__copyright">&copy; {currentYear} Dr. Gashaw Arega. All rights reserved.</p>
      <p class="footer__madeby">
        Made with
        <svg class="footer__heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        for children fighting cancer
      </p>
    </div>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    background: #1a1a2e;
    overflow: hidden;
  }

  .footer__accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, #c59153, transparent);
  }

  .footer__container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 3rem 1.5rem;
  }

  .footer__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 3rem;
  }

  @media (max-width: 900px) {
    .footer__grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  /* Brand */
  .footer__brand {
    max-width: 360px;
  }

  .footer__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    margin-bottom: 1.25rem;
  }

  .footer__logo-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
  }

  .footer__logo-icon svg {
    width: 100%;
    height: 100%;
  }

  .footer__logo-name {
    display: block;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f5f0e8;
  }

  .footer__logo-title {
    display: block;
    font-size: 0.68rem;
    color: rgba(245, 240, 232, 0.4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }

  .footer__desc {
    font-size: 0.88rem;
    color: rgba(245, 240, 232, 0.5);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .footer__socials {
    display: flex;
    gap: 0.5rem;
  }

  .footer__social {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: rgba(245, 240, 232, 0.05);
    border: 1px solid rgba(245, 240, 232, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(245, 240, 232, 0.5);
    transition: all 0.2s;
  }

  .footer__social:hover {
    background: rgba(197, 145, 83, 0.15);
    border-color: rgba(197, 145, 83, 0.3);
    color: #e8c88a;
    transform: translateY(-2px);
  }

  .footer__social svg {
    width: 16px;
    height: 16px;
  }

  /* Columns */
  .footer__col-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    color: #f5f0e8;
    margin-bottom: 1.25rem;
  }

  .footer__nav {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .footer__link {
    font-size: 0.85rem;
    color: rgba(245, 240, 232, 0.5);
    text-decoration: none;
    padding: 0.3rem 0;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .footer__link::before {
    content: '';
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(197, 145, 83, 0.4);
    transition: all 0.2s;
  }

  .footer__link:hover {
    color: #f5f0e8;
  }

  .footer__link:hover::before {
    background: #c59153;
    transform: scale(1.5);
  }

  /* Hours */
  .footer__hours {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer__hours-card {
    background: rgba(245, 240, 232, 0.04);
    border: 1px solid rgba(245, 240, 232, 0.06);
    border-radius: 4px;
    padding: 1rem 1.1rem;
  }

  .footer__hours-name {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: #c59153;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
  }

  .footer__hours-row {
    font-size: 0.8rem;
    color: rgba(245, 240, 232, 0.5);
    padding: 0.2rem 0;
    line-height: 1.5;
    white-space: pre-line;
  }

  .footer__hours-placeholder {
    font-size: 0.8rem;
    color: rgba(245, 240, 232, 0.35);
    padding: 1rem 0;
  }

  /* Bottom */
  .footer__bottom {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(245, 240, 232, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer__copyright {
    font-size: 0.78rem;
    color: rgba(245, 240, 232, 0.3);
  }

  .footer__madeby {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    color: rgba(245, 240, 232, 0.3);
  }

  .footer__heart {
    width: 13px;
    height: 13px;
    color: #ef4444;
  }

  @media (max-width: 640px) {
    .footer__container {
      padding: 3rem 1.25rem 1.25rem;
    }
    .footer__bottom {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
