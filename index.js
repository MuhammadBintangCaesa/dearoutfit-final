// API Configuration
const API_URL = 'http://localhost:3000/api';

// Product data with category
const products = [
	{ id: 1, name: 'T-Shirt', price: 120000, img: 'images/tshirt.jpg', category: 'fashion' },
	{ id: 2, name: 'Jeans', price: 220000, img: 'images/jeans.jpg', category: 'fashion' },
	{ id: 3, name: 'Sneakers', price: 350000, img: 'images/sneakers.jpg', category: 'shoes' },
	{ id: 4, name: 'Dress', price: 180000, img: 'images/dress.jpg', category: 'fashion' },
	{ id: 5, name: 'Short Pants', price: 100000, img: 'images/shortpants.jpg', category: 'fashion' },
	{ id: 6, name: 'Hoodie', price: 200000, img: 'images/hoodie.jpg', category: 'fashion' },
	{ id: 7, name: 'Cap', price: 80000, img: 'images/cap.jpg', category: 'accessories' }
];

let cart = [];
let isAdmin = false;
const adminUser = 'admin';
const adminPass = '12345';
let currentCategory = 'all';
let useDatabase = false; // Auto-detect apakah backend tersedia

// Check apakah backend server aktif
async function checkBackend() {
	try {
		const response = await fetch(`${API_URL}/health`);
		useDatabase = response.ok;
		console.log(useDatabase ? '✅ Backend connected' : '⚠️ Using localStorage');
	} catch (error) {
		useDatabase = false;
		console.log('⚠️ Backend not available, using localStorage');
	}
}

function renderProducts() {
	const prodDiv = document.getElementById('products');
	prodDiv.innerHTML = '';
	let filtered = products;
	if (currentCategory !== 'all') {
		filtered = products.filter(p => p.category === currentCategory);
	}
	if (filtered.length === 0) {
		prodDiv.innerHTML = `<div class='col-12 text-center'><p class='text-muted'>Produk tidak ditemukan.</p></div>`;
		return;
	}
	filtered.forEach((p, i) => {
		prodDiv.innerHTML += `
			<div class="col-md-4 col-lg-3 mb-4">
				<div class="card h-100 animate__animated animate__fadeInUp animate__delay-${i%4}s">
					<img src="${p.img}" class="card-img-top" alt="${p.name}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${p.name}</h5>
						<p class="card-text mb-2">Rp ${p.price.toLocaleString()}</p>
						<span class="badge bg-info mb-2">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</span>
						<button class="btn btn-primary mt-auto" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
					</div>
				</div>
			</div>
		`;
	});
}

function filterCategory(cat) {
	currentCategory = cat;
	document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
	if (cat === 'all') document.querySelector('.category-btn').classList.add('active');
	else document.querySelectorAll('.category-btn')[['fashion','shoes','accessories'].indexOf(cat)+1].classList.add('active');
	renderProducts();
}

function addToCart(id) {
	const prod = products.find(p => p.id === id);
	const item = cart.find(i => i.id === id);
	if (item) item.qty++;
	else cart.push({ ...prod, qty: 1 });
	updateCartCount();
}

function updateCartCount() {
	document.getElementById('cart-count').textContent = cart.reduce((a, b) => a + b.qty, 0);
}

function showCart() {
	renderCart();
	const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
	cartModal.show();
}

function renderCart() {
	const list = document.getElementById('cart-list');
	list.innerHTML = '';
	let total = 0;
	cart.forEach(item => {
		total += item.price * item.qty;
		list.innerHTML += `<li class='list-group-item d-flex justify-content-between align-items-center'>${item.name} x ${item.qty} <button class='btn btn-sm btn-danger' onclick="removeFromCart(${item.id})">Hapus</button></li>`;
	});
	document.getElementById('cart-total').textContent = 'Total: Rp ' + total.toLocaleString();
}

function removeFromCart(id) {
	cart = cart.filter(i => i.id !== id);
	updateCartCount();
	renderCart();
}

