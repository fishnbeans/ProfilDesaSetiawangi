// Module: struktur-organisasi.js
// Fetches struktur-organisasi.json and renders carousel items (4 per slide)
const DATA_URL = '/assets/data/struktur-organisasi.json';

function createMemberCard(member) {
  const col = document.createElement('div');
  col.className = 'col-6 col-md-4 col-lg-3';

  const card = document.createElement('div');
  card.className = 'card text-center team-card';

  const img = document.createElement('img');
  img.className = 'card-img-top';
  img.alt = member.nama || 'Profil';
  img.src = member.gambar || 'https://via.placeholder.com/300x400?text=No+Image';

  const body = document.createElement('div');
  body.className = 'card-body bg-success';

  const name = document.createElement('h6');
  name.className = 'card-title text-white';
  name.textContent = member.nama || '';

  const pos = document.createElement('div');
  pos.className = 'card-subtitle text-white';
  pos.textContent = member.jabatan || '';

  body.appendChild(name);
  body.appendChild(pos);
  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

async function renderOrgCarousel() {
  const container = document.getElementById('org-carousel-inner');
  if (!container) return;
  try {
    const res = await fetch(DATA_URL, {cache: 'no-store'});
    if (!res.ok) throw new Error('Failed to load data');
    const data = await res.json();
    const members = Array.isArray(data.members) ? data.members : [];

    if (members.length === 0) {
      container.innerHTML = '<div class="carousel-item active"><div class="p-4 text-center">Belum ada data struktur organisasi.</div></div>';
      return;
    }

    const groups = chunkArray(members, 4);
    groups.forEach((group, idx) => {
      const item = document.createElement('div');
      item.className = 'carousel-item' + (idx === 0 ? ' active' : '');

      const row = document.createElement('div');
      row.className = 'row gx-3';

      group.forEach(member => {
        row.appendChild(createMemberCard(member));
      });

      item.appendChild(row);
      container.appendChild(item);
    });
  } catch (err) {
    container.innerHTML = '<div class="carousel-item active"><div class="p-4 text-center text-danger">Gagal memuat data struktur organisasi.</div></div>';
    console.error('struktur-organisasi:', err);
  }
}

document.addEventListener('DOMContentLoaded', renderOrgCarousel);

export default { renderOrgCarousel };
