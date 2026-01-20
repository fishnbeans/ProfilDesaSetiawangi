// Module: render-monografi-penduduk.js
// Fetches monografi.json and renders demographic cards
const MONOGRAFI_URL = '/assets/data/monografi.json';

async function fetchMonografiData() {
  try {
    const res = await fetch(MONOGRAFI_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch monografi data');
    return await res.json();
  } catch (err) {
    console.error('render-monografi-penduduk:', err);
    return null;
  }
}

function createMonografiCard(item) {
  const col = document.createElement('div');
  col.className = 'col-md-4';

  const card = document.createElement('div');
  card.className = 'card text-center h-100';

  const body = document.createElement('div');
  body.className = 'card-body d-flex flex-column justify-content-center align-items-center shadow-sm';

  const icon = document.createElement('i');
  icon.className = `bi ${item.icon} display-4 text-${item.color}`;

  const title = document.createElement('h5');
  title.className = 'card-title mt-3';
  title.textContent = item.label || '';

  const value = document.createElement('p');
  value.className = 'fs-3 fw-bold';
  value.textContent = item.value || '—';

  body.appendChild(icon);
  body.appendChild(title);
  body.appendChild(value);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

async function renderMonografi() {
  const container = document.getElementById('monografi-cards-container');
  if (!container) return;

  const data = await fetchMonografiData();
  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>Belum ada data monografi.</p></div>';
    return;
  }

  container.innerHTML = '';
  data.items.forEach(item => {
    container.appendChild(createMonografiCard(item));
  });

  // Update jumlah penduduk in info-card
  updateJumlahPenduduk(data);
}

function updateJumlahPenduduk(data) {
  const displayElement = document.getElementById('jumlah-penduduk-display');
  if (!displayElement || !Array.isArray(data.items) || data.items.length === 0) return;

  // Find the first item with label "Penduduk" which contains the population count
  const pendudukItem = data.items.find(item => item.label === 'Penduduk');
  if (pendudukItem && pendudukItem.value) {
    displayElement.textContent = pendudukItem.value + ' Jiwa';
  }
}

document.addEventListener('DOMContentLoaded', renderMonografi);

