// Module: render-pembinaan-masyarakat.js
// Fetches pembinaan-kemasyarakatan.json and renders hierarchical table

const PEMBINAAN_URL = '/assets/data/pembinaan-kemasyarakatan.json';

async function fetchPembinaanData() {
  try {
    const res = await fetch(PEMBINAAN_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch pembinaan kemasyarakatan data');
    return await res.json();
  } catch (err) {
    console.error('render-pembinaan-masyarakat:', err);
    return null;
  }
}

async function renderPembinaanTable() {
  const container = document.getElementById('pembinaan-table-container');
  if (!container) return;

  const data = await fetchPembinaanData();
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    container.innerHTML = '<p class="text-muted">Data pembinaan kemasyarakatan tidak tersedia</p>';
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

  const headers = ['No', 'Uraian Sumber Daya Pembangunan', 'Jumlah'];
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
    // Main row
    const mainRow = document.createElement('tr');
    mainRow.style.backgroundColor = '#f8f9fa';

    const noCell = document.createElement('td');
    noCell.className = 'text-center fw-bold';
    noCell.textContent = item.no;
    mainRow.appendChild(noCell);

    const uraianCell = document.createElement('td');
    uraianCell.className = 'fw-bold';
    uraianCell.textContent = item.uraian || '-';
    mainRow.appendChild(uraianCell);

    const jumlahCell = document.createElement('td');
    jumlahCell.className = 'text-center';
    jumlahCell.textContent = item.jumlah || '';
    mainRow.appendChild(jumlahCell);

    tbody.appendChild(mainRow);

    // Sub-items rows
    if (Array.isArray(item.subitems)) {
      item.subitems.forEach(subitem => {
        const subRow = document.createElement('tr');

        const subNoCell = document.createElement('td');
        subNoCell.className = 'text-center ps-4';
        subNoCell.innerHTML = `<small>${subitem.subNo}</small>`;
        subRow.appendChild(subNoCell);

        const subUraianCell = document.createElement('td');
        subUraianCell.className = 'ps-4';
        subUraianCell.innerHTML = `<small>${subitem.uraian || '-'}</small>`;
        subRow.appendChild(subUraianCell);

        const subJumlahCell = document.createElement('td');
        subJumlahCell.className = 'text-center';
        subJumlahCell.innerHTML = `<small>${subitem.jumlah || '-'}</small>`;
        subRow.appendChild(subJumlahCell);

        tbody.appendChild(subRow);

        // Sub-sub-items rows (tertiary level)
        if (Array.isArray(subitem.subSubitems)) {
          subitem.subSubitems.forEach(subSubitem => {
            const subSubRow = document.createElement('tr');

            const subSubNoCell = document.createElement('td');
            subSubNoCell.className = 'text-center ps-5';
            subSubNoCell.innerHTML = '-';
            subSubRow.appendChild(subSubNoCell);

            const subSubUraianCell = document.createElement('td');
            subSubUraianCell.className = 'ps-5';
            subSubUraianCell.innerHTML = `<small>${subSubitem.uraian || '-'}</small>`;
            subSubRow.appendChild(subSubUraianCell);

            const subSubJumlahCell = document.createElement('td');
            subSubJumlahCell.className = 'text-center';
            subSubJumlahCell.innerHTML = `<small>${subSubitem.jumlah || '-'}</small>`;
            subSubRow.appendChild(subSubJumlahCell);

            tbody.appendChild(subSubRow);
          });
        }
      });
    }
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Render when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPembinaanTable);
} else {
  renderPembinaanTable();
}
