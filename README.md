# DearOutfit - ModernShop E-commerce

E-commerce website untuk fashion, sepatu, dan aksesoris 

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
├── setup_database.sql # Setup database untuk lab (satu-satunya file SQL)
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

### Flow sesuai use case

User: daftar/login → pilih barang → keranjang → checkout → pilih QRIS/transfer → riwayat transaksi.

Admin: login → lihat semua pesanan → verifikasi pembayaran → tandai selesai atau hapus pesanan → logout.

### Mode 1: Tanpa Backend (Hanya Frontend + LocalStorage)
Langsung buka `index.html` di browser. Data pesanan akan disimpan di localStorage browser.

### Mode 2: Dengan Backend (Node.js + MySQL)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   - Install MySQL
   - Jalankan script `setup_database.sql` di MySQL sebagai user root/admin:
   ```bash
     mysql -u root -p < setup_database.sql
     ```
   - Atau buka DBeaver dan jalankan seluruh isi `setup_database.sql`

3. **Konfigurasi Database:**
   Jangan tulis password langsung di `db.js`. Jalankan server dengan konfigurasi MySQL lab:
   ```javascript
   DB_HOST=localhost DB_USER=root DB_PASSWORD=password_mysql DB_NAME=ecommerce npm start
   ```
   Pada Windows PowerShell gunakan:
   ```powershell
   $env:DB_HOST='localhost'; $env:DB_USER='root'; $env:DB_PASSWORD='password_mysql'; $env:DB_NAME='ecommerce'; npm start
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
- Daftar dan login user
- Keranjang belanja
- Sistem checkout dengan pilihan pembayaran (Transfer/QRIS)
- Riwayat transaksi berdasarkan akun user

### Dashboard Admin (dashboard.html)
- Lihat semua pesanan
- Verifikasi pembayaran
- Tandai pesanan selesai
- Clear pesanan yang sudah lunas

### Login Admin
- Username: `admin`
- Password: `12345`

## Menjalankan di Lab

1. Salin seluruh folder project ke komputer lab, lalu buka Terminal/PowerShell di folder tersebut.
2. Pastikan Node.js dan MySQL sudah terpasang; cek dengan `node -v` dan `mysql --version`.
3. Import database baru dengan `mysql -u root -p < setup_database.sql`.
4. Jalankan `npm install`, lalu jalankan perintah konfigurasi database pada langkah 3 Mode Backend di atas.
5. Buka `http://localhost:3000`. Buat akun user lewat tombol **Login User**; admin bawaan adalah `admin` / `12345`.

### Cara memastikan akun user masuk ke MySQL

Jalankan perintah ini di aplikasi **Terminal** (macOS) atau **PowerShell** (Windows), bukan di DBeaver dan bukan di browser. Pastikan lokasinya sudah berada di folder `dearoutiftt`.

```bash
DB_HOST=localhost DB_USER=bintangc DB_PASSWORD=password_mysql_kamu DB_NAME=ecommerce npm start
```

Jika terminal menampilkan `Connected to MySQL database`, buka `http://localhost:3000`, daftar akun user, lalu tekan **Refresh** pada tabel `customers` di DBeaver. Jika muncul `Access denied`, username atau password pada perintah tersebut belum sama dengan koneksi MySQL di DBeaver.

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
