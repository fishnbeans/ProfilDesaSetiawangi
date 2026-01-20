// Module: render-produk.js
// Fetches produk.json and renders product cards

const PRODUK_URL = '/assets/data/produk.json';
const PRODUCTS_PER_PAGE = 12;

let allProducts = [];
let currentPage = 1;

async function fetchProdukData() {
  try {
    const res = await fetch(PRODUK_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch produk data');
    return await res.json();
  } catch (err) {
    console.error('render-produk:', err);
    return null;
  }
}

function renderProductCards(products) {
  const container = document.getElementById('produk-cards-container');
  if (!container) return;

  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Produk tidak tersedia</p>';
    return;
  }

  const row = document.createElement('div');
  row.className = 'row g-4';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm';

    // Product image
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'card-img-top-wrapper';
    imgWrapper.style.cssText = 'height: 250px; overflow: hidden; background-color: #f0f0f0;';

    const img = document.createElement('img');
    img.src = product.gambar || '/assets/uploads/placeholder.jpg';
    img.alt = product.nama;
    img.className = 'card-img-top';
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    imgWrapper.appendChild(img);

    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold text-success';
    title.textContent = product.nama;
    cardBody.appendChild(title);

    const deskripsi = document.createElement('p');
    deskripsi.className = 'card-text';
    deskripsi.textContent = product.deskripsi;
    deskripsi.style.cssText = 'font-size: 0.95rem; color: #555;';
    cardBody.appendChild(deskripsi);

    card.appendChild(imgWrapper);
    card.appendChild(cardBody);

    col.appendChild(card);
    row.appendChild(col);
  });

  container.appendChild(row);
}

function updatePagination() {
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginationContainer = document.getElementById('produk-pagination');

  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page navigation');

  const ul = document.createElement('ul');
  ul.className = 'pagination justify-content-center';

  // Previous button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  const prevLink = document.createElement('a');
  prevLink.className = 'page-link';
  prevLink.href = '#';
  prevLink.textContent = 'Sebelumnya';
  prevLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayPage();
    }
  };
  prevLi.appendChild(prevLink);
  ul.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = '#';
    link.textContent = i;
    link.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      displayPage();
    };
    li.appendChild(link);
    ul.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  const nextLink = document.createElement('a');
  nextLink.className = 'page-link';
  nextLink.href = '#';
  nextLink.textContent = 'Berikutnya';
  nextLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayPage();
    }
  };
  nextLi.appendChild(nextLink);
  ul.appendChild(nextLi);

  nav.appendChild(ul);
  paginationContainer.appendChild(nav);
}

function displayPage() {
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageProducts = allProducts.slice(start, end);

  renderProductCards(pageProducts);
  updatePagination();

  // Scroll to top of products
  document.getElementById('produk-cards-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


async function initProdukPage() {
  const container = document.getElementById('produk-cards-container');
  if (!container) return; // Only run on UMKM page
  
  const data = await fetchProdukData();
  if (!data || !Array.isArray(data.produk)) {
    container.innerHTML = '<p class="text-muted">Data produk tidak tersedia</p>';
    return;
  }

  allProducts = data.produk;
  displayPage();
}

function getRandomProducts(products, count = 4) {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, products.length));
}

function createProductCardForIndex(product) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';

  // Product image
  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'card-img-top-wrapper';
  imgWrapper.style.cssText = 'height: 250px; overflow: hidden; background-color: #f0f0f0;';

  const img = document.createElement('img');
  img.src = product.gambar || '/assets/uploads/placeholder.jpg';
  img.alt = product.nama;
  img.className = 'card-img-top';
  img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
  imgWrapper.appendChild(img);

  // Card body
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex flex-column';

  const title = document.createElement('h5');
  title.className = 'card-title fw-bold text-success';
  title.textContent = product.nama;
  cardBody.appendChild(title);

  const deskripsi = document.createElement('p');
  deskripsi.className = 'card-text';
  deskripsi.textContent = product.deskripsi;
  deskripsi.style.cssText = 'font-size: 0.95rem; color: #555;';
  cardBody.appendChild(deskripsi);

  card.appendChild(imgWrapper);
  card.appendChild(cardBody);
  col.appendChild(card);
  return col;
}

async function renderRandomProductsForIndex() {
  const container = document.getElementById('featured-produk-container');
  if (!container) return;

  const data = await fetchProdukData();
  if (!data || !Array.isArray(data.produk) || data.produk.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Produk tidak tersedia</p>';
    return;
  }

  const randomProducts = getRandomProducts(data.produk, 3);
  container.innerHTML = '';

  const row = document.createElement('div');
  row.className = 'row g-4 mb-4';

  randomProducts.forEach(product => {
    row.appendChild(createProductCardForIndex(product));
  });

  container.appendChild(row);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only run on pages that have the featured products container
  if (document.getElementById('featured-produk-container')) {
    renderRandomProductsForIndex();
  }
  
  // Only run on UMKM page that has products container
  if (document.getElementById('produk-cards-container')) {
    initProdukPage();
  }
});
