// Module: render-carousel.js
// Fetches carousel.json and renders carousel items dynamically
const CAROUSEL_URL = '/assets/data/carousel.json';

async function fetchCarouselData() {
  try {
    const res = await fetch(CAROUSEL_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch carousel data');
    return await res.json();
  } catch (err) {
    console.error('render-carousel:', err);
    return null;
  }
}

function createCarouselIndicator(index, isActive = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-bs-target', '#homeCarousel');
  button.setAttribute('data-bs-slide-to', index);
  button.className = isActive ? 'active' : '';
  if (isActive) {
    button.setAttribute('aria-current', 'true');
  }
  button.setAttribute('aria-label', `Slide ${index + 1}`);
  return button;
}

function createCarouselItem(slide, isActive = false) {
  const item = document.createElement('div');
  item.className = `carousel-item${isActive ? ' active' : ''}`;

  const img = document.createElement('img');
  img.src = slide.image;
  img.className = 'd-block w-100';
  img.alt = slide.title;

  const caption = document.createElement('div');
  caption.className = 'carousel-caption';

  const title = document.createElement('h1');
  title.className = 'fw-bold';
  title.textContent = slide.title;

  const description = document.createElement('p');
  description.textContent = slide.description;

  const button = document.createElement('a');
  button.href = slide.buttonLink;
  button.className = 'btn btn-success rounded-pill my-3 px-3 py-2';
  button.textContent = ' ' + slide.buttonText + ' ';

  caption.appendChild(title);
  caption.appendChild(description);
  caption.appendChild(button);
  item.appendChild(img);
  item.appendChild(caption);

  return item;
}

async function renderCarousel() {
  const carouselInner = document.querySelector('#homeCarousel .carousel-inner');
  const carouselIndicators = document.querySelector('#homeCarousel .carousel-indicators');

  if (!carouselInner || !carouselIndicators) return;

  const data = await fetchCarouselData();
  if (!data || !Array.isArray(data.slides) || data.slides.length === 0) {
    carouselInner.innerHTML = '<div class="carousel-item active"><p class="text-center">Belum ada data carousel.</p></div>';
    return;
  }

  carouselInner.innerHTML = '';
  carouselIndicators.innerHTML = '';

  data.slides.forEach((slide, index) => {
    const isActive = index === 0;
    carouselInner.appendChild(createCarouselItem(slide, isActive));
    carouselIndicators.appendChild(createCarouselIndicator(index, isActive));
  });
}

document.addEventListener('DOMContentLoaded', renderCarousel);
