const API_URL = '/api';
let databaseReady = false;
const rupiah = value => `Rp ${Number(value).toLocaleString('id-ID')}`;

function logout() { localStorage.removeItem('adminLoggedIn'); window.location.href = 'index.html'; }

async function checkBackend() {
  try { const response = await fetch(`${API_URL}/health`); databaseReady = response.ok && (await response.json()).database; }
  catch (_) { databaseReady = false; }
}

async function renderOrders() {
  const ordersList = document.getElementById('orders-list');
  let orders = [];
  try {
    orders = databaseReady ? (await (await fetch(`${API_URL}/orders`)).json()).orders : JSON.parse(localStorage.getItem('orders') || '[]');
  } catch (_) { ordersList.innerHTML = '<div class="text-danger">Gagal memuat pesanan.</div>'; return; }
  if (!orders.length) { ordersList.innerHTML = '<div class="text-center text-muted">Belum ada pesanan.</div>'; return; }
  // Tombol aksi berubah mengikuti status pesanan saat ini.
  ordersList.innerHTML = orders.map((order, index) => {
    const id = databaseReady ? order.id : index;
    const date = new Date(order.created_at || order.time).toLocaleString('id-ID');
    const verify = order.status === 'Menunggu Verifikasi' ? `<button class="btn btn-sm btn-success ms-2" onclick="updateStatus(${id}, 'Telah Dibayar')">Verifikasi Pembayaran</button>` : '';
    const finish = order.status === 'Telah Dibayar' ? `<button class="btn btn-sm btn-primary ms-2" onclick="updateStatus(${id}, 'Pesanan Selesai')">Tandai Selesai</button>` : '';
    return `<div class="order-card"><div class="order-info"><b>${order.order_id}</b> · ${order.customer_name || 'User'}<br>${order.items}<br><small>${date} · ${String(order.payment_method || 'transfer').toUpperCase()}</small><br><span class="fw-bold text-success">Total: ${rupiah(order.total)}</span></div><div class="text-end"><span class="order-status">${order.status}</span><br>${verify}${finish}<button class="btn btn-sm btn-outline-danger ms-2 mt-2" onclick="deleteOrder(${id})">Hapus</button></div></div>`;
  }).join('');
}

async function updateStatus(id, status) {
  // Admin memverifikasi pembayaran lalu menandai pesanan selesai.
  try {
    if (databaseReady) await fetch(`${API_URL}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    else { const orders = JSON.parse(localStorage.getItem('orders') || '[]'); orders[id].status = status; localStorage.setItem('orders', JSON.stringify(orders)); }
    renderOrders();
  } catch (_) { alert('Gagal mengubah status pesanan.'); }
}

async function deleteOrder(id) {
  if (!confirm('Hapus pesanan ini?')) return;
  try {
    if (databaseReady) await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
    else { const orders = JSON.parse(localStorage.getItem('orders') || '[]'); orders.splice(id, 1); localStorage.setItem('orders', JSON.stringify(orders)); }
    renderOrders();
  } catch (_) { alert('Gagal menghapus pesanan.'); }
}

(async function init() {
  if (localStorage.getItem('adminLoggedIn') !== 'true') { window.location.href = 'login.html'; return; }
  await checkBackend(); renderOrders();
})();
