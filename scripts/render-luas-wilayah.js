/**
 * render-luas-wilayah.js
 * Renders the luas wilayah table from JSON data
 */

async function renderLuasWilayah() {
    try {
        const response = await fetch('assets/data/luas-wilayah.json');
        if (!response.ok) {
            console.warn('Failed to load luas wilayah data');
            return;
        }

        const data = await response.json();
        const tbody = document.getElementById('luas-wilayah-table-body');

        if (!tbody) {
            console.warn('Table body element not found');
            return;
        }

        // Clear existing content
        tbody.innerHTML = '';

        // Check if luas-wilayah array exists and has data
        if (!Array.isArray(data['luas-wilayah']) || data['luas-wilayah'].length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Tidak ada data</td></tr>';
            return;
        }

        // Render each row
        data['luas-wilayah'].forEach((row) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.Lahan || '—'}</td>
                <td>${row.Luas || '—'}</td>
                <td>${row.Satuan || '—'}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error rendering luas wilayah table:', error);
    }
}

// Call the function when DOM is ready
document.addEventListener('DOMContentLoaded', renderLuasWilayah);
