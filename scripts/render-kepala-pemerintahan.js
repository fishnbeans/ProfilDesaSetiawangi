const KEPALA_PEMERINTAHAN_URL = '/assets/data/kepala-pemerintahan.json';

async function fetchKepalaData() {
  try {
    const res = await fetch(KEPALA_PEMERINTAHAN_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch kepala pemerintahan data');
    return await res.json();
  } catch (err) {
    console.error('Fetch kepala pemerintahan:', err);
    return null;
  }
}

async function renderKepalaTable() {
  const tableBody = document.getElementById('kepala-pemerintahan-table-body');
  if (!tableBody) return;

  const data = await fetchKepalaData();
  if (!data || !Array.isArray(data.items)) {
    tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada data kepala pemerintahan</td></tr>';
    return;
  }

  tableBody.innerHTML = data.items.map((item, index) => `
    <tr>
      <td>${item.tahun || '-'}</td>
      <td>${item.nama || '-'}</td>
      <td>${item.keterangan || '-'}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderKepalaTable();
});

export { renderKepalaTable };
