const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Menyajikan HTML, JavaScript, dan gambar frontend.

// Membungkus callback mysql2 menjadi Promise agar endpoint lebih mudah dibaca.
const query = (sql, values = []) => new Promise((resolve, reject) => {
  db.query(sql, values, (error, rows) => error ? reject(error) : resolve(rows));
});

app.get('/api/health', async (req, res) => {
  // Frontend memakai status ini untuk memilih MySQL atau localStorage.
  try { await query('SELECT 1'); res.json({ success: true, database: true }); }
  catch (_) { res.json({ success: true, database: false }); }
});

app.post('/api/auth/register', async (req, res) => {
  // Endpoint pendaftaran akun customer.
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, error: 'Data pendaftaran belum lengkap.' });
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await query('INSERT INTO customers (name, email, password) VALUES (?, ?, ?)', [name.trim(), normalizedEmail, password]);
    res.status(201).json({ success: true, user: { id: result.insertId, name: name.trim(), email: normalizedEmail } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.code === 'ER_DUP_ENTRY' ? 'Email sudah terdaftar.' : 'Gagal membuat akun.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const rows = await query('SELECT id, name, email FROM customers WHERE email = ? AND password = ?', [String(email).trim().toLowerCase(), password]);
    if (!rows.length) return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    res.json({ success: true, user: rows[0] });
  } catch (_) { res.status(500).json({ success: false, error: 'Database belum siap.' }); }
});

app.post('/api/auth/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const rows = await query('SELECT id, username FROM admin_users WHERE username = ? AND password = ?', [username, password]);
    if (!rows.length) return res.status(401).json({ success: false, error: 'Username atau password salah.' });
    res.json({ success: true, admin: rows[0] });
  } catch (_) { res.status(500).json({ success: false, error: 'Database belum siap.' }); }
});

app.post('/api/orders', async (req, res) => {
  // Pesanan baru selalu dimulai dari status menunggu verifikasi admin.
  const { order_id, items, total, payment_method, customer_id, customer_name } = req.body;
  if (!order_id || !items || !total || !customer_id) return res.status(400).json({ success: false, error: 'Data pesanan belum lengkap.' });
  try {
    const result = await query('INSERT INTO orders (order_id, customer_id, customer_name, items, payment_method, status, total) VALUES (?, ?, ?, ?, ?, ?, ?)', [order_id, customer_id, customer_name, items, payment_method || 'transfer', 'Menunggu Verifikasi', total]);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (_) { res.status(500).json({ success: false, error: 'Gagal menyimpan pesanan.' }); }
});

app.get('/api/orders', async (req, res) => {
  const params = [];
  let sql = 'SELECT * FROM orders';
  // Parameter customerId dipakai oleh halaman riwayat transaksi user.
  if (req.query.customerId) { sql += ' WHERE customer_id = ?'; params.push(req.query.customerId); }
  sql += ' ORDER BY created_at DESC';
  try { res.json({ success: true, orders: await query(sql, params) }); }
  catch (_) { res.status(500).json({ success: false, error: 'Gagal mengambil pesanan.' }); }
});

app.put('/api/orders/:id/status', async (req, res) => {
  // Batasi status agar tidak ada nilai acak yang masuk ke database.
  const allowed = ['Menunggu Verifikasi', 'Telah Dibayar', 'Pesanan Selesai'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, error: 'Status tidak valid.' });
  try {
    const result = await query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
    res.json({ success: true });
  } catch (_) { res.status(500).json({ success: false, error: 'Gagal mengubah status.' }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try { await query('DELETE FROM orders WHERE id = ?', [req.params.id]); res.json({ success: true }); }
  catch (_) { res.status(500).json({ success: false, error: 'Gagal menghapus pesanan.' }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
