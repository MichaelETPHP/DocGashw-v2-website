<script>
  import { page } from '$app/stores';
  export let data;
  $: post = data?.post;
  $: shareUrl = $page?.url?.href ?? '';

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<svelte:head>
  <title>{post ? post.title : 'Article'} – Dr. Gashaw Arega</title>
  {#if post?.excerpt}
    <meta name="description" content={post.excerpt} />
  {/if}
</svelte:head>

<section class="blog-post">
  <div class="blog-post__container">
    <a href="/blog" class="blog-post__back">
      <svg xmlns="http://www.w3.org/2000/svg" class="blog-post__back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Blog & News
    </a>

    {#if !post}
      <p class="blog-post__not-found">This article was not found.</p>
    {:else}
      <article class="blog-post__article">
        <div class="blog-post__meta">
          <span class="blog-post__category">{post.category}</span>
          <time class="blog-post__date" datetime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 class="blog-post__title">{post.title}</h1>
        {#if post.image_url}
          <img src={post.image_url} alt="" class="blog-post__image" />
        {/if}
        <div class="blog-post__body">{post.body || post.excerpt}</div>

        <div class="blog-post__share">
          <span class="blog-post__share-label">Share</span>
          <div class="blog-post__share-btns">
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(shareUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              class="blog-post__share-btn"
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(shareUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              class="blog-post__share-btn"
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </article>
    {/if}
  </div>
</section>

<style>
  .blog-post {
    padding: 7rem 0 5rem;
    background: #f5f0e8;
    min-height: 60vh;
  }

  .blog-post__container {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .blog-post__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #c59153;
    text-decoration: none;
    margin-bottom: 2.5rem;
    transition: color 0.2s, gap 0.2s;
  }

  .blog-post__back:hover {
    color: #a67840;
    gap: 0.65rem;
  }

  .blog-post__back-icon {
    width: 20px;
    height: 20px;
  }

  .blog-post__not-found {
    color: #4a4a6a;
    font-size: 1rem;
    text-align: center;
    padding: 4rem 0;
  }

  .blog-post__article {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(26, 26, 46, 0.06);
    border-radius: 4px;
    padding: 2.5rem;
  }

  .blog-post__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .blog-post__category {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #c59153;
  }

  .blog-post__date {
    font-size: 0.9rem;
    color: #8a8a9a;
  }

  .blog-post__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.25;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }

  .blog-post__image {
    width: 100%;
    border-radius: 4px;
    margin-bottom: 2rem;
    box-shadow: 0 12px 40px rgba(26, 26, 46, 0.08);
  }

  .blog-post__body {
    font-size: 1.05rem;
    color: #4a4a6a;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  .blog-post__body :global(h1),
  .blog-post__body :global(h2),
  .blog-post__body :global(h3) {
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: #1a1a2e;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .blog-post__body :global(h1) { font-size: 1.5rem; }
  .blog-post__body :global(h2) { font-size: 1.35rem; }
  .blog-post__body :global(h3) { font-size: 1.2rem; }

  .blog-post__body :global(p) {
    margin-bottom: 1rem;
  }

  .blog-post__body :global(ul),
  .blog-post__body :global(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .blog-post__body :global(li) {
    margin-bottom: 0.5rem;
  }

  .blog-post__body :global(a) {
    color: #c59153;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .blog-post__body :global(a:hover) {
    color: #a67840;
  }

  /* Share section */
  .blog-post__share {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(26, 26, 46, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .blog-post__share-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8a8a9a;
  }

  .blog-post__share-btns {
    display: flex;
    gap: 0.75rem;
  }

  .blog-post__share-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    color: #4a4a6a;
    background: rgba(26, 26, 46, 0.04);
    border: 1px solid rgba(26, 26, 46, 0.08);
    transition: all 0.2s;
  }

  .blog-post__share-btn:hover {
    background: rgba(197, 145, 83, 0.08);
    border-color: rgba(197, 145, 83, 0.2);
    color: #1a1a2e;
  }

  .blog-post__share-btn svg {
    width: 18px;
    height: 18px;
  }

  .blog-post__share-btn:first-child:hover {
    color: #0a66c2;
    border-color: rgba(10, 102, 194, 0.3);
  }

  .blog-post__share-btn:last-child:hover {
    color: #1877f2;
    border-color: rgba(24, 119, 242, 0.3);
  }

  @media (max-width: 640px) {
    .blog-post__container {
      padding: 0 1.25rem;
    }
    .blog-post {
      padding: 5rem 0 3rem;
    }
    .blog-post__article {
      padding: 1.5rem;
    }
  }
</style>
