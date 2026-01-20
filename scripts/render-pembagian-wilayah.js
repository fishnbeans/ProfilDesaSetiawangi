// Module: render-pembagian-wilayah.js
// Fetches dusun-rw-rt.json and renders cards with nested accordions for Dusun > RW > RT

const DUSUN_RW_RT_URL = '/assets/data/dusun-rw-rt.json';

async function fetchDusunRWRTData() {
  try {
    const res = await fetch(DUSUN_RW_RT_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch dusun RW RT data');
    return await res.json();
  } catch (err) {
    console.error('render-pembagian-wilayah:', err);
    return null;
  }
}

async function renderPembagianWilayah() {
  const container = document.getElementById('pembagian-wilayah-container');
  if (!container) return;

  const data = await fetchDusunRWRTData();
  if (!data || !Array.isArray(data.dusun) || data.dusun.length === 0) {
    container.innerHTML = '<p class="text-muted">Data pembagian wilayah tidak tersedia</p>';
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Create a card for each dusun
  data.dusun.forEach((dusun, dusunIndex) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header bg-success text-white';
    cardHeader.innerHTML = `<h5 class="mb-0"><i class="bi bi-geo-alt-fill"></i> ${dusun.namaDusun || 'Dusun'}</h5>`;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create accordion for RW
    const accordion = document.createElement('div');
    const accordionId = `accordion-dusun-${dusunIndex}`;
    accordion.className = 'accordion';
    accordion.id = accordionId;

    if (Array.isArray(dusun.rw)) {
      dusun.rw.forEach((rw, rwIndex) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';

        const accordionHeader = document.createElement('h2');
        accordionHeader.className = 'accordion-header';

        const button = document.createElement('button');
        button.className = 'accordion-button collapsed';
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#collapse-rw-${dusunIndex}-${rwIndex}`);
        button.textContent = `${rw.namaRW || 'RW'}`;

        accordionHeader.appendChild(button);

        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse-rw-${dusunIndex}-${rwIndex}`;
        collapseDiv.className = 'accordion-collapse collapse';
        collapseDiv.setAttribute('data-bs-parent', `#${accordionId}`);

        const accordionBody = document.createElement('div');
        accordionBody.className = 'accordion-body p-0';

        // Create nested accordion for RT
        const nestedAccordion = document.createElement('div');
        nestedAccordion.className = 'accordion';
        const nestedAccordionId = `accordion-rw-${dusunIndex}-${rwIndex}`;
        nestedAccordion.id = nestedAccordionId;

        if (Array.isArray(rw.rt)) {
          rw.rt.forEach((rt, rtIndex) => {
            const nestedItem = document.createElement('div');
            nestedItem.className = 'accordion-item';

            const nestedHeader = document.createElement('h2');
            nestedHeader.className = 'accordion-header';

            const nestedButton = document.createElement('button');
            nestedButton.className = 'accordion-button collapsed';
            nestedButton.type = 'button';
            nestedButton.setAttribute('data-bs-toggle', 'collapse');
            nestedButton.setAttribute('data-bs-target', `#collapse-rt-${dusunIndex}-${rwIndex}-${rtIndex}`);
            nestedButton.innerHTML = `<strong>${rt.namaRT || 'RT'}</strong>`;

            nestedHeader.appendChild(nestedButton);

            const nestedCollapseDiv = document.createElement('div');
            nestedCollapseDiv.id = `collapse-rt-${dusunIndex}-${rwIndex}-${rtIndex}`;
            nestedCollapseDiv.className = 'accordion-collapse collapse';
            nestedCollapseDiv.setAttribute('data-bs-parent', `#${nestedAccordionId}`);

            const nestedAccordionBody = document.createElement('div');
            nestedAccordionBody.className = 'accordion-body';
            nestedAccordionBody.innerHTML = `<p class="mb-0"><i class="bi bi-house-fill"></i> <strong>Alamat:</strong> ${rt.alamat || '-'}</p>`;

            nestedCollapseDiv.appendChild(nestedAccordionBody);
            nestedItem.appendChild(nestedHeader);
            nestedItem.appendChild(nestedCollapseDiv);
            nestedAccordion.appendChild(nestedItem);
          });
        }

        accordionBody.appendChild(nestedAccordion);
        collapseDiv.appendChild(accordionBody);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(collapseDiv);
        accordion.appendChild(accordionItem);
      });
    }

    cardBody.appendChild(accordion);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    container.appendChild(card);
  });
}

// Render when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPembagianWilayah);
} else {
  renderPembagianWilayah();
}
