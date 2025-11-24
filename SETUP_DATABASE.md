# 🗄️ Setup MySQL & DBeaver

## Informasi Koneksi Database

```
Host: localhost
Port: 3306
User: rahel1
Password: rahel@123
Database: ecommerce
```

---

## 📝 Cara Setup MySQL

### Opsi 1: Via Terminal (Recommended)

1. **Buka Terminal dan jalankan:**
   ```bash
   cd /Users/muhammadbintang/project/MiniProject/dearoutiftt
   mysql -u root -p < database.sql
   ```
   
2. **Masukkan password root MySQL Anda**

3. **Selesai! User `rahel1` dan database `ecommerce` sudah dibuat**

### Opsi 2: Via DBeaver

1. **Buka DBeaver**
2. **Klik kanan di area "Database Navigator" → New Database Connection**
3. **Pilih MySQL**
4. **Isi koneksi:**
   - Server Host: `localhost`
   - Port: `3306`
   - Database: (kosongkan dulu)
   - Username: `root`
   - Password: (password root MySQL Anda)
5. **Test Connection → OK**
6. **Buka SQL Editor dan jalankan file `database.sql`**

---

## 🔧 Setup DBeaver untuk User rahel1

Setelah database dibuat, buat koneksi baru:

1. **New Database Connection → MySQL**
2. **Main Tab:**
   - Server Host: `localhost`
   - Port: `3306`
   - Database: `ecommerce`
   - Username: `rahel1`
   - Password: `rahel@123`

3. **Test Connection**
   - Jika muncul dialog download driver, klik **Download**
   - Tunggu sampai driver terdownload
   - Klik **Test Connection** lagi
   - Jika berhasil akan muncul "Connected"

4. **Klik Finish**

---

## 🚀 Jalankan Server

Setelah database ready:

```bash
npm start
```

Server akan jalan di: **http://localhost:3000**

Cek console, harusnya muncul:
```
Server running on http://localhost:3000
Connected to MySQL database
```

---

## ✅ Troubleshooting

### Error: Access Denied

Jika dapat error `Access denied for user 'rahel1'@'localhost'`:

1. Login ke MySQL sebagai root:
   ```bash
   mysql -u root -p
   ```

2. Jalankan command berikut:
   ```sql
   CREATE USER IF NOT EXISTS 'rahel1'@'localhost' IDENTIFIED BY 'rahel@123';
   GRANT ALL PRIVILEGES ON ecommerce.* TO 'rahel1'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Error: Unknown Database

Pastikan database sudah dibuat:
```bash
mysql -u rahel1 -p
# password: rahel@123

SHOW DATABASES;
USE ecommerce;
SHOW TABLES;
```

---

## 📊 Struktur Database

Setelah setup, database `ecommerce` akan punya tabel:

- **orders** - Menyimpan pesanan
- **products** - Menyimpan data produk
- **admin_users** - Menyimpan data admin

---

## 🔍 Query Testing di DBeaver

Coba jalankan query ini untuk test:

```sql
-- Lihat semua pesanan
SELECT * FROM orders;

-- Lihat semua produk
SELECT * FROM products;

-- Hitung total pesanan
SELECT COUNT(*) as total_orders FROM orders;

-- Lihat pesanan dengan status tertentu
SELECT * FROM orders WHERE status = 'Menunggu';
```
