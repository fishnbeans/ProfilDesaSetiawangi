// Module: render-potensi-penyelenggaraan-pemerintahan.js
// Fetches potensi-penyelenggaraan-pemerintahan.json and renders table

const POTENSI_URL = '/assets/data/potensi-penyelenggaraan-pemerintahan.json';

async function fetchPotensiData() {
  try {
    const res = await fetch(POTENSI_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch potensi data');
    return await res.json();
  } catch (err) {
    console.error('render-potensi-penyelenggaraan-pemerintahan:', err);
    return null;
  }
}

async function renderPotensiTable() {
  const container = document.getElementById('potensi-table-container');
  if (!container) return;

  const data = await fetchPotensiData();
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    container.innerHTML = '<p class="text-muted">Data potensi tidak tersedia</p>';
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Create table
  const table = document.createElement('table');
  table.className = 'table table-bordered table-hover';

  // Create table header
  const thead = document.createElement('thead');
  thead.style.backgroundColor = '#198754';
  const headerRow = document.createElement('tr');

  const headers = ['No', 'Uraian', 'Jumlah Personil'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.className = 'text-center fw-bold text-white';
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  data.data.forEach(item => {
    const row = document.createElement('tr');

    const noCell = document.createElement('td');
    noCell.className = 'text-center';
    noCell.textContent = item.no;
    row.appendChild(noCell);

    const uraianCell = document.createElement('td');
    uraianCell.textContent = item.uraian || '-';
    row.appendChild(uraianCell);

    const personilCell = document.createElement('td');
    personilCell.className = 'text-center';
    personilCell.textContent = item.jumlahPersonil || 0;
    row.appendChild(personilCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Render when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPotensiTable);
} else {
  renderPotensiTable();
}
