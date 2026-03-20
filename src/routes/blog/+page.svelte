<script>
  export let data;
  $: posts = data?.posts ?? [];

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
</script>

<svelte:head>
  <title>Blog & News – Dr. Gashaw Arega</title>
  <meta name="description" content="Latest updates, research highlights, and news from Dr. Gashaw Arega and pediatric oncology in Ethiopia." />
</svelte:head>

<section class="blog">
  <div class="blog__container">
    <!-- Section Header -->
    <div class="blog__header">
      <span class="blog__label">Blog & News</span>
      <h1 class="blog__title">Updates & Insights</h1>
      <p class="blog__subtitle">Research highlights, clinical updates, and news from pediatric oncology in Ethiopia and beyond.</p>
      <div class="blog__line"></div>
    </div>

    <!-- Posts grid -->
    {#if posts.length === 0}
      <p class="blog__empty">No posts yet. Check back later.</p>
    {:else}
      <div class="blog__grid">
        {#each posts as post}
          <article class="blog__card">
            <a href="/blog/{post.slug}" class="blog__card-link" title={post.title}>
              <div class="blog__card-image">
                {#if post.image_url}
                  <img src={post.image_url} alt="" class="blog__card-img" />
                {:else}
                  <div class="blog__card-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="blog__card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                {/if}
              </div>
              <div class="blog__card-body">
                <div class="blog__card-meta">
                  <span class="blog__card-category">{post.category}</span>
                  <time class="blog__card-date" datetime={post.date}>{formatDate(post.date)}</time>
                </div>
                <h2 class="blog__card-title">{post.title}</h2>
                <p class="blog__card-excerpt">{post.excerpt}</p>
              </div>
            </a>
            <div class="blog__card-accent"></div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .blog {
    padding: 7rem 0;
    background: #f5f0e8;
    position: relative;
    min-height: 60vh;
  }

  .blog__container {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .blog__header {
    text-align: center;
    margin-bottom: 4.5rem;
  }

  .blog__label {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #c59153;
    margin-bottom: 1rem;
  }

  .blog__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }

  .blog__subtitle {
    font-size: 1.05rem;
    color: #4a4a6a;
    max-width: 520px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .blog__line {
    width: 60px;
    height: 2px;
    background: #c59153;
    margin: 0 auto;
  }

  .blog__empty {
    text-align: center;
    color: #8a8a9a;
    font-size: 1rem;
    padding: 4rem 0;
  }

  .blog__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .blog__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .blog__grid {
      grid-template-columns: 1fr;
    }
    .blog__container {
      padding: 0 1.25rem;
    }
    .blog {
      padding: 5rem 0;
    }
  }

  .blog__card {
    position: relative;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blog__card:hover {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 12px 40px rgba(26, 26, 46, 0.06);
    transform: translateY(-4px);
  }

  .blog__card-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 0;
    background: #c59153;
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blog__card:hover .blog__card-accent {
    height: 100%;
  }

  .blog__card-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .blog__card-image {
    aspect-ratio: 16/10;
    background: linear-gradient(135deg, rgba(197, 145, 83, 0.08), rgba(197, 145, 83, 0.02));
    overflow: hidden;
  }

  .blog__card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blog__card-link:hover .blog__card-img {
    transform: scale(1.03);
  }

  .blog__card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blog__card-icon {
    width: 4rem;
    height: 4rem;
    color: #c59153;
    opacity: 0.4;
  }

  .blog__card-body {
    padding: 1.5rem;
  }

  .blog__card-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .blog__card-category {
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #c59153;
  }

  .blog__card-date {
    font-size: 0.8rem;
    color: #8a8a9a;
  }

  .blog__card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.3;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
  }

  .blog__card-link:hover .blog__card-title {
    color: #c59153;
  }

  .blog__card-excerpt {
    font-size: 0.9rem;
    color: #4a4a6a;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
