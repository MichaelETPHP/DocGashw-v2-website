<script>
  export let data;
  $: post = data?.post;

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
</script>

<svelte:head>
  <title>{post ? post.title : 'Article'} – Dr. Gashaw Arega</title>
  {#if post?.excerpt}
    <meta name="description" content={post.excerpt} />
  {/if}
</svelte:head>

<section class="section bg-white">
  <div class="container-custom max-w-2xl">
    <a href="/blog" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Blog & News
    </a>

    {#if !post}
      <p class="text-gray-600">This article was not found.</p>
    {:else}
      <article>
        <div class="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span class="font-semibold uppercase tracking-wider text-blue-600">{post.category}</span>
          <time datetime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-blue-900 mb-6">{post.title}</h1>
        {#if post.image_url}
          <img src={post.image_url} alt="" class="w-full rounded-lg shadow-md mb-6" />
        {/if}
        <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{post.body || post.excerpt}</div>
      </article>
    {/if}
  </div>
</section>
