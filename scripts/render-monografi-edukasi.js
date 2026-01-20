// Module: render-monografi-edukasi.js
// Fetches monografi-edukasi.json and renders population by education bar chart
const MONOGRAFI_EDUKASI_URL = '/assets/data/monografi-edukasi.json';

async function fetchMonografiEdukasiData() {
  try {
    const res = await fetch(MONOGRAFI_EDUKASI_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch monografi edukasi data');
    return await res.json();
  } catch (err) {
    console.error('render-monografi-edukasi:', err);
    return null;
  }
}

async function renderMonografiEdukasiChart() {
  const container = document.getElementById('monografi-edukasi-chart-container');
  if (!container) return;

  const data = await fetchMonografiEdukasiData();
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    container.innerHTML = '<p class="text-muted">Data demografi edukasi tidak tersedia</p>';
    return;
  }

  // Extract labels (education levels) and values (population counts)
  const labels = data.data.map(item => item.education);
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
  if (window.monografiEdukasiChart instanceof Chart) {
    window.monografiEdukasiChart.destroy();
  }

  // Create new bar chart
  window.monografiEdukasiChart = new Chart(ctx, {
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
            text: 'Tingkat Pendidikan'
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Render chart when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMonografiEdukasiChart);
} else {
  renderMonografiEdukasiChart();
}
