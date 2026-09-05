<?php

namespace App\Support;

/**
 * Sumber kebenaran tunggal untuk seluruh master data CRM (tahapan pipeline,
 * sumber prospek, prioritas, status, dan jenis aktivitas).
 *
 * Dipakai bersama oleh controller, validasi, template import Excel, dan sheet
 * Referensi agar nilainya tidak pernah berbeda antara backend dan dokumen import.
 * Mengikuti pola App\Support\MenuRegistry yang sudah ada di aplikasi.
 */
class Crm
{
    /**
     * Tahapan pipeline penjualan secara berurutan (pendekatan konsultatif).
     * Dua tahap terakhir bersifat terminal (opportunity selesai).
     *
     * @return list<string>
     */
    public static function stages(): array
    {
        return [
            'Prospek Baru',
            'Pendekatan',
            'Pengenalan Produk',
            'Analisis Kebutuhan',
            'Kualifikasi',
            'Demo / Presentasi',
            'Rekomendasi Solusi',
            'Penawaran',
            'Negosiasi',
            'Persetujuan',
            'Berhasil',
            'Tidak Berhasil',
        ];
    }

    /** Tahapan berjalan (belum selesai). */
    public static function openStages(): array
    {
        return array_values(array_diff(self::stages(), self::terminalStages()));
    }

    /** Tahapan terminal — opportunity dianggap selesai. */
    public static function terminalStages(): array
    {
        return ['Berhasil', 'Tidak Berhasil'];
    }

    public static function stageWon(): string
    {
        return 'Berhasil';
    }

    public static function stageLost(): string
    {
        return 'Tidak Berhasil';
    }

    /** @return list<string> */
    public static function sources(): array
    {
        return [
            'Referral',
            'Website',
            'WhatsApp',
            'Instagram',
            'LinkedIn',
            'Event',
            'Cold Outreach',
            'Partnership',
            'Database Existing',
        ];
    }

    /** @return list<string> */
    public static function priorities(): array
    {
        return ['Rendah', 'Sedang', 'Tinggi'];
    }

    /** Status lifecycle prospek. */
    public static function statuses(): array
    {
        return ['Aktif', 'Berhasil', 'Tidak Berhasil', 'Dikonversi'];
    }

    /** @return list<string> */
    public static function activityTypes(): array
    {
        return [
            'Telepon',
            'WhatsApp',
            'Email',
            'Meeting',
            'Kunjungan',
            'Demo',
            'Presentasi',
            'Follow-up',
            'Tugas Lainnya',
        ];
    }

    /**
     * Daftar industri sebagai referensi pengisian — bukan tabel master di DB,
     * sehingga aman didefinisikan di sini (tidak menduplikasi data existing).
     *
     * @return list<string>
     */
    public static function industries(): array
    {
        return [
            'Retail',
            'F&B',
            'Manufaktur',
            'Pendidikan',
            'Kesehatan',
            'Properti',
            'Teknologi',
            'Jasa',
            'Pemerintahan',
            'Otomotif',
            'Logistik',
            'Lainnya',
        ];
    }

    /** @return list<string> */
    public static function companyTypes(): array
    {
        return ['PT', 'CV', 'UD', 'Perorangan', 'Instansi', 'Lainnya'];
    }

    /**
     * Kunci detail kebutuhan (disimpan sebagai JSON pada prospek).
     *
     * @return array<string, string>
     */
    public static function needFields(): array
    {
        return [
            'masalah' => 'Masalah yang dihadapi',
            'sistem_existing' => 'Sistem existing',
            'kebutuhan_utama' => 'Kebutuhan utama',
            'kebutuhan_tambahan' => 'Kebutuhan tambahan',
            'jumlah_pengguna' => 'Jumlah pengguna',
            'jumlah_karyawan' => 'Jumlah karyawan',
            'jumlah_lokasi' => 'Jumlah lokasi',
            'sistem_shift' => 'Sistem shift',
            'integrasi' => 'Integrasi yang dibutuhkan',
            'target_implementasi' => 'Target implementasi',
            'catatan' => 'Catatan kebutuhan',
        ];
    }
}
