// Semua request backend memakai alamat relatif agar tetap jalan di komputer lab.
const API_URL = '/api';
const products = [
  { id: 1, name: 'T-Shirt', price: 120000, img: 'images/tshirt.jpg', category: 'fashion' },
  { id: 2, name: 'Jeans', price: 220000, img: 'images/jeans.jpg', category: 'fashion' },
  { id: 3, name: 'Sneakers', price: 350000, img: 'images/sneakers.jpg', category: 'shoes' },
  { id: 4, name: 'Dress', price: 180000, img: 'images/dress.jpg', category: 'fashion' },
  { id: 5, name: 'Short Pants', price: 100000, img: 'images/shortpants.jpg', category: 'fashion' },
  { id: 6, name: 'Hoodie', price: 200000, img: 'images/hoodie.jpg', category: 'fashion' },
  { id: 7, name: 'Cap', price: 80000, img: 'images/cap.jpg', category: 'accessories' }
];

// localStorage dipakai sebagai mode cadangan saat MySQL belum diaktifkan.
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentCategory = 'all';
let databaseReady = false;
let isRegisterMode = false;
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const rupiah = value => `Rp ${Number(value).toLocaleString('id-ID')}`;
const localOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');
const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));

async function checkBackend() {
  try {
    const response = await fetch(`${API_URL}/health`);
    databaseReady = response.ok && (await response.json()).database;
  } catch (_) { databaseReady = false; }
}

function renderProducts() {
  // Menampilkan produk berdasarkan kategori yang sedang dipilih user.
  const shown = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
  document.getElementById('products').innerHTML = shown.map((p, i) => `
    <div class="col-md-4 col-lg-3 mb-4"><div class="card h-100 animate__animated animate__fadeInUp animate__delay-${i % 4}s">
      <img src="${p.img}" class="card-img-top" alt="${p.name}"><div class="card-body d-flex flex-column">
      <h5 class="card-title">${p.name}</h5><p class="card-text mb-2">${rupiah(p.price)}</p>
      <span class="badge bg-info mb-2">${p.category}</span><button class="btn btn-primary mt-auto" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
    </div></div></div>`).join('');
}

function filterCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach((button, index) => button.classList.toggle('active', ['all', 'fashion', 'shoes', 'accessories'][index] === category));
  renderProducts();
}

function addToCart(id) {
  // Jika produk sama ditambahkan lagi, cukup naikkan jumlahnya.
  const item = cart.find(product => product.id === id);
  if (item) item.qty += 1;
  else cart.push({ ...products.find(product => product.id === id), qty: 1 });
  saveCart(); updateCartCount();
}

function updateCartCount() { document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0); }
function cartTotal() { return cart.reduce((sum, item) => sum + item.price * item.qty, 0); }

function showCart() { renderCart(); new bootstrap.Modal(document.getElementById('cart-modal')).show(); }
function renderCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = cart.length ? cart.map(item => `<li class="list-group-item d-flex justify-content-between align-items-center">${item.name} × ${item.qty}<button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Hapus</button></li>`).join('') : '<li class="list-group-item text-muted">Keranjang masih kosong.</li>';
  document.getElementById('cart-total').textContent = `Total: ${rupiah(cartTotal())}`;
}
function removeFromCart(id) { cart = cart.filter(item => item.id !== id); saveCart(); updateCartCount(); renderCart(); }

function showPayment() {
  if (!cart.length) return alert('Keranjang kosong!');
  // Checkout wajib memakai akun supaya pesanan masuk ke riwayat user yang benar.
  if (!currentUser) { showUserAuth(); return; }
  document.getElementById('payment-detail').innerHTML = `<ul class="list-group mb-2">${cart.map(item => `<li class="list-group-item d-flex justify-content-between">${item.name} × ${item.qty}<span>${rupiah(item.price * item.qty)}</span></li>`).join('')}</ul><div class="fw-bold">Total: ${rupiah(cartTotal())}</div>`;
  bootstrap.Modal.getInstance(document.getElementById('cart-modal'))?.hide();
  setTimeout(() => new bootstrap.Modal(document.getElementById('payment-modal')).show(), 300);
}

