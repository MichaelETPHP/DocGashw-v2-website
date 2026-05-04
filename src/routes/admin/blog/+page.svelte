<script>
  export let data;
  $: posts = data?.posts ?? [];

  // Form state
  let showForm = false;
  let editingPost = null;
  let title = '';
  let body = '';
  let category = 'Research';
  let externalUrls = [];
  let currentExternalUrl = '';
  let imageFiles = [];
  let imagePreviews = [];
  let isUploading = false;
  let isSubmitting = false;
  let submitProgress = 0;
  let message = '';
  let messageType = 'success';
  let loading = false;

  // Filter
  let searchQuery = '';
  let filterCategory = 'all';

  let deletingSlug = '';
  let togglingSlug = '';
  let toastMessage = '';
  let expandedSlug = '';
  $: filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  $: slug = slugify(title);

  // Body scroll lock
  $: {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = showForm ? 'hidden' : '';
    }
  }

  $: postProgress = showForm ? Math.min(100, Math.round(
    (title ? 30 : 0) + (body ? 50 : 0) + (imagePreviews.length > 0 ? 20 : 0)
  )) : 0;

  $: progressColor = postProgress < 34 ? '#ef4444' : postProgress < 67 ? '#f59e0b' : postProgress < 100 ? '#3b82f6' : '#22c55e';

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Allow all Unicode letters and numbers
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function openCreateForm() {
    editingPost = null;
    title = '';
    body = '';
    category = 'Research';
    externalUrls = [];
    imageFiles = [];
    imagePreviews = [];
    message = '';
    submitProgress = 0;
    isSubmitting = false;
    showForm = true;
  }

  function openEditForm(post) {
    if (post) {
      editingPost = post;
      title = post.title;
      body = post.body || '';
      category = post.category;
      externalUrls = (post.images?.filter(url => url.startsWith('http') && !url.includes('supabase')) || [])
        .map(url => url.includes('db.selamdelivery.xyz') ? `/api/proxy/image?url=${encodeURIComponent(url.replace('https://', 'http://'))}` : url);
      imageFiles = [];
      imagePreviews = (post.images || (post.image_url ? [post.image_url] : []))
        .map(url => url.includes('db.selamdelivery.xyz') ? `/api/proxy/image?url=${encodeURIComponent(url.replace('https://', 'http://'))}` : url);
    } else {
      editingPost = null;
      title = '';
      body = '';
      category = 'Research';
      externalUrls = [];
      imageFiles = [];
      imagePreviews = [];
    }
    message = '';
    submitProgress = 0;
    isSubmitting = false;
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingPost = null;
    imageFiles = [];
    imagePreviews = [];
    message = '';
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
  }

  function handlePaste(e) {
    if (!showForm) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      addFiles(pastedFiles);
      e.preventDefault();
    }
  }

  function addFiles(files) {
    const remaining = 4 - imageFiles.length;
    const toAdd = files.slice(0, remaining);
    
    toAdd.forEach(file => {
      imageFiles = [...imageFiles, file];
      imagePreviews = [...imagePreviews, URL.createObjectURL(file)];
    });

    if (files.length > remaining) {
      message = 'Limit of 4 images reached.';
      messageType = 'error';
    }
  }

  function removeImage(index, isExternal = false) {
    if (isExternal) {
      externalUrls = externalUrls.filter((_, i) => i !== index);
    } else {
      imageFiles = imageFiles.filter((_, i) => i !== index);
    }
    imagePreviews = imagePreviews.filter((_, i) => i !== index);
  }

  function addExternalUrl() {
    if (!currentExternalUrl) return;
    
    if (!currentExternalUrl.startsWith('https://')) {
      message = 'URL must start with https://';
      messageType = 'error';
      return;
    }

    if (!externalUrls.includes(currentExternalUrl)) {
      if (externalUrls.length + imageFiles.length >= 4) {
        message = 'Limit of 4 images reached.';
        messageType = 'error';
        return;
      }
      externalUrls = [...externalUrls, currentExternalUrl];
      imagePreviews = [...imagePreviews, currentExternalUrl];
      currentExternalUrl = '';
      message = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    message = '';
    loading = true;
    isSubmitting = true;
    submitProgress = 10;

    try {
      // 1. Auto-generate excerpt internally
      const autoExcerpt = body
        .replace(/[#*`]/g, '')
        .substring(0, 180)
        .trim() + '...';

      // 2. Upload multiple images
      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        isUploading = true;
        const totalFiles = imageFiles.length;
        
        for (let i = 0; i < totalFiles; i++) {
          const formData = new FormData();
          formData.append('file', imageFiles[i]);
          
          const uploadRes = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            uploadedUrls.push(uploadData.url);
            submitProgress = 10 + Math.round(((i + 1) / totalFiles) * 60);
          }
        }
        isUploading = false;
      }

      submitProgress = 80;

      // 3. Create or update post
      const finalImages = [...uploadedUrls, ...externalUrls];
      const postData = {
        title,
        slug,
        excerpt: autoExcerpt,
        body,
        category,
        image_url: finalImages[0] || null,
        images: finalImages
      };

      const res = await fetch(editingPost ? `/api/blog/${editingPost.slug}` : '/api/blog', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        credentials: 'include'
      });

      if (res.ok) {
        submitProgress = 100;
        message = editingPost ? 'Post updated!' : 'Post created and synced to Telegram!';
        messageType = 'success';
        setTimeout(() => {
          isSubmitting = false;
          closeForm();
          // Use location.reload() to refresh the list
          window.location.reload();
        }, 1000);
      } else {
        const data = await res.json();
        message = data.error || 'Failed to save post';
        messageType = 'error';
        isSubmitting = false;
      }
    } catch (err) {
      console.error('Submit error:', err);
      message = 'An error occurred while saving';
      messageType = 'error';
      isSubmitting = false;
    } finally {
      loading = false;
    }
  }

  async function deletePost(post) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    if (deletingSlug) return;
    deletingSlug = post.slug;
    try {
      const delRes = await fetch(`/api/blog/${post.slug}`, { method: 'DELETE', credentials: 'include' });
      if (!delRes.ok) throw new Error('Failed to delete');
      toastMessage = 'Post deleted successfully.';
      setTimeout(() => { toastMessage = ''; }, 2500);
      window.location.reload();
    } catch (err) {
      alert('Failed to delete post');
    } finally {
      deletingSlug = '';
    }
  }

  async function togglePublish(post) {
    if (togglingSlug) return;
    togglingSlug = post.slug;
    try {
      const pubRes = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !post.is_published }),
        credentials: 'include'
      });
      if (!pubRes.ok) throw new Error('Failed to update');
      toastMessage = post.is_published ? 'Post unpublished.' : 'Post published.';
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      alert('Failed to update post');
    } finally {
      togglingSlug = '';
    }
  }

  function toggleAccordion(slug) {
    expandedSlug = expandedSlug === slug ? '' : slug;
  }
