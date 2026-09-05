<?php

namespace App\Exports;

use App\Models\User;
use App\Support\Crm;
use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

/**
 * Template Excel resmi untuk import prospek. Tiga sheet: data, petunjuk
 * pengisian, dan referensi (master data diambil dari DB bila memungkinkan,
 * mis. daftar Sales berasal dari tabel users).
 */
class ProspectTemplateExport implements Export, WithMultipleSheets
{
    /** Kolom template — harus sama persis dengan yang dibaca ProspectImportService. */
    public const COLUMNS = [
        'nama_perusahaan',
        'nama_brand',
        'jenis_perusahaan',
        'industri',
        'alamat',
        'kota',
        'provinsi',
        'negara',
        'website',
        'email_perusahaan',
        'telepon_perusahaan',
        'whatsapp_perusahaan',
        'nama_pic',
        'jabatan_pic',
        'email_pic',
        'telepon_pic',
        'whatsapp_pic',
        'linkedin_pic',
        'sumber_prospek',
        'sales_pic',
        'prioritas',
        'produk_diminati',
        'catatan',
    ];

    /**
     * @return array<int, object>
     */
    public function sheets(): array
    {
        return [
            $this->prospekSheet(),
            $this->petunjukSheet(),
            $this->referensiSheet(),
        ];
    }

    private function prospekSheet(): object
    {
        return new class implements FromArray, WithHeadings, WithTitle
        {
            public function title(): string
            {
                return 'Prospek';
            }

            public function headings(): array
            {
                return ProspectTemplateExport::COLUMNS;
            }

            public function array(): array
            {
                // Satu baris contoh agar format terlihat; hapus sebelum import.
                return [[
                    'PT Contoh Sejahtera', 'Contoh', 'PT', 'Retail', 'Jl. Contoh No. 1',
                    'Jakarta', 'DKI Jakarta', 'Indonesia', 'https://contoh.co.id',
                    'info@contoh.co.id', '0211234567', '6281234567890',
                    'Budi Santoso', 'Manager IT', 'budi@contoh.co.id', '0217654321', '6289876543210',
                    'linkedin.com/in/budi', 'Website', 'Nama Sales', 'Sedang',
                    'Aplikasi POS', 'Tertarik demo bulan depan',
                ]];
            }
        };
    }

    private function petunjukSheet(): object
    {
        return new class implements FromArray, WithHeadings, WithTitle
        {
            public function title(): string
            {
                return 'Petunjuk Pengisian';
            }

            public function headings(): array
            {
                return ['Kolom', 'Fungsi', 'Wajib/Opsional', 'Format', 'Contoh', 'Aturan Validasi'];
            }

            public function array(): array
            {
                return [
                    ['nama_perusahaan', 'Nama resmi perusahaan prospek', 'Wajib', 'Teks', 'PT Contoh Sejahtera', 'Tidak boleh kosong'],
                    ['nama_brand', 'Merek/nama dagang', 'Opsional', 'Teks', 'Contoh', '-'],
                    ['jenis_perusahaan', 'Bentuk badan usaha', 'Opsional', 'Teks', 'PT / CV / UD', 'Lihat sheet Referensi'],
                    ['industri', 'Sektor industri', 'Opsional', 'Teks', 'Retail', 'Lihat sheet Referensi'],
                    ['alamat', 'Alamat lengkap', 'Opsional', 'Teks', 'Jl. Contoh No. 1', '-'],
                    ['kota', 'Kota', 'Opsional', 'Teks', 'Jakarta', 'Dipakai untuk deteksi duplikat'],
                    ['provinsi', 'Provinsi', 'Opsional', 'Teks', 'DKI Jakarta', '-'],
                    ['negara', 'Negara', 'Opsional', 'Teks', 'Indonesia', 'Default Indonesia'],
                    ['website', 'Website perusahaan', 'Opsional', 'URL', 'https://contoh.co.id', '-'],
                    ['email_perusahaan', 'Email umum perusahaan', 'Opsional', 'Email', 'info@contoh.co.id', 'Harus format email'],
                    ['telepon_perusahaan', 'Telepon perusahaan', 'Opsional', 'Angka/Teks', '0211234567', 'Deteksi duplikat'],
                    ['whatsapp_perusahaan', 'WhatsApp perusahaan', 'Opsional', 'Angka', '6281234567890', 'Format 62xxxx'],
                    ['nama_pic', 'Nama kontak (PIC)', 'Opsional', 'Teks', 'Budi Santoso', '-'],
                    ['jabatan_pic', 'Jabatan PIC', 'Opsional', 'Teks', 'Manager IT', '-'],
                    ['email_pic', 'Email PIC', 'Opsional', 'Email', 'budi@contoh.co.id', 'Harus format email'],
                    ['telepon_pic', 'Telepon PIC', 'Opsional', 'Angka/Teks', '0217654321', '-'],
                    ['whatsapp_pic', 'WhatsApp PIC', 'Opsional', 'Angka', '6289876543210', 'Format 62xxxx'],
                    ['linkedin_pic', 'Profil LinkedIn PIC', 'Opsional', 'URL', 'linkedin.com/in/budi', '-'],
                    ['sumber_prospek', 'Asal prospek', 'Opsional', 'Teks', 'Website', 'Lihat sheet Referensi'],
                    ['sales_pic', 'Sales penanggung jawab', 'Opsional', 'Teks', 'Nama Sales', 'Harus nama/email user existing'],
                    ['prioritas', 'Tingkat prioritas', 'Opsional', 'Teks', 'Sedang', 'Rendah/Sedang/Tinggi'],
                    ['produk_diminati', 'Produk/layanan yang diminati', 'Opsional', 'Teks', 'Aplikasi POS', '-'],
                    ['catatan', 'Catatan tambahan', 'Opsional', 'Teks', 'Tertarik demo', '-'],
                ];
            }
        };
    }

    private function referensiSheet(): object
    {
        $sales = User::orderBy('name')->pluck('name')->all();

        return new class($sales) implements FromArray, WithHeadings, WithTitle
        {
            /** @param list<string> $sales */
            public function __construct(private array $sales) {}

            public function title(): string
            {
                return 'Referensi';
            }

            public function headings(): array
            {
                return ['Industri', 'Sumber Prospek', 'Prioritas', 'Tahap Pipeline', 'Sales (User Existing)'];
            }

            public function array(): array
            {
                $industries = Crm::industries();
                $sources = Crm::sources();
                $priorities = Crm::priorities();
                $stages = Crm::stages();
                $sales = $this->sales;

                $max = max(count($industries), count($sources), count($priorities), count($stages), count($sales));
                $rows = [];

                for ($i = 0; $i < $max; $i++) {
                    $rows[] = [
                        $industries[$i] ?? '',
                        $sources[$i] ?? '',
                        $priorities[$i] ?? '',
                        $stages[$i] ?? '',
                        $sales[$i] ?? '',
                    ];
                }

                return $rows;
            }
        };
    }
}