async function doCheckout() {
  if (!currentUser || !cart.length) return;
  const order = {
    id: Date.now(), order_id: `ORD${Date.now()}`, customer_id: currentUser.id, customer_name: currentUser.name,
    items: cart.map(item => `${item.name} x${item.qty}`).join(', '), total: cartTotal(),
    payment_method: document.querySelector('input[name="payMethod"]:checked').value,
    status: 'Menunggu Verifikasi', created_at: new Date().toISOString()
  };
  try {
    // Simpan ke MySQL bila tersedia; jika belum, aplikasi tetap dapat didemokan.
    if (databaseReady) {
      const response = await fetch(`${API_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
      if (!response.ok) throw new Error();
    } else { localStorage.setItem('orders', JSON.stringify([order, ...localOrders()])); }
    cart = []; saveCart(); updateCartCount(); bootstrap.Modal.getInstance(document.getElementById('payment-modal'))?.hide();
    alert('Pesanan berhasil dibuat. Tunggu admin memverifikasi pembayaran kamu.');
  } catch (_) { alert('Pesanan gagal disimpan. Pastikan database dan server aktif.'); }
}

function showUserAuth() {
  isRegisterMode = false; renderAuthMode();
  new bootstrap.Modal(document.getElementById('user-auth-modal')).show();
}
function toggleUserAuth() { isRegisterMode = !isRegisterMode; renderAuthMode(); }
function renderAuthMode() {
  document.getElementById('user-auth-title').textContent = isRegisterMode ? 'Daftar User' : 'Login User';
  document.getElementById('user-name').style.display = isRegisterMode ? 'block' : 'none';
  document.getElementById('auth-switch').textContent = isRegisterMode ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar';
  document.getElementById('user-auth-submit').textContent = isRegisterMode ? 'Daftar' : 'Login';
  document.getElementById('user-auth-error').textContent = '';
}
async function submitUserAuth() {
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim().toLowerCase();
  const password = document.getElementById('user-password').value;
  const error = document.getElementById('user-auth-error');
  if (!email || !password || (isRegisterMode && !name)) { error.textContent = 'Lengkapi data terlebih dahulu.'; return; }
  try {
    // Register dan login memakai API yang sama, beda endpoint saja.
    if (databaseReady) {
      const response = await fetch(`${API_URL}/auth/${isRegisterMode ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      currentUser = result.user;
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (isRegisterMode) { if (users.some(user => user.email === email)) throw new Error('Email sudah terdaftar.'); currentUser = { id: Date.now(), name, email }; users.push({ ...currentUser, password }); localStorage.setItem('users', JSON.stringify(users)); }
      else { const found = users.find(user => user.email === email && user.password === password); if (!found) throw new Error('Email atau password salah.'); currentUser = { id: found.id, name: found.name, email: found.email }; }
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); updateUserUI(); bootstrap.Modal.getInstance(document.getElementById('user-auth-modal'))?.hide();
  } catch (err) { error.textContent = err.message || 'Login gagal.'; }
}

function updateUserUI() {
  document.getElementById('user-greeting').textContent = currentUser ? `Hai, ${currentUser.name}` : '';
  document.getElementById('user-login-btn').style.display = currentUser ? 'none' : 'inline-block';
  document.getElementById('history-btn').style.display = currentUser ? 'inline-block' : 'none';
  document.getElementById('user-logout-btn').style.display = currentUser ? 'inline-block' : 'none';
}
function logoutUser() { currentUser = null; localStorage.removeItem('currentUser'); updateUserUI(); }

async function showHistory() {
  // Filter customerId memastikan user hanya melihat pesanannya sendiri.
  let orders = [];
  try { orders = databaseReady ? (await (await fetch(`${API_URL}/orders?customerId=${currentUser.id}`)).json()).orders : localOrders().filter(order => String(order.customer_id) === String(currentUser.id)); }
  catch (_) { orders = []; }
  document.getElementById('history-list').innerHTML = orders.length ? orders.map(order => `<div class="border rounded p-3 mb-2"><b>${order.order_id}</b><br>${order.items}<br>Metode: ${String(order.payment_method || 'transfer').toUpperCase()} · <span class="fw-bold">${order.status}</span><br>Total: ${rupiah(order.total)}</div>`).join('') : '<p class="text-muted mb-0">Belum ada riwayat transaksi.</p>';
  new bootstrap.Modal(document.getElementById('history-modal')).show();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[name="payMethod"]').forEach(radio => radio.addEventListener('change', () => document.getElementById('qris-section').style.display = document.getElementById('payQris').checked ? 'block' : 'none'));
});
(async function init() { await checkBackend(); renderProducts(); updateCartCount(); updateUserUI(); })();
