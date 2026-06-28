# Dexa WFH - Backend API

Backend API untuk aplikasi absensi _Work From Home_ (WFH) yang dibangun menggunakan **NestJS** dan **MySQL**.

Aplikasi ini digunakan bersama dengan projek [Dexa Web](https://github.com/tiara97/dexa-web).

## 💻 Cara Instalasi

1. **Clone & Install Dependensi**

   ```bash
   git clone https://github.com/tiara97/dexa-backend.git
   cd dexa-backend
   npm install
   ```

2. **Setup Database**
   - Buat database MySQL baru (misal: `dexa_db`).
   - Eksekusi file `schema.sql` ke dalam database tersebut untuk membuat struktur tabel dan mengisi data _dummy_.

3. **Konfigurasi Environment**
   - Sesuaikan file `.env` dengan koneksi database lokal kamu. Contoh:
     ```env
     PORT=5000
     DB_HOST=your_db_portlocalhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=dexa_db
     JWT_SECRET=rahasia
     CLOCK_IN_TIME_LIMIT=9 [Optional]
     ```

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   _Server akan berjalan di port `5000`._

---

## 🚀 Cara Pemakaian & Fitur Tiap Halaman

Backend ini menyediakan REST API untuk melayani fungsi-fungsi di Frontend (_dexa-web_). Berikut adalah pemetaan fitur berdasarkan halamannya:

### 1. Halaman Login

- **Fitur**: Memvalidasi NIP dan Password pengguna.
- **Proses**: Jika berhasil, server akan menerbitkan **JWT Token** beserta hak akses (_role_ Admin atau Employee) untuk otorisasi sesi pengguna.

### 2. Halaman Absensi (Karyawan)

- **Fitur**: Mencatat kehadiran karyawan beserta foto bukti WFH.
- **Proses**: Menerima unggahan foto (_multipart/form-data_). Server akan mengecek waktu _check-in_ (untuk menentukan status _In Time_ atau _Late_), menyimpan foto ke folder `uploads/`, dan menolak jika karyawan sudah absen di hari yang sama.

### 3. Halaman Master Data (Admin)

- **Fitur**: Mengelola seluruh data akun karyawan.
- **Proses**: Menyediakan operasi CRUD (Tambah, Edit, Hapus data). Didukung dengan fitur _Pagination_ dan _Search_ (pencarian nama) secara efisien agar data ringan saat dimuat.

### 4. Halaman Monitoring (Admin)

- **Fitur**: Memantau rekam jejak absensi seluruh karyawan.
- **Proses**: Menyediakan data riwayat absensi secara lengkap (termasuk akses link foto bukti absensi). Didukung fitur _Filter_ (berdasarkan tanggal & status) serta _Pagination_ otomatis.

---

## 🔑 Akun Dummy (Siap Pakai)

- **Admin** 👉 NIP: `10001` | Password: `admin123`
- **Employee** 👉 NIP: `10002` s/d `10011` | Password: `password`
