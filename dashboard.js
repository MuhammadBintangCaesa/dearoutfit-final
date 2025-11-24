// API Configuration
const API_URL = 'http://localhost:3000/api';
let useDatabase = false;

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

function logout() {
	window.location.href = 'index.html';
}

// Tampilkan pesanan dari database atau localStorage
async function renderOrders() {
	const ordersList = document.getElementById('orders-list');
	let orders = [];

	if (useDatabase) {
		// Ambil dari database
		try {
			const response = await fetch(`${API_URL}/orders`);
			const result = await response.json();
			if (result.success) {
				orders = result.orders;
				console.log('✅ Orders loaded from database');
			} else {
				throw new Error('Failed to load orders');
			}
		} catch (error) {
			console.error('❌ Database error, falling back to localStorage:', error);
			orders = JSON.parse(localStorage.getItem('orders') || '[]');
		}
	} else {
		// Ambil dari localStorage
		orders = JSON.parse(localStorage.getItem('orders') || '[]');
	}

	if (orders.length === 0) {
		ordersList.innerHTML = '<div class="text-center text-muted">Belum ada pesanan.</div>';
		return;
	}

	ordersList.innerHTML = '';
	orders.forEach((order, idx) => {
		let statusColor = order.status === 'Telah Dibayar' ? '#28a745' : (order.status === 'Menunggu' ? '#ffc107' : (order.status === 'Pesanan Telah Selesai' ? '#007bff' : '#dc3545'));
		ordersList.innerHTML += `
			<div class="order-card">
				<div class="order-info">
					${order.order_id || order.id} - ${order.items}<br>
					<span style='font-size:0.9em;color:#888'>${order.time}</span><br>
					<span class='fw-bold text-success'>Total: Rp ${order.total ? Number(order.total).toLocaleString() : '0'}</span>
				</div>
				<div>
					<span class="order-status" style="color:${statusColor}">${order.status}</span>
					${order.status === 'Menunggu' ? `<button class='btn btn-sm btn-success ms-2' onclick='verifyOrder(${useDatabase ? order.id : idx})'>Verifikasi Pembayaran</button>` : ''}
					${order.status === 'Telah Dibayar' ? `<button class='btn btn-sm btn-primary ms-2' onclick='finishOrder(${useDatabase ? order.id : idx})'>Pesanan Selesai</button>` : ''}
				</div>
			</div>
		`;
	});
}

// Verifikasi pembayaran
async function verifyOrder(id) {
	if (useDatabase) {
		// Update di database
		try {
			const response = await fetch(`${API_URL}/order/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'Telah Dibayar' })
			});
			const result = await response.json();
			if (result.success) {
				console.log('✅ Order verified in database');
				renderOrders();
			}
		} catch (error) {
			console.error('❌ Database error:', error);
			alert('Gagal verifikasi pesanan');
		}
	} else {
		// Update di localStorage
		let orders = JSON.parse(localStorage.getItem('orders') || '[]');
		if (orders[id]) {
			orders[id].status = 'Telah Dibayar';
			localStorage.setItem('orders', JSON.stringify(orders));
			renderOrders();
		}
	}
}

// Tandai pesanan selesai
async function finishOrder(id) {
	if (useDatabase) {
		// Update di database
		try {
			const response = await fetch(`${API_URL}/order/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'Pesanan Telah Selesai' })
			});
			const result = await response.json();
			if (result.success) {
				console.log('✅ Order finished in database');
				renderOrders();
			}
		} catch (error) {
			console.error('❌ Database error:', error);
			alert('Gagal menyelesaikan pesanan');
		}
	} else {
		// Update di localStorage
		let orders = JSON.parse(localStorage.getItem('orders') || '[]');
		if (orders[id]) {
			orders[id].status = 'Pesanan Telah Selesai';
			localStorage.setItem('orders', JSON.stringify(orders));
			renderOrders();
		}
	}
}

// Clear pesanan lunas
async function clearPaidOrders() {
	if (useDatabase) {
		// Hapus dari database
		try {
			const response = await fetch(`${API_URL}/orders`);
			const result = await response.json();
			if (result.success) {
				const paidOrders = result.orders.filter(o => o.status === 'Telah Dibayar');
				for (const order of paidOrders) {
					await fetch(`${API_URL}/order/${order.id}`, {
						method: 'DELETE'
					});
				}
				console.log('✅ Paid orders cleared from database');
				renderOrders();
				alert('Pesanan lunas telah dihapus dan ditandai selesai/diantar!');
			}
		} catch (error) {
			console.error('❌ Database error:', error);
		}
	} else {
		// Hapus dari localStorage
		let orders = JSON.parse(localStorage.getItem('orders') || '[]');
		orders = orders.filter(order => order.status !== 'Telah Dibayar');
		localStorage.setItem('orders', JSON.stringify(orders));
		renderOrders();
		alert('Pesanan lunas telah dihapus dan ditandai selesai/diantar!');
	}
}

// Inisialisasi saat halaman dimuat
(async function init() {
	await checkBackend();
	await renderOrders();
})();
