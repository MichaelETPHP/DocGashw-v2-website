<script>
  export let data;
  $: posts = data?.posts ?? [];

  // Form state
  let showForm = false;
  let editingPost = null;
  let title = '';
  let slug = '';
  let excerpt = '';
  let body = '';
  let category = 'Research';
  let imageUrl = '';
  let message = '';
  let messageType = 'success';
  let loading = false;

  // Filter
  let searchQuery = '';
  let filterCategory = 'all';

  $: filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function updateSlug() {
    if (title && !slug) slug = slugify(title);
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function openCreateForm() {
    editingPost = null;
    title = '';
    slug = '';
    excerpt = '';
    body = '';
    category = 'Research';
    imageUrl = '';
    message = '';
    showForm = true;
  }

  function openEditForm(post) {
    editingPost = post;
    title = post.title;
    slug = post.slug;
    excerpt = post.excerpt;
    body = post.body || '';
    category = post.category;
    imageUrl = post.image_url || '';
    message = '';
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingPost = null;
    message = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    message = '';
    loading = true;

    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        excerpt,
        body,
        category,
        image_url: imageUrl || null
      };

      let res;
      if (editingPost) {
        res = await fetch(`/api/blog/${editingPost.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (!res.ok) {
        message = result.error || 'Operation failed';
        messageType = 'error';
        loading = false;
        return;
      }

      message = editingPost ? 'Post updated successfully.' : 'Post created successfully.';
      messageType = 'success';

      if (!editingPost) {
        title = '';
        slug = '';
        excerpt = '';
        body = '';
        imageUrl = '';
      }

      loading = false;
      // Refresh by reloading
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      message = 'Network error. Please try again.';
      messageType = 'error';
      loading = false;
    }
  }

  async function deletePost(post) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/blog/${post.slug}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  }

  async function togglePublish(post) {
    try {
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !post.is_published })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to update post');
    }
  }
</script>

<svelte:head>
  <title>Blog Management – Admin</title>
</svelte:head>

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
                  on:click={() => togglePublish(post)}
                  title={post.is_published ? 'Click to unpublish' : 'Click to publish'}
                >
                  <span class="status-dot"></span>
                  {post.is_published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td class="date-cell">{formatDate(post.date)}</td>
              <td class="actions-cell">
                <button class="action-btn edit" on:click={() => openEditForm(post)} title="Edit">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <a href="/blog/{post.slug}" target="_blank" class="action-btn view" title="View">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </a>
                <button class="action-btn delete" on:click={() => deletePost(post)} title="Delete">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
{#if showForm}
  <div class="modal-overlay" on:click={closeForm}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2 class="modal-title">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
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

        <div class="form-row">
          <div class="form-field">
            <label for="title">Title *</label>
            <input id="title" type="text" bind:value={title} on:blur={updateSlug} required placeholder="Post title" />
          </div>
          <div class="form-field field-small">
            <label for="slug">Slug</label>
            <input id="slug" type="text" bind:value={slug} placeholder="url-slug" />
          </div>
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
          <div class="form-field">
            <label for="imageUrl">Image URL</label>
            <input id="imageUrl" type="url" bind:value={imageUrl} placeholder="https://..." />
          </div>
        </div>

        <div class="form-field">
          <label for="excerpt">Excerpt *</label>
          <textarea id="excerpt" bind:value={excerpt} required rows="3" placeholder="Short summary for listing"></textarea>
        </div>

        <div class="form-field">
          <label for="body">Content</label>
          <textarea id="body" bind:value={body} rows="10" placeholder="Full article content (markdown supported)"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" on:click={closeForm}>Cancel</button>
          <button type="submit" class="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
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
    border-radius: 20px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
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
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: #f1f5f9;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .modal-close:hover {
    background: #e2e8f0;
    color: #1e293b;
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

  .form-field input,
  .form-field select,
  .form-field textarea {
    padding: 0.65rem 0.85rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    background: #f8fafc;
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

  .form-alert {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
  }

  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

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

  /* ===== Responsive ===== */
  @media (max-width: 768px) {
    .posts-table-wrapper {
      overflow-x: auto;
    }

    .posts-table {
      min-width: 600px;
    }

    .form-row {
      flex-direction: column;
    }

    .form-field.field-small {
      flex: 1;
    }
  }
</style>
