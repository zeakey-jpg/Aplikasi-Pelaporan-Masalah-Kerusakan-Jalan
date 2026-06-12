/**
 * Utility Functions
 */

/**
 * Tampilkan Toast Notification
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe notifikasi (success, danger, warning, info)
 * @param {number} duration - Durasi tampil (ms)
 */
function showToast(message, type = 'info', duration = 5000) {
  const container = document.querySelector('main') || document.body;
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.style.position = 'sticky';
  alertDiv.style.top = '0';
  alertDiv.style.zIndex = '1050';
  alertDiv.style.margin = '1rem';
  
  const icons = {
    success: '<i class="bi bi-check-circle"></i>',
    danger: '<i class="bi bi-exclamation-circle"></i>',
    warning: '<i class="bi bi-exclamation-triangle"></i>',
    info: '<i class="bi bi-info-circle"></i>'
  };
  
  alertDiv.innerHTML = `
    ${icons[type] || icons.info} ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  container.insertBefore(alertDiv, container.firstChild);
  
  if (duration > 0) {
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }

  return alertDiv;
}

/**
 * Format tanggal ke format Indonesia
 * @param {Date|string} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal yang sudah diformat
 */
function formatDate(date) {
  const d = new Date(date);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format tanggal dan waktu ke format Indonesia
 * @param {Date|string} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dan waktu yang sudah diformat
 */
function formatDateTime(date) {
  const d = new Date(date);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${hours}:${minutes}`;
}

/**
 * Validasi email
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validasi nomor telepon Indonesia
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean}
 */
function validatePhone(phone) {
  const regex = /^(\+62|0)[0-9]{9,12}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Copy text ke clipboard
 * @param {string} text - Text yang akan dicopy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Teks berhasil disalin!', 'success', 3000);
  }).catch(err => {
    showToast('Gagal menyalin teks', 'danger', 3000);
  });
}

/**
 * Hitung jarak antara dua koordinat (Haversine formula)
 * @param {number} lat1 - Latitude point 1
 * @param {number} lon1 - Longitude point 1
 * @param {number} lat2 - Latitude point 2
 * @param {number} lon2 - Longitude point 2
 * @returns {number} - Jarak dalam km
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}

/**
 * Format angka dengan separator ribuan
 * @param {number} num - Angka yang akan diformat
 * @returns {string}
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Tunggu beberapa waktu (dalam ms)
 * @param {number} ms - Milidetik
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function untuk mencegah multiple calls
 * @param {Function} func - Function yang akan di-debounce
 * @param {number} delay - Delay dalam ms
 * @returns {Function}
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function untuk membatasi frekuensi calls
 * @param {Function} func - Function yang akan di-throttle
 * @param {number} limit - Limit dalam ms
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Truncate text dengan ellipsis
 * @param {string} text - Text yang akan di-truncate
 * @param {number} length - Panjang maksimal
 * @returns {string}
 */
function truncate(text, length = 50) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Get URL parameter
 * @param {string} param - Nama parameter
 * @returns {string|null}
 */
function getURLParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

/**
 * Export object ke CSV
 * @param {Array} data - Array of objects
 * @param {string} filename - Nama file CSV
 */
function exportCSV(data, filename = 'export.csv') {
  if (data.length === 0) {
    showToast('Tidak ada data untuk diekspor', 'warning');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csv.push(values.join(','));
  });

  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

console.log('Utils.js loaded successfully');
