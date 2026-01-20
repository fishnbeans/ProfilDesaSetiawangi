// Module: render-berita.js
// Fetches berita.json and renders news items as cards

const BERITA_URL = '/assets/data/berita.json';

async function fetchBeritaData() {
  try {
    const res = await fetch(BERITA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch berita data');
    return await res.json();
  } catch (err) {
    console.error('render-berita:', err);
    return null;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

async function renderBeritaList() {
  const beritaContainer = document.getElementById('berita-container');
  if (!beritaContainer) return;

  const data = await fetchBeritaData();
  if (!data || !data.items) {
    beritaContainer.innerHTML = '<p class="text-center text-muted">Data berita tidak tersedia</p>';
    return;
  }

  beritaContainer.innerHTML = '';

  data.items.forEach(item => {
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

    // Content preview
    const content = document.createElement('p');
    content.className = 'card-text text-muted flex-grow-1';
    content.textContent = item.isi.length > 100 ? item.isi.substring(0, 100) + '...' : item.isi;
    cardBody.appendChild(content);

    // Read More Button
    const readMoreBtn = document.createElement('a');
    readMoreBtn.href = `berita-content.html?id=${data.items.indexOf(item)}`;
    readMoreBtn.className = 'btn btn-outline-success btn-sm mt-3';
    readMoreBtn.textContent = 'Baca Selengkapnya';
    cardBody.appendChild(readMoreBtn);

    card.appendChild(cardBody);
    col.appendChild(card);
    beritaContainer.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', renderBeritaList);
