# Posting Otomatis ke Media Sosial

Panduan mengaktifkan pengiriman konten dari **Content Planning** ke Instagram, Facebook, TikTok, dan LinkedIn.

---

## Cara kerja singkat

1. Buat konten di **Content Planning**, unggah gambar/video, nyalakan **Posting otomatis**, pilih platform tujuan.
2. Saat status konten diubah menjadi **Tayang**, sistem mengantrekan satu pekerjaan per platform.
3. Pekerjaan dijalankan di latar belakang, lengkap dengan percobaan ulang bila gagal sementara.
4. Hasil tiap platform tercatat di halaman **Akun Media Sosial → Riwayat Pengiriman** dan sebagai label di kartu konten.

Pengiriman **tidak** terjadi saat menyunting konten yang statusnya sudah Tayang, sehingga revisi caption tidak memposting ulang.

---

## Dua sakelar pengaman

Keduanya diatur di file `.env`:

```
SOCIAL_PUBLISHING_ENABLED=true    # false = fitur mati total
SOCIAL_PUBLISHING_SIMULATE=true   # true  = alur berjalan tapi tidak ada yang dikirim
```

Saat ini **mode simulasi menyala**. Seluruh alur bisa dicoba dengan aman: antrean, status, dan riwayat berjalan normal, tetapi tidak ada satu pun permintaan yang dikirim ke media sosial. Riwayat yang dihasilkan diberi label **Simulasi**.

Platform yang kredensialnya belum lengkap **selalu** disimulasikan, meski mode simulasi dimatikan. Jadi tidak akan pernah ada panggilan API yang sudah pasti gagal.

---

## Syarat wajib sebelum posting sungguhan

### 1. Antrean harus berjalan

Posting dijalankan di latar belakang. Di server produksi, jalankan salah satu:

```bash
php artisan queue:work --tries=3
```

Atau lewat Supervisor/systemd agar otomatis hidup kembali. Tanpa ini, konten hanya berstatus "Menunggu" dan tidak pernah terkirim.

### 2. Media harus bisa diakses publik

API media sosial mengunduh gambar/video dari URL kita. Karena itu:

- Unggah berkas lewat kolom **Gambar / Video** di form konten (tersimpan di `storage/app/public`).
- Pastikan `php artisan storage:link` sudah dijalankan.
- Pastikan `APP_URL` di `.env` berisi domain publik (`https://ctechcreative.com`), bukan `localhost`.

Link Google Drive **tidak berfungsi** — Meta menolaknya karena bukan URL gambar langsung.

### 3. Aturan media per platform

| Platform | Media | Catatan |
|---|---|---|
| Facebook Page | Opsional | Tanpa gambar akan diposting sebagai status teks |
| Instagram | **Wajib** | Gambar atau video; video diperlakukan sebagai Reels |
| TikTok | **Wajib video** | Hanya menerima video |
| LinkedIn Page | Opsional | Gambar disertakan sebagai tautan artikel |

---

## Mendaftarkan aplikasi di tiap platform

### Instagram + Facebook (satu Meta App)

1. Buka [developers.facebook.com](https://developers.facebook.com) → **Create App** → tipe **Business**.
2. Selesaikan **Business Verification** pada Meta Business Suite.
3. Tambahkan produk **Facebook Login** dan **Instagram Graph API**.
4. Pastikan akun Instagram bertipe **Business/Creator** dan tertaut ke Halaman Facebook.
5. Ajukan **App Review** untuk izin:
   - `pages_manage_posts`, `pages_read_engagement` (Facebook)
   - `instagram_content_publish`, `instagram_basic` (Instagram)
6. Ambil **Page Access Token berumur panjang** dan **Instagram Business Account ID**.

Isi di halaman Akun Media Sosial:
- Facebook → `ID Halaman Facebook`, `Page Access Token`
- Instagram → `Instagram Business Account ID`, `Access Token` (dari app yang sama)

### TikTok

1. Daftar di [developers.tiktok.com](https://developers.tiktok.com) dan buat aplikasi.
2. Ajukan **Content Posting API** — memerlukan audit dan biasanya paling lama prosesnya.
3. Verifikasi kepemilikan domain tempat video di-host (domain sistem Anda).
4. Lakukan OAuth untuk mendapatkan `access_token` dan `open_id`.

### LinkedIn

1. Buat aplikasi di [linkedin.com/developers](https://www.linkedin.com/developers/).
2. Ajukan produk **Community Management API**.
3. Minta izin `w_organization_social`.
4. Catat **ID Organisasi** (angka pada URL halaman perusahaan) dan `access_token`.

---

## Mengaktifkan setelah kredensial siap

1. Buka **Akun Media Sosial** (menu grup Marketing).
2. Klik **Isi Kredensial** pada platform terkait, tempel nilainya, simpan.
   Nilai disimpan **terenkripsi** dan tidak pernah ditampilkan kembali maupun dikirim ke browser.
3. Nyalakan sakelar platform tersebut.
4. Uji dulu dengan satu konten saat mode simulasi masih menyala.
5. Bila hasilnya sesuai, ubah `SOCIAL_PUBLISHING_SIMULATE=false`, lalu jalankan:

```bash
php artisan config:clear
```

6. Coba satu konten sungguhan sebelum dipakai rutin.

---

## Bila terjadi kegagalan

- Pesan kesalahan dari platform tampil apa adanya di **Riwayat Pengiriman**.
- Kegagalan sementara (jaringan, server platform) diulang otomatis sampai 3 kali dengan jeda 1, 5, lalu 15 menit.
- Kegagalan permanen (token kedaluwarsa, izin kurang, caption melanggar aturan) **tidak** diulang — perbaiki dulu penyebabnya lalu kirim ulang lewat menu **Kirim ke media sosial** pada kartu konten.
- Kegagalan satu platform tidak memengaruhi platform lain, dan tidak pernah menggagalkan penyimpanan konten.

---

## Mematikan fitur

Ubah `SOCIAL_PUBLISHING_ENABLED=false` lalu `php artisan config:clear`. Menu pengaturan tetap ada, tetapi tidak ada pengiriman yang dilakukan dan halaman Content Planning kembali seperti sebelum fitur ini ada.
