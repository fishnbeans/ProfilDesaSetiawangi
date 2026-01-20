// Module: render-contact.js
// Fetches kontak.json and renders contact information in the footer and contact page

const KONTAK_URL = '/assets/data/kontak.json';

async function fetchKontakData() {
  try {
    const res = await fetch(KONTAK_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch kontak data');
    return await res.json();
  } catch (err) {
    console.error('render-contact:', err);
    return null;
  }
}

async function renderContactInfo() {
  const kontakContainer = document.getElementById('kontak-container');
  if (!kontakContainer) return;

  const data = await fetchKontakData();
  if (!data) {
    kontakContainer.innerHTML = '<p class="text-muted">Data kontak tidak tersedia</p>';
    return;
  }

  kontakContainer.innerHTML = '';

  // Email
  const emailParagraph = document.createElement('p');
  emailParagraph.className = 'mb-1';
  emailParagraph.innerHTML = `<strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a>`;
  kontakContainer.appendChild(emailParagraph);

  // Phone
  const phoneParagraph = document.createElement('p');
  phoneParagraph.className = 'mb-0';
  phoneParagraph.innerHTML = `<strong>Tel:</strong> <a href="tel:${data.telepon.replace(/[^\d+]/g, '')}">${data.telepon}</a>`;
  kontakContainer.appendChild(phoneParagraph);
}

async function renderContactPageInfo() {
  const kontakPageContainer = document.getElementById('kontak-page-container');
  if (!kontakPageContainer) return;

  const data = await fetchKontakData();
  if (!data) {
    kontakPageContainer.innerHTML = '<p class="text-center text-muted">Data kontak tidak tersedia</p>';
    return;
  }

  kontakPageContainer.innerHTML = '';

  // Contact items with icons
  const contactItems = [
    {
      title: data.kantor,
      content: data.alamat,
      icon: 'bi-building',
      href: null
    },
    {
      title: 'Email',
      content: data.email,
      icon: 'bi-envelope',
      href: `mailto:${data.email}`
    },
    {
      title: 'Telepon',
      content: data.telepon,
      icon: 'bi-telephone',
      href: `tel:${data.telepon.replace(/[^\d+]/g, '')}`
    }
  ];

  contactItems.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100 border-0 shadow-sm';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-center';

    // Icon
    const iconElement = document.createElement('i');
    iconElement.className = `bi ${item.icon} fs-1 text-success mb-3`;
    cardBody.appendChild(iconElement);

    // Title
    const title = document.createElement('h5');
    title.className = 'card-title text-success fw-bold';
    title.textContent = item.title;
    cardBody.appendChild(title);

    // Content
    const content = document.createElement('p');
    content.className = 'card-text';
    if (item.href) {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'text-decoration-none';
      link.textContent = item.content;
      content.appendChild(link);
    } else {
      content.textContent = item.content;
    }
    cardBody.appendChild(content);

    card.appendChild(cardBody);
    col.appendChild(card);
    kontakPageContainer.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderContactInfo();
  renderContactPageInfo();
});
