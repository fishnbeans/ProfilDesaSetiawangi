// Module: render-berita-featured.js
// Fetches berita.json and renders 3 random news items as cards

const BERITA_URL = '/assets/data/berita.json';

async function fetchBeritaData() {
  try {
    const res = await fetch(BERITA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch berita data');
    return await res.json();
  } catch (err) {
    console.error('render-berita-featured:', err);
    return null;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

async function renderFeaturedBerita() {
  const container = document.getElementById('featured-berita-container');
  if (!container) return;

  const data = await fetchBeritaData();
  if (!data || !data.items) {
    container.innerHTML = '<p class="text-center text-muted">Data berita tidak tersedia</p>';
    return;
  }

  const randomArticles = getRandomItems(data.items, 3);
  container.innerHTML = '';

  randomArticles.forEach((item, idx) => {
    const articleIndex = data.items.indexOf(item);
    
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0 overflow-hidden';

    // Image
    const imgElement = document.createElement('img');
    imgElement.className = 'card-img-top';
    imgElement.src = item.gambar;
    imgElement.alt = item.judul;
    imgElement.style.height = '200px';
    imgElement.style.objectFit = 'cover';
    card.appendChild(imgElement);

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    // Title
    const title = document.createElement('h5');
    title.className = 'card-title fw-bold text-success';
    title.textContent = item.judul;
    cardBody.appendChild(title);

    // Date
    const metaInfo = document.createElement('div');
    metaInfo.className = 'mb-2 small text-muted';
    metaInfo.innerHTML = `<i class="bi bi-calendar-event"></i> ${formatDate(item.tanggal)}`;
    cardBody.appendChild(metaInfo);

    // Content preview - strip markdown formatting for preview
    const plainText = item.isi
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '')   // Remove italic markers
      .replace(/__/g, '')   // Remove underline markers
      .replace(/~~[^~]*~~/g, ''); // Remove strikethrough
    
    const content = document.createElement('p');
    content.className = 'card-text text-muted flex-grow-1';
    content.textContent = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    cardBody.appendChild(content);

    // Read More Button
    const readMoreBtn = document.createElement('a');
    readMoreBtn.href = `berita-content.html?id=${articleIndex}`;
    readMoreBtn.className = 'btn btn-outline-success btn-sm mt-3';
    readMoreBtn.textContent = 'Baca Selengkapnya';
    cardBody.appendChild(readMoreBtn);

    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', renderFeaturedBerita);
