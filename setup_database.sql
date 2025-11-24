-- Database Setup untuk DearOutfit E-commerce
-- Jalankan di DBeaver dengan user rahel1

-- Buat database
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Tabel orders untuk menyimpan pesanan
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  items TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Menunggu',
  time DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel products untuk menyimpan data produk
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  description TEXT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data produk
INSERT INTO products (name, price, category, image_url, stock, description) VALUES
('T-Shirt', 120000, 'fashion', 'images/tshirt.jpg', 50, 'T-Shirt casual berkualitas tinggi'),
('Jeans', 220000, 'fashion', 'images/jeans.jpg', 30, 'Jeans denim premium fit'),
('Sneakers', 350000, 'shoes', 'images/sneakers.jpg', 25, 'Sneakers sporty dan nyaman'),
('Dress', 180000, 'fashion', 'images/dress.jpg', 40, 'Dress casual elegant'),
('Short Pants', 100000, 'fashion', 'images/shortpants.jpg', 60, 'Celana pendek santai'),
('Hoodie', 200000, 'fashion', 'images/hoodie.jpg', 35, 'Hoodie hangat dan stylish'),
('Cap', 80000, 'accessories', 'images/cap.jpg', 100, 'Topi casual trendy');

-- Tabel admin_users untuk autentikasi admin
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert admin default
INSERT INTO admin_users (username, password, email) VALUES
('admin', '12345', 'admin@modernshop.com');

-- Tampilkan summary
SELECT 'Database ecommerce berhasil dibuat!' as Status;
SELECT COUNT(*) as Total_Products FROM products;
SELECT COUNT(*) as Total_Orders FROM orders;
SELECT COUNT(*) as Total_Admins FROM admin_users;
