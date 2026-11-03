# Social Sharing & Link Preview Berita

## Cara kerja

- Metadata Open Graph, Twitter/X Card, canonical, dan JSON-LD (`NewsArticle` / `BlogPosting`) dirender **di server** oleh `resources/views/partials/share-meta.blade.php` pada HTML awal `/berita/{slug}`. Crawler tidak perlu menjalankan JavaScript.
- Sumber data: `App\Services\News\NewsShareMeta`.
  - `og:title` = SEO Title → judul artikel.
  - `og:description` = Meta Description → Excerpt → 160 karakter pertama isi artikel.
  - `og:image` = thumbnail 1200 × 630 JPEG (dibuat otomatis saat upload) → featured image asli → `public/images/og-default.jpg`.
  - `og:url` / canonical = `APP_URL` + `/berita/{slug}`.
- Hanya artikel **Published** yang bisa diakses (Draft → 404, termasuk `/story.jpg`).
- Slug dikunci setelah artikel pernah dipublikasikan agar link yang sudah tersebar tidak rusak.
- Schema `BlogPosting` dipakai bila kategori mengandung kata artikel/blog/tips/insight/tutorial/opini; selain itu `NewsArticle`.

## Konfigurasi produksi

| Variabel | Keterangan |
| --- | --- |
| `APP_URL=https://ctechcreative.com` | Wajib https dan domain final; menjadi dasar canonical & URL gambar absolut. |
| `TWITTER_SITE=@akunresmi` | Opsional, mengisi `twitter:site`. |

Setelah deploy:

```bash
php artisan migrate --force
php artisan storage:link
php artisan news:social-images
```

`news:social-images` membuat thumbnail 1200 × 630 untuk berita lama (`--force` untuk membuat ulang semua).

## Story image

- Admin dapat mengunggah Story Image portrait (rekomendasi 1080 × 1920) terpisah dari featured image.
- Bila kosong, `/berita/{slug}/story.jpg` membuat otomatis gambar 1080 × 1920 berisi featured image, kategori, judul, logo CTECH, dan URL artikel.
- Tombol **Story Image** di halaman berita memakai Web Share API (file) di HP agar bisa langsung dibagikan ke Story; di desktop gambar diunduh.
- Catatan: Open Graph tidak menghasilkan Story. Story selalu memakai aset portrait ini.

## Validasi di panel admin

Menu Berita → ⋮ → **Preview Sosial Media** menampilkan preview WhatsApp/Telegram, Facebook, LinkedIn, X dan checklist: status Published, featured image, thumbnail 1200 × 630, SEO title, meta description, canonical URL, Open Graph, dan akses publik gambar (HTTP HEAD, harus 200 + `image/*`).

Di lingkungan lokal pemeriksaan akses gambar bisa berstatus peringatan karena server tidak dapat memanggil dirinya sendiri; ini normal.

## Pengujian dengan tool eksternal

Gunakan URL artikel yang **sudah Published di domain produksi** (localhost tidak bisa diakses crawler).

1. **Facebook Sharing Debugger** — https://developers.facebook.com/tools/debug/
   Tempel URL → *Debug*. Pastikan tidak ada peringatan `og:image` dan gambar 1200 × 630 tampil. Klik *Scrape Again* setelah mengubah artikel (Facebook & WhatsApp meng-cache preview).
2. **LinkedIn Post Inspector** — https://www.linkedin.com/post-inspector/
   Tempel URL → *Inspect*. Periksa Title, Image, Description; inspeksi ulang juga menyegarkan cache LinkedIn.
3. **OpenGraph.xyz** — https://www.opengraph.xyz/
   Pratinjau gabungan Facebook, X, LinkedIn, WhatsApp, dan daftar tag yang terbaca.
4. **WhatsApp / Telegram** — kirim URL ke chat sendiri. Preview yang sudah ter-cache tidak berubah; tambahkan query unik (mis. `?v=2`) untuk tes ulang, canonical tetap tanpa query.
5. **Schema** — https://validator.schema.org/ atau Google Rich Results Test untuk JSON-LD.
6. **Cek HTML awal tanpa JavaScript**:

```bash
curl -s -A "facebookexternalhit/1.1" https://ctechcreative.com/berita/<slug> | grep -E 'og:|twitter:|canonical|ld\+json'
```

```bash
curl -sI https://ctechcreative.com/storage/news-images/social/<file>.jpg
```

Yang kedua harus `HTTP 200` dan `Content-Type: image/jpeg`.

## Tes otomatis

```bash
php artisan test --compact tests/Feature/NewsSocialSharingTest.php
```
