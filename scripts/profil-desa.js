const PROFIL_URL = '/assets/data/profil-desa.json';
const MONOGRAFI_URL = '/assets/data/monografi.json';

async function fetchProfilData() {
  try {
    const res = await fetch(PROFIL_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch profil data');
    return await res.json();
  } catch (err) {
    console.error('profil-desa:', err);
    return null;
  }
}

async function fetchMonografiData() {
  try {
    const res = await fetch(MONOGRAFI_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch monografi data');
    return await res.json();
  } catch (err) {
    console.error('profil-desa monografi:', err);
    return null;
  }
}

// Fetch organization image data from the profil_desa CMS file
async function fetchOrgData() {
  try {
    const res = await fetch(PROFIL_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch org data');
    return await res.json();
  } catch (err) {
    console.error('struktur-organisasi:', err);
    return null;
  }
}

function renderVisi(visi) {
  const el = document.getElementById('visi-content');
  if (!el) return;
  el.textContent = visi || '';
}

function renderMisi(misiList) {
  const el = document.getElementById('misi-list');
  if (!el) return;
  el.innerHTML = '';
  if (!Array.isArray(misiList) || misiList.length === 0) {
    el.innerHTML = '<li>Belum ada data misi.</li>';
    return;
  }
  misiList.forEach(item => {
    const li = document.createElement('li');
    li.textContent = typeof item === 'string' ? item : (item.item || '');
    el.appendChild(li);
  });
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

export async function initProfil() {
  const data = await fetchProfilData();
  if (!data) return;
  renderVisi(data.visi);
  renderMisi(data.misi);
  
  // Also load population data from monografi
  const monografiData = await fetchMonografiData();
  if (monografiData) {
    updateJumlahPenduduk(monografiData);
  }
}

export async function renderOrgImage() {
  const imgEl = document.getElementById('org-image');
  if (!imgEl) return;
  const data = await fetchOrgData();
  if (!data) return;

  // Prefer a top-level image field (configured in admin/config.yml)
  let src = '';
  if (data.image) src = data.image;
  else if (Array.isArray(data.members) && data.members.length > 0 && data.members[0].gambar) src = data.members[0].gambar;

  if (src) imgEl.src = src;
  else imgEl.alt = 'Belum ada data struktur organisasi.';
}

document.addEventListener('DOMContentLoaded', () => {
  initProfil();
  renderOrgImage();
});

export default { initProfil, renderOrgImage };
