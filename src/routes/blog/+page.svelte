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

<!-- Page hero -->
<section class="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16 md:py-20">
  <div class="container-custom">
    <div class="max-w-2xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Blog & News</h1>
      <p class="text-blue-100 text-lg">
        Updates on pediatric oncology research, clinical care, and capacity building in Ethiopia and beyond.
      </p>
    </div>
  </div>
</section>

<!-- Posts grid -->
<section class="section bg-gray-50">
  <div class="container-custom">
    {#if posts.length === 0}
      <p class="text-gray-500 text-center py-12">No posts yet. Check back later.</p>
    {:else}
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each posts as post}
          <article class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <a href="/blog/{post.slug}" class="block group" title={post.title}>
              <div class="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                {#if post.image_url}
                  <img src={post.image_url} alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                {/if}
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-xs font-semibold uppercase tracking-wider text-blue-600">{post.category}</span>
                  <time class="text-sm text-gray-500" datetime={post.date}>{formatDate(post.date)}</time>
                </div>
                <h2 class="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>
            </a>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
