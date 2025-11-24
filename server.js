// Server Backend untuk API (opsional - jika ingin menggunakan database MySQL)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS, images)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API endpoint untuk menyimpan order
app.post('/api/order', (req, res) => {
  const { order_id, items, status, time, total } = req.body;
  
  const query = 'INSERT INTO orders (order_id, items, status, time, total) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [order_id, items, status, time, total], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// API endpoint untuk mendapatkan semua orders
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY time DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, orders: results });
  });
});

// API endpoint untuk update status order
app.put('/api/order/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Order updated successfully' });
  });
});

// API endpoint untuk delete order
app.delete('/api/order/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM orders WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
