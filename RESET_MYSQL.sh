#!/bin/bash

echo "🔧 MySQL Password Reset Script"
echo "================================"
echo ""
echo "Sepertinya password root MySQL tidak diketahui."
echo "Berikut beberapa cara mengatasinya:"
echo ""
echo "=== CARA 1: Reset Password MySQL (Homebrew) ==="
echo ""
echo "1. Stop MySQL:"
echo "   brew services stop mysql"
echo ""
echo "2. Start MySQL dalam safe mode:"
echo "   mysqld_safe --skip-grant-tables &"
echo ""
echo "3. Login tanpa password:"
echo "   mysql -u root"
echo ""
echo "4. Reset password (jalankan di MySQL prompt):"
echo "   FLUSH PRIVILEGES;"
echo "   ALTER USER 'root'@'localhost' IDENTIFIED BY 'password_baru';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "5. Stop MySQL safe mode:"
echo "   killall mysqld"
echo ""
echo "6. Start MySQL normal:"
echo "   brew services start mysql"
echo ""
echo "7. Login dengan password baru:"
echo "   mysql -u root -p"
echo ""
echo "=== CARA 2: Pakai DBeaver (LEBIH MUDAH) ==="
echo ""
echo "1. Buka DBeaver"
echo "2. New Connection → MySQL"
echo "3. Coba kombinasi ini sampai ada yang berhasil:"
echo "   - User: root, Password: (kosong)"
echo "   - User: root, Password: root"
echo "   - User: root, Password: mysql"
echo "   - User: muhammadbintang, Password: (kosong)"
echo ""
echo "4. Jika berhasil connect, buka SQL Editor"
echo "5. Copy-paste isi file database.sql dan Execute"
echo ""
echo "=== CARA 3: Buat Database Manual di DBeaver ==="
echo ""
echo "Jika MySQL sudah connect (dengan user apapun):"
echo ""
echo "1. Klik kanan di Database Navigator → SQL Editor → New SQL Script"
echo "2. Jalankan query ini satu per satu:"
echo ""
cat << 'SQL'
-- Buat user rahel1
CREATE USER IF NOT EXISTS 'rahel1'@'localhost' IDENTIFIED BY 'rahel@123';

-- Buat database
CREATE DATABASE IF NOT EXISTS ecommerce;

-- Berikan akses
GRANT ALL PRIVILEGES ON ecommerce.* TO 'rahel1'@'localhost';
FLUSH PRIVILEGES;

-- Pakai database ecommerce
USE ecommerce;

-- Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  items TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Menunggu',
  time DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  description TEXT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, price, category, image_url, stock) VALUES
('T-Shirt', 120000, 'fashion', 'images/tshirt.jpg', 50),
('Jeans', 220000, 'fashion', 'images/jeans.jpg', 30),
('Sneakers', 350000, 'shoes', 'images/sneakers.jpg', 25),
('Dress', 180000, 'fashion', 'images/dress.jpg', 40),
('Short Pants', 100000, 'fashion', 'images/shortpants.jpg', 60),
('Hoodie', 200000, 'fashion', 'images/hoodie.jpg', 35),
('Cap', 80000, 'accessories', 'images/cap.jpg', 100);

-- Buat tabel admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admin_users (username, password, email) VALUES
('admin', '12345', 'admin@modernshop.com');
SQL

echo ""
echo "3. Setelah berhasil, update db.js dengan user yang berhasil connect"
echo ""
echo "=== CARA 4: Pakai SQLite (Tanpa MySQL) ==="
echo ""
echo "Jika MySQL terlalu ribet, aplikasi sudah support localStorage."
echo "Cukup buka index.html di browser, data akan tersimpan lokal."
echo ""
echo "================================"
echo "Pilih cara yang paling mudah untuk Anda!"
