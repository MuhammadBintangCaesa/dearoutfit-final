# DearOutfit - ModernShop E-commerce

E-commerce website untuk fashion, sepatu, dan aksesoris - Kelompok 5

## Struktur Proyek

```
dearoutiftt/
├── index.html          # Halaman utama
├── login.html          # Halaman login admin
├── dashboard.html      # Dashboard admin
├── index.js            # JavaScript untuk halaman utama
├── login.js            # JavaScript untuk login
├── dashboard.js        # JavaScript untuk dashboard
├── db.js              # Konfigurasi database
├── server.js          # Backend server (opsional)
├── package.json       # Dependencies Node.js
├── database.sql       # Schema database MySQL
├── images/            # Folder untuk gambar produk
│   ├── logo1.jpg
│   ├── main1.jpg
│   ├── tshirt.jpg
│   ├── jeans.jpg
│   ├── sneakers.jpg
│   ├── dress.jpg
│   ├── shortpants.jpg
│   ├── hoodie.jpg
│   └── cap.jpg
└── README.md          # File ini
```

## Cara Menggunakan

### Mode 1: Tanpa Backend (Hanya Frontend + LocalStorage)
Langsung buka `index.html` di browser. Data pesanan akan disimpan di localStorage browser.

### Mode 2: Dengan Backend (Node.js + MySQL)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   - Install MySQL
   - Jalankan script `database.sql` di MySQL:
     ```bash
     mysql -u root -p < database.sql
     ```
   - Atau buka MySQL Workbench dan jalankan isi file `database.sql`

3. **Konfigurasi Database:**
   Edit file `db.js` dan sesuaikan:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'password_anda', // Ganti dengan password MySQL
     database: 'ecommerce'
   });
   ```

4. **Jalankan Server:**
   ```bash
   npm start
   ```
   Atau untuk development dengan auto-reload:
   ```bash
   npm run dev
   ```

5. **Buka Browser:**
   ```
   http://localhost:3000
   ```

## Fitur

### Halaman Utama (index.html)
- Katalog produk dengan filter kategori (Fashion, Sepatu, Aksesoris)
- Keranjang belanja
- Sistem checkout dengan pilihan pembayaran (Transfer/QRIS)
- Login admin

### Dashboard Admin (dashboard.html)
- Lihat semua pesanan
- Verifikasi pembayaran
- Tandai pesanan selesai
- Clear pesanan yang sudah lunas

### Login Admin
- Username: `admin`
- Password: `12345`

## Gambar yang Dibutuhkan

Letakkan gambar-gambar berikut di folder `images/`:

1. **logo1.jpg** - Logo website
2. **main1.jpg** - Gambar untuk pembayaran
3. **tshirt.jpg** - Gambar produk T-Shirt
4. **jeans.jpg** - Gambar produk Jeans
5. **sneakers.jpg** - Gambar produk Sneakers
6. **dress.jpg** - Gambar produk Dress
7. **shortpants.jpg** - Gambar produk Short Pants
8. **hoodie.jpg** - Gambar produk Hoodie
9. **cap.jpg** - Gambar produk Cap

## Teknologi yang Digunakan

- **Frontend:**
  - HTML5
  - CSS3 (Bootstrap 5.3.2)
  - JavaScript (Vanilla JS)
  - Animate.css

- **Backend (Opsional):**
  - Node.js
  - Express.js
  - MySQL

## Catatan

- Untuk production, sebaiknya gunakan autentikasi yang lebih aman (hash password)
- Tambahkan validasi input yang lebih ketat
- Implementasi payment gateway yang sesungguhnya
- Gunakan HTTPS untuk keamanan

## Kelompok 5 - 2025
# dearoutfit-final
