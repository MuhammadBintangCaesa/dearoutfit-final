const mysql = require('mysql2');

// Ubah lewat environment variable saat dijalankan di lab.
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection((err, connection) => {
  if (err) {
    console.warn('MySQL belum terhubung. Aplikasi tetap bisa memakai localStorage:', err.code);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

module.exports = db;
