// Konfigurasi koneksi database (untuk backend Node.js + MySQL)
// File ini adalah contoh untuk server backend terpisah

const mysql = require('mysql2');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'bintangca',
  password: 'Bintang@123123',
  database: 'ecommerce',
  port: 3306
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
