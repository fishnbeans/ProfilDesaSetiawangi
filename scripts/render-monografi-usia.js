// Module: render-monografi-usia.js
// Fetches monografi-usia.json and renders population by age range bar chart
const MONOGRAFI_USIA_URL = '/assets/data/monografi-usia.json';

async function fetchMonografiUsiaData() {
  try {
    const res = await fetch(MONOGRAFI_USIA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch monografi usia data');
    return await res.json();
  } catch (err) {
    console.error('render-monografi-usia:', err);
    return null;
  }
}

async function renderMonografiUsiaChart() {
  const container = document.getElementById('monografi-usia-chart-container');
  if (!container) return;

  const data = await fetchMonografiUsiaData();
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    container.innerHTML = '<p class="text-muted">Data demografi usia tidak tersedia</p>';
    return;
  }

  // Extract labels (age ranges) and values (population counts)
  const labels = data.data.map(item => item.ageRange);
  const counts = data.data.map(item => item.count);

  // Create canvas if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }

  // Get or create chart context
  const ctx = canvas.getContext('2d');

  // Destroy existing chart if it exists
  if (window.monografiUsiaChart instanceof Chart) {
    window.monografiUsiaChart.destroy();
  }

  // Create new bar chart
  window.monografiUsiaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Jumlah Penduduk',
          data: counts,
          backgroundColor: 'rgba(25, 135, 84, 0.6)',
          borderColor: 'rgba(25, 135, 84, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(25, 135, 84, 0.8)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          font: {
            weight: 'bold'
          },
          color: 'rgba(25, 135, 84, 1)',
          formatter: function(value) {
            return value.toLocaleString('id-ID');
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah Penduduk'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Kelompok Usia'
          }
        }
      }
    },
    plugins: [ChartDataLabels],
    plugins: [ChartDataLabels]
  });
}

// Render chart when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMonografiUsiaChart);
} else {
  renderMonografiUsiaChart();
}