</script>

<svelte:head>
  <title>Blog Management – Admin</title>
</svelte:head>

{#if toastMessage}
  <div class="toast" role="status" aria-live="polite">
    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
    <span>{toastMessage}</span>
  </div>
{/if}

<div class="blog-admin">
  <!-- Header -->
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">Blog Posts</h1>
      <p class="page-subtitle">Create, edit, and manage your articles</p>
    </div>
    <button class="create-btn" on:click={openCreateForm}>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      <span>New Post</span>
    </button>
  </div>

  <!-- Filters -->
  <div class="filters-bar">
    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search posts..."
        class="search-input"
      />
    </div>
    <select bind:value={filterCategory} class="filter-select">
      <option value="all">All Categories</option>
      <option value="Research">Research</option>
      <option value="News">News</option>
      <option value="Clinical Update">Clinical Update</option>
      <option value="Education">Education</option>
      <option value="Events">Events</option>
    </select>
    <span class="post-count">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
  </div>

  <!-- Posts Table -->
  <div class="posts-table-wrapper">
    {#if filteredPosts.length === 0}
      <div class="empty-state">
        <svg viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="#f1f5f9" />
          <path d="M16 18h16M16 24h12M16 30h8" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
        </svg>
        <h3>No posts found</h3>
        <p>{searchQuery || filterCategory !== 'all' ? 'Try adjusting your filters' : 'Create your first blog post to get started'}</p>
        {#if !searchQuery && filterCategory === 'all'}
          <button class="create-btn" on:click={openCreateForm}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>Create Post</span>
          </button>
        {/if}
      </div>
    {:else}
      <!-- Desktop: Table -->
      <div class="posts-table-desktop">
        <table class="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredPosts as post}
              <tr class="post-row">
                <td class="title-cell">
                  <a href="/blog/{post.slug}" target="_blank" class="post-title-link">{post.title}</a>
                  <span class="post-slug">/{post.slug}</span>
                </td>
                <td>
                  <span class="category-badge cat-{post.category.toLowerCase().replace(/\s/g, '-')}">{post.category}</span>
                </td>
                <td>
                  <button
                    class="status-toggle"
                    class:published={post.is_published}
                    class:loading={togglingSlug === post.slug}
                    on:click|stopPropagation={() => togglePublish(post)}
                    disabled={togglingSlug === post.slug}
                    title={post.is_published ? 'Click to unpublish' : 'Click to publish'}
                  >
                    {#if togglingSlug === post.slug}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <span class="status-dot"></span>
                    {/if}
                    {togglingSlug === post.slug ? 'Updating...' : (post.is_published ? 'Published' : 'Draft')}
                  </button>
                </td>
                <td class="date-cell">{formatDate(post.date)}</td>
                <td class="actions-cell">
                  <button class="action-btn edit" on:click={() => openEditForm(post)} title="Edit" aria-label="Edit post">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <a href="/blog/{post.slug}" target="_blank" class="action-btn view" title="View" aria-label="View post">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <button class="action-btn delete" on:click={() => deletePost(post)} title="Delete" aria-label="Delete post" disabled={deletingSlug === post.slug}>
                    {#if deletingSlug === post.slug}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    {/if}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Mobile: Accordion -->
      <div class="posts-accordion-mobile">
        {#each filteredPosts as post}
          <div class="accordion-item">
            <button
              class="accordion-header"
              class:expanded={expandedSlug === post.slug}
              on:click={(e) => {
                if (e.target.closest('.accordion-status')) {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePublish(post);
                } else {
                  toggleAccordion(post.slug);
                }
              }}
              aria-expanded={expandedSlug === post.slug}
            >
              <span class="accordion-title">{post.title}</span>
              <span class="category-badge cat-{post.category.toLowerCase().replace(/\s/g, '-')}">{post.category}</span>
              <span class="accordion-status" class:published={post.is_published}>{togglingSlug === post.slug ? 'Updating...' : (post.is_published ? 'Published' : 'Draft')}</span>
              <svg class="accordion-chevron" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if expandedSlug === post.slug}
              <div class="accordion-body">
                <p class="accordion-date">{formatDate(post.date)}</p>
                <div class="accordion-actions">
                  <button class="accordion-btn edit" on:click={() => openEditForm(post)}>
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    Edit
                  </button>
                  <a href="/blog/{post.slug}" target="_blank" class="accordion-btn view">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                    View
                  </a>
                  <button class="accordion-btn status" on:click|stopPropagation={() => togglePublish(post)} disabled={togglingSlug === post.slug}>
                    {#if togglingSlug === post.slug}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <span class="status-dot"></span>
                    {/if}
                    {post.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button class="accordion-btn delete" on:click={() => deletePost(post)} disabled={deletingSlug === post.slug}>
                    {#if deletingSlug === post.slug}
                      <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                    {:else}
                      <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    {/if}
                    Delete
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
{#if showForm}
  <div class="modal-overlay" on:paste={handlePaste}>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <div class="modal-header">
        <h2 class="modal-title">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
        {#if isSubmitting}
          <div class="header-progress">
            <div class="header-progress-fill" style="width: {submitProgress}%"></div>
          </div>
        {/if}
        <button class="modal-close" on:click={closeForm} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <form on:submit={handleSubmit} class="modal-form">
        {#if message}
          <div class="form-alert {messageType === 'error' ? 'alert-error' : 'alert-success'}">
            {message}
          </div>
        {/if}

        {#if showForm && !editingPost}
          <div class="form-progress">
            <div class="form-progress-header">
              <span class="form-progress-label">Post completion</span>
              <span class="form-progress-pct">{postProgress}%</span>
            </div>
            <div class="form-progress-bar">
              <div class="form-progress-fill" style="width: {postProgress}%; background: {progressColor};"></div>
            </div>
          </div>
        {/if}

        <div class="form-field">
          <label for="title">Title *</label>
          <input id="title" type="text" bind:value={title} required placeholder="Post title (slug auto: spaces → hyphens)" />
          {#if title}
            <span class="form-slug-hint">URL: /blog/{slug}</span>
          {/if}
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="category">Category</label>
            <select id="category" bind:value={category}>
              <option value="Research">Research</option>
              <option value="News">News</option>
              <option value="Clinical Update">Clinical Update</option>
              <option value="Education">Education</option>
              <option value="Events">Events</option>
            </select>
          </div>
        </div>

        <div class="form-field full-width media-section">
          <span class="section-label">Media Gallery (Max 4)</span>
          <div class="media-management-grid">
            <div class="file-dropzone" class:disabled={imagePreviews.length >= 4}>
              <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="dropzone-content">
                <span class="dropzone-text">Upload/Paste</span>
              </div>
              <input 
                id="imageUpload" 
                type="file" 
                accept="image/*" 
                multiple
                disabled={imagePreviews.length >= 4}
                on:change={handleFileChange} 
              />
            </div>

            <div class="url-input-box">
              <input 
                type="url" 
                bind:value={currentExternalUrl} 
                placeholder="Paste external image URL..." 
                on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalUrl())}
              />
              <button type="button" class="btn-add-url" on:click={addExternalUrl} disabled={!currentExternalUrl || imagePreviews.length >= 4}>
                Add
              </button>
            </div>
          </div>

            {#if isUploading}
              <div class="pro-upload-status">
                <div class="shimmer-bar"></div>
                <span>Uploading to Secure Storage... {submitProgress}%</span>
              </div>
            {/if}
            
            {#if imagePreviews.length > 0}
              <div class="pro-image-grid">
                {#each imagePreviews as preview, i}
                  <div class="pro-image-card">
                    <img src={preview} alt="Preview" />
                    <div class="card-overlay">
                      <button type="button" class="btn-remove-pro" on:click={() => removeImage(i, externalUrls.includes(preview))} title="Remove" aria-label="Remove image">
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                {/each}
          </div>
        {/if}
      </div>

        <div class="form-field">
          <label for="body">Content</label>
          <textarea id="body" bind:value={body} rows="10" placeholder="Full article content (markdown supported)"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" on:click={closeForm}>Cancel</button>
          <button type="submit" class="btn-primary" disabled={loading}>
            {#if loading}
              <svg class="btn-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
              <span>Saving...</span>
            {:else}
              {editingPost ? 'Update Post' : 'Create Post'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Toast notification */
  .toast {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: #166534;
    color: white;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    animation: toastIn 0.3s ease;
  }

  .toast svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .blog-admin {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ===== Header ===== */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
    color: #64748b;
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.25rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .create-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px -4px rgba(59,130,246,0.4);
  }

  .create-btn svg {
    width: 18px;
    height: 18px;
  }

  /* ===== Filters ===== */
  .filters-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    background: white;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
  }

  .search-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  .filter-select {
    padding: 0.6rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    background: white;
    color: #1e293b;
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }

  .filter-select:focus {
    border-color: #3b82f6;
  }

  .post-count {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-left: auto;
  }

  /* ===== Table ===== */
  .posts-table-wrapper {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .posts-accordion-mobile {
    display: none;
  }

  .posts-table {
    width: 100%;
    border-collapse: collapse;
  }

  .posts-table th {
    text-align: left;
    padding: 0.85rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .posts-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  .post-row:last-child td {
    border-bottom: none;
  }

  .post-row:hover {
    background: #fafbfd;
  }

  .title-cell {
    max-width: 350px;
  }

  .post-title-link {
    display: block;
    font-weight: 600;
    color: #1e293b;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s;
  }

  .post-title-link:hover {
    color: #3b82f6;
  }

  .post-slug {
    display: block;
    font-size: 0.75rem;
    color: #94a3b8;
    font-family: monospace;
  }

  .category-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .cat-research { background: #eff6ff; color: #2563eb; }
  .cat-news { background: #f0fdf4; color: #16a34a; }
  .cat-clinical-update { background: #faf5ff; color: #9333ea; }
  .cat-education { background: #fffbeb; color: #d97706; }
  .cat-events { background: #fef2f2; color: #dc2626; }

  .status-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 0.75rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .status-toggle.published {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .date-cell {
    color: #64748b;
    white-space: nowrap;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    color: #64748b;
  }

  .action-btn:hover {
    background: #f8fafc;
  }

  .action-btn.edit:hover { border-color: #bfdbfe; color: #2563eb; background: #eff6ff; }
  .action-btn.view:hover { border-color: #d1d5db; color: #374151; }
  .action-btn.delete:hover { border-color: #fecaca; color: #dc2626; background: #fef2f2; }

  .action-btn svg {
    width: 16px;
    height: 16px;
  }

  /* ===== Empty State ===== */
  .empty-state {
    padding: 3rem;
    text-align: center;
  }

  .empty-state svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .empty-state p {
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 1.5rem;
  }

  /* ===== Modal ===== */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: white;
    border-radius: 24px;
    width: 95%;
    max-width: 1000px;
    max-height: 92vh;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #ef4444;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .modal-close:hover {
    background: #dc2626;
    transform: rotate(90deg);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }

  .modal-close svg {
    width: 16px;
    height: 16px;
  }

  .modal-form {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-field.field-small {
    flex: 0 0 180px;
  }

  .form-field label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #475569;
  }

  .form-slug-hint {
    display: block;
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.35rem;
    font-family: monospace;
  }

  .form-field input,
  .form-field select,
  .form-field textarea {
    padding: 0.75rem 1rem;
    border: 3px solid #cbd5e1;
    border-radius: 12px;
    font-size: 0.9rem;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    background: #ffffff;
    font-family: inherit;
    resize: vertical;
  }

  .form-field input:focus,
  .form-field select:focus,
  .form-field textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    background: white;
  }

  .form-progress {
    margin-bottom: 1rem;
  }

  .form-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .form-progress-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-progress-pct {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1e293b;
  }

  .form-progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .form-progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background 0.3s ease;
  }

  .modal {
    background: #ffffff;
    width: 95%;
    max-width: 900px;
    max-height: 90vh;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: modalPop 0.2s ease-out;
  }

  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.98) translateY(5px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-form {
    padding: 2rem;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .media-management-grid {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .file-dropzone {
    flex: 0 0 160px;
    border: 2px dashed #cbd5e1;
    background: #ffffff;
    border-radius: 12px;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
    position: relative;
    cursor: pointer;
  }

  .url-input-box {
    flex: 1;
    display: flex;
    gap: 0.5rem;
    background: #ffffff;
    border: 3px solid #cbd5e1;
    border-radius: 12px;
    padding: 0.4rem 0.6rem;
    align-items: center;
  }

  @media (max-width: 640px) {
    .modal {
      width: 100%;
      height: 100vh;
      max-height: -webkit-fill-available;
      border-radius: 0;
    }
    .modal-form {
      padding: 1rem;
      padding-bottom: 2rem;
    }
    .media-management-grid {
      flex-direction: column;
      gap: 0.75rem;
    }
    .file-dropzone {
      flex: none;
      width: 100%;
      padding: 1rem;
    }
  }

  .file-dropzone:hover:not(.disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .file-dropzone input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .file-dropzone.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    border-style: solid;
  }

  .url-input-box {
    display: flex;
    gap: 0.5rem;
    background: #ffffff;
    border: 3px solid #cbd5e1;
    border-radius: 16px;
    padding: 0.5rem 0.75rem;
    align-items: center;
    transition: all 0.2s;
  }

  .url-input-box:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
  }

  .url-input-box input {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    flex: 1;
  }

  .btn-add-url {
    background: #1e293b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .pro-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
    padding: 0.25rem;
  }

  .pro-image-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 1;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
  }

  .pro-image-card:hover {
    transform: translateY(-4px);
  }

  .pro-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .pro-image-card:hover .card-overlay {
    opacity: 1;
  }

  .btn-remove-pro {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-remove-pro svg {
    width: 16px;
    height: 16px;
  }

  .pro-upload-status {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #1e40af;
    font-weight: 500;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
  }

  .shimmer-bar {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    position: relative;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
  }

  .modal-close {
    background: #f1f5f9;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: #fee2e2;
    color: #ef4444;
    transform: rotate(90deg);
  }

  .modal-close svg { width: 20px; height: 20px; }

  .header-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #f1f5f9;
  }

  .header-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    transition: width 0.3s ease;
  }

  .form-alert {
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .alert-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .btn-secondary {
    padding: 0.6rem 1.25rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .btn-secondary:hover {
    background: #f8fafc;
  }

  .btn-primary {
    padding: 0.6rem 1.5rem;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 4px 12px -2px rgba(59,130,246,0.4);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-spinner {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    animation: spin 0.8s linear infinite;
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-toggle.loading {
    opacity: 0.8;
  }

  .status-toggle .btn-spinner {
    width: 14px;
    height: 14px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ===== Accordion (mobile) ===== */
  .accordion-item {
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-item:last-child {
    border-bottom: none;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1rem;
    background: white;
    border: none;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    flex-wrap: wrap;
    min-height: 56px;
  }

  .accordion-header:hover {
    background: #f8fafc;
  }

  .accordion-header.expanded {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-title {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }

  .accordion-status {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #fef2f2;
    color: #991b1b;
    cursor: pointer;
  }

  .accordion-status.published {
    background: #f0fdf4;
    color: #166534;
  }

  .accordion-chevron {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.2s;
    color: #64748b;
  }

  .accordion-header.expanded .accordion-chevron {
    transform: rotate(180deg);
  }

  .accordion-body {
    padding: 1rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-date {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.75rem;
  }

  .accordion-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .accordion-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: all 0.15s;
  }

  .accordion-btn svg {
    width: 16px;
    height: 16px;
  }

  .accordion-btn.edit:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
  .accordion-btn.view:hover { background: #f8fafc; color: #1e293b; }
  .accordion-btn.status:hover { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
  .accordion-btn.delete:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .accordion-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .accordion-btn .btn-spinner {
    width: 14px;
    height: 14px;
  }

  /* ===== Responsive - Mobile ===== */
  @media (max-width: 768px) {
    .blog-admin {
      padding: 0;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .page-title {
      font-size: 1.25rem;
    }

    .create-btn {
      width: 100%;
      justify-content: center;
      min-height: 44px;
    }

    .filters-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-wrapper {
      max-width: none;
    }

    .posts-table-desktop {
      display: none;
    }

    .posts-accordion-mobile {
      display: block;
    }

    .posts-table-wrapper {
      overflow: visible;
    }

    .action-btn {
      min-width: 40px;
      min-height: 40px;
    }

    .toast {
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      transform: none;
      max-width: none;
    }

    .modal-overlay {
      padding: 0.5rem;
      align-items: flex-start;
      padding-top: 2rem;
    }

    .modal {
      max-height: calc(100vh - 2rem);
      border-radius: 16px;
    }

    .modal-header {
      padding: 1rem 1.25rem;
    }

    .modal-form {
      padding: 1rem 1.25rem;
    }

    .form-row {
      flex-direction: column;
    }

    .form-field.field-small {
      flex: 1;
    }

    .form-field input,
    .form-field textarea {
      font-size: 16px;
      min-height: 44px;
    }

    .form-field textarea {
      min-height: 100px;
    }

    .modal-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .modal-actions button {
      width: 100%;
      min-height: 44px;
    }
  }
</style>