// Visual pembayaran
function showPayment() {
	if (cart.length === 0) { alert('Keranjang kosong!'); return; }
	// Tampilkan detail pesanan di modal pembayaran
	let detail = '<ul class="list-group mb-2">';
	let total = 0;
	cart.forEach(item => {
		detail += `<li class='list-group-item d-flex justify-content-between align-items-center'>${item.name} <span>x${item.qty}</span> <span>Rp ${item.price.toLocaleString()}</span></li>`;
		total += item.price * item.qty;
	});
	detail += '</ul>';
	detail += `<div class='fw-bold'>Total: Rp ${total.toLocaleString()}</div>`;
	document.getElementById('payment-detail').innerHTML = detail;
	const cartModal = bootstrap.Modal.getInstance(document.getElementById('cart-modal'));
	cartModal.hide();
	setTimeout(() => {
		const paymentModal = new bootstrap.Modal(document.getElementById('payment-modal'));
		paymentModal.show();
	}, 400);
}

// Proses checkout - simpan ke database atau localStorage
async function doCheckout() {
	if (cart.length === 0) { alert('Keranjang kosong!'); return; }
	
	const orderId = 'ORD' + Date.now();
	const orderItems = cart.map(item => `${item.name} x${item.qty}`).join(', ');
	const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
	
	// Format datetime untuk MySQL: YYYY-MM-DD HH:MM:SS
	const now = new Date();
	const mysqlDateTime = now.getFullYear() + '-' + 
		String(now.getMonth() + 1).padStart(2, '0') + '-' + 
		String(now.getDate()).padStart(2, '0') + ' ' + 
		String(now.getHours()).padStart(2, '0') + ':' + 
		String(now.getMinutes()).padStart(2, '0') + ':' + 
		String(now.getSeconds()).padStart(2, '0');
	
	const order = {
		order_id: orderId,
		items: orderItems,
		status: 'Menunggu',
		time: mysqlDateTime,
		total: total
	};

	if (useDatabase) {
		// Simpan ke database via API
		try {
			const response = await fetch(`${API_URL}/order`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(order)
			});
			const result = await response.json();
			if (result.success) {
				console.log('✅ Order saved to database');
			} else {
				throw new Error('Failed to save order');
			}
		} catch (error) {
			console.error('❌ Database error, falling back to localStorage:', error);
			saveToLocalStorage(order);
		}
	} else {
		// Simpan ke localStorage
		saveToLocalStorage(order);
	}

	cart = [];
	updateCartCount();
	const paymentModal = bootstrap.Modal.getInstance(document.getElementById('payment-modal'));
	paymentModal.hide();
	setTimeout(() => {
		alert('Pembayaran berhasil! Pesanan Anda diproses.');
	}, 400);
}

function saveToLocalStorage(order) {
	let orders = JSON.parse(localStorage.getItem('orders') || '[]');
	orders.unshift(order);
	localStorage.setItem('orders', JSON.stringify(orders));
	console.log('💾 Order saved to localStorage');
}

function showLogin() {
	document.getElementById('admin-user').value = '';
	document.getElementById('admin-pass').value = '';
	document.getElementById('login-error').textContent = '';
	const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
	loginModal.show();
}

function loginAdmin() {
	const user = document.getElementById('admin-user').value;
	const pass = document.getElementById('admin-pass').value;
	if (user === adminUser && pass === adminPass) {
		isAdmin = true;
		const loginModal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
		loginModal.hide();
		setTimeout(() => {
			window.location.href = 'dashboard.html';
		}, 400);
	} else {
		document.getElementById('login-error').textContent = 'Username atau password salah!';
	}
}

function logoutAdmin() {
	isAdmin = false;
	document.getElementById('admin-panel').style.display = 'none';
}

// Inisialisasi halaman
(async function init() {
	await checkBackend();
	renderProducts();
	updateCartCount();
})();

// Event listener untuk pilihan metode pembayaran
document.addEventListener('DOMContentLoaded', function() {
	const paymentRadios = document.querySelectorAll('input[name="payMethod"]');
	const qrisSection = document.getElementById('qris-section');
	
	if (paymentRadios.length > 0 && qrisSection) {
		paymentRadios.forEach(radio => {
			radio.addEventListener('change', function() {
				if (this.value === 'qris') {
					qrisSection.style.display = 'block';
				} else {
					qrisSection.style.display = 'none';
				}
			});
		});
	}
});
