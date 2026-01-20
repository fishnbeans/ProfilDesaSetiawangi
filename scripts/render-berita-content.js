// Module: render-berita-content.js
// Fetches berita.json and renders the full article content based on URL parameter

const BERITA_URL = '/assets/data/berita.json';

async function fetchBeritaData() {
  try {
    const res = await fetch(BERITA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch berita data');
    return await res.json();
  } catch (err) {
    console.error('render-berita-content:', err);
    return null;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTimeMinutes} menit baca`;
}

function getArticleIndexFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id')) || 0;
}

async function renderArticleContent() {
  const data = await fetchBeritaData();
  if (!data || !data.items) {
    document.getElementById('article-content').innerHTML = 
      '<p class="text-center text-muted">Artikel tidak ditemukan</p>';
    return;
  }

  const articleIndex = getArticleIndexFromUrl();
  const article = data.items[articleIndex];

  if (!article) {
    document.getElementById('article-content').innerHTML = 
      '<p class="text-center text-muted">Artikel tidak ditemukan</p>';
    return;
  }

  // Set hero image
  document.getElementById('article-hero-image').src = article.gambar;
  document.getElementById('article-hero-image').alt = article.judul;

  // Set title
  document.getElementById('article-title').textContent = article.judul;
  document.getElementById('breadcrumb-title').textContent = article.judul;

  // Set date
  document.getElementById('article-date').textContent = formatDate(article.tanggal);

  // Set reading time
  document.getElementById('reading-time').textContent = calculateReadingTime(article.isi);

  // Set content
  document.getElementById('article-content').innerHTML = `
    <p>${article.isi}</p>
  `;

  // Render related articles
  renderRelatedArticles(data.items, articleIndex);
}

function renderRelatedArticles(allArticles, currentIndex) {
  const container = document.getElementById('related-articles-container');
  container.innerHTML = '';

  // Get up to 3 related articles (excluding current one)
  const relatedArticles = allArticles
    .map((article, index) => ({ article, index }))
    .filter(item => item.index !== currentIndex)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    container.innerHTML = '<p class="small text-muted">Tidak ada berita terkait</p>';
    return;
  }

  relatedArticles.forEach(({ article, index }) => {
    const relatedDiv = document.createElement('div');
    relatedDiv.className = 'related-article';
    relatedDiv.innerHTML = `
      <h6>${article.judul}</h6>
      <small>${formatDate(article.tanggal)}</small>
    `;
    relatedDiv.addEventListener('click', () => {
      window.location.href = `berita-content.html?id=${index}`;
    });
    container.appendChild(relatedDiv);
  });
}

document.addEventListener('DOMContentLoaded', renderArticleContent);
