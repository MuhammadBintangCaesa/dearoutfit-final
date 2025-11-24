-- Database Schema untuk E-commerce ModernShop
-- Jalankan script ini di MySQL untuk membuat database dan tabel

-- Buat user rahel1 (jika belum ada)
CREATE USER IF NOT EXISTS 'rahel1'@'localhost' IDENTIFIED BY 'rahel@123';

-- Buat database
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Berikan akses penuh ke user rahel1
GRANT ALL PRIVILEGES ON ecommerce.* TO 'rahel1'@'localhost';
FLUSH PRIVILEGES;

-- Tabel untuk orders
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

-- Tabel untuk products (opsional - jika ingin menyimpan produk di database)
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

-- Tabel untuk admin users (opsional - untuk autentikasi yang lebih aman)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: 12345 - sebaiknya di-hash di production)
INSERT INTO admin_users (username, password, email) VALUES
('admin', '12345', 'admin@modernshop.com');
