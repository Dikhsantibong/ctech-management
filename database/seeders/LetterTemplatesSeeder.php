<?php

namespace Database\Seeders;

use App\Models\Letter;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class LetterTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            // If no user exists, abort seeding templates.
            $this->command->warn('No users found — skipping letter templates seeding.');
            return;
        }

        $templates = [
            'Surat Keputusan' => [
                'subject' => 'Keputusan tentang [isi perihal]',
                'content' => "DENGAN RAHMAT TUHAN YANG MAHA ESA\n\nDIREKTUR UTAMA\n\nTelah mempertimbangkan:\nBahwa dalam rangka [alasan/tujuan], perlu ditetapkan Surat Keputusan ini.\n\nMEMUTUSKAN:\n\nKesatu  : [Keputusan utama yang diambil]\nKedua   : [Ketentuan tambahan jika ada]\nKetiga  : [Ketentuan lainnya]\n\nKeputusan ini berlaku sejak tanggal ditetapkan.\n\n[Tempat], [Tanggal]\n\n[Nama Direktur]\n[Jabatan]",
            ],
            'Surat Tugas' => [
                'subject' => 'Surat Tugas untuk [nama/tujuan]',
                'content' => "Dasar:\n1. [Peraturan/Perundangan yang menjadi dasar]\n2. [Ketentuan atau keputusan terkait]\n\nKami perintahkan kepada:\nNama            : [Nama Pegawai]\nJabatan         : [Jabatan]\nTanggal Lahir   : [Tanggal Lahir]\nNIP             : [NIP]\\n\nUntuk melaksanakan tugas sebagai berikut:\n[Uraian tugas yang harus dilaksanakan]\n\nWaktu pelaksanaan: [Mulai tanggal] s.d. [Tanggal selesai]\nTempat pelaksanaan: [Lokasi]\n\nBiaya operasional ditanggung oleh [Sumber pembiayaan]\n\nDemikian Surat Tugas ini diberikan untuk dijalankan dengan sebaik-baiknya.\n\n[Tempat], [Tanggal]\n\n[Nama Pemberi Tugas]\n[Jabatan]",
            ],
            'Surat Keterangan' => [
                'subject' => 'Keterangan tentang [isi perihal]',
                'content' => "Yang bertanda tangan di bawah ini:\n\nNama            : [Nama Pemberi Keterangan]\nJabatan         : [Jabatan]\nInstansi/Perusahaan : [Nama Instansi/Perusahaan]\n\nDengan ini menerangkan bahwa:\n\nNama            : [Nama Penerima Keterangan]\n[Identitas lainnya]: [Data]\n\nTelah [uraian keadaan/keterangan yang diberikan]\n\nKeterangan ini diberikan untuk keperluan [tujuan penggunaan].\n\nDemikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipertanggungjawabkan.\n\n[Tempat], [Tanggal]\n\n[Nama Pemberi Keterangan]\n[Jabatan]",
            ],
            'Surat Penawaran' => [
                'subject' => 'Penawaran Produk/Layanan [nama produk/layanan]',
                'content' => "Kepada Yth.\n[Nama Penerima]\n[Perusahaan/Institusi]\n[Alamat]\n\nAssalamu'alaikum Wr. Wb.\n\nDengan hormat,\n\nKami dengan ini menawarkan produk/layanan kami sebagai berikut:\n\n1. Deskripsi Produk/Layanan:\n   [Jelaskan produk/layanan secara detail]\n\n2. Spesifikasi/Fitur:\n   [Sebutkan spesifikasi dan fitur utama]\n\n3. Harga:\n   [Rincian harga]\n\n4. Syarat Pembayaran:\n   [Metode dan syarat pembayaran]\n\n5. Waktu Pengiriman:\n   [Estimasi pengiriman]\n\nPenawaran ini berlaku hingga [tanggal berlaku].\n\nKami siap memberikan demonstrasi dan informasi lebih lanjut sesuai kebutuhan Anda.\n\nDemikian penawaran ini kami sampaikan. Atas perhatian dan pertimbangan Anda, kami ucapkan terima kasih.\n\nWassalamu'alaikum Wr. Wb.\n\n[Tempat], [Tanggal]\n\n[Nama Penanda Tangan]\n[Jabatan]",
            ],
            // additional templates
            'Surat Undangan' => [
                'subject' => 'Undangan [Acara] kepada [Nama Penerima]',
                'content' => "Kepada Yth.\n[Nama Penerima]\n[Jabatan]\n[Organisasi]\n\nDengan hormat,\n\nSehubungan dengan akan diselenggarakannya [Acara] pada:\nHari/Tanggal : [Hari, Tanggal]\nWaktu         : [Jam]\nTempat        : [Lokasi]\n\nKami mengundang Saudara/i untuk hadir dan berpartisipasi dalam acara tersebut.\n\nDemikian undangan ini kami sampaikan. Atas perhatian dan kehadiran Saudara/i, kami ucapkan terima kasih.\n\n[Tempat], [Tanggal]\n\n[Nama]\n[Jabatan]",
            ],
            'Surat Izin' => [
                'subject' => 'Permohonan Izin [keperluan] kepada [penerima]',
                'content' => "Yang bertanda tangan di bawah ini:\n\nNama    : [Nama Pemohon]\nJabatan : [Jabatan]\nInstansi: [Instansi]\n\nDengan ini mengajukan permohonan izin untuk [uraian izin] pada:\nHari/Tanggal: [Tanggal]\nWaktu       : [Jam]\nAlasan      : [Alasan izin]\n\nDemikian permohonan ini kami sampaikan. Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.\n\n[Tempat], [Tanggal]\n\n[Nama Pemohon]\n[Jabatan]",
            ],
            'Surat Keterangan Kerja' => [
                'subject' => 'Keterangan Kerja untuk [nama karyawan]',
                'content' => "Yang bertanda tangan di bawah ini menerangkan bahwa:\n\nNama    : [Nama Karyawan]\nJabatan : [Jabatan]\nNIP     : [NIP]\nPerusahaan/Instansi: [Nama Perusahaan]\n\nAdalah benar-benar bekerja pada perusahaan kami sejak [tanggal masuk] sampai dengan [tanggal selesai/present]. Surat keterangan ini dibuat untuk keperluan [tujuan].\n\nDemikian surat keterangan ini dibuat agar dapat dipergunakan sebagaimana mestinya.\n\n[Tempat], [Tanggal]\n\n[Nama Pemberi Keterangan]\n[Jabatan]",
            ],
            'Surat Pengantar' => [
                'subject' => 'Surat Pengantar [perihal] kepada [penerima]',
                'content' => "Dengan hormat,\n\nBersama surat ini kami sampaikan [dokumen/barang] kepada:\n\nNama Penerima : [Nama]\nAlamat         : [Alamat]\n\nMohon untuk diterima dan diproses sesuai dengan ketentuan yang berlaku.\n\nDemikian surat pengantar ini kami buat. Terima kasih.\n\n[Tempat], [Tanggal]\n\n[Nama Pengirim]\n[Jabatan]",
            ],
            'Surat Pemberitahuan' => [
                'subject' => 'Pemberitahuan tentang [isi pemberitahuan]',
                'content' => "Kepada Yth.\n[Pihak Terkait]\n\nDengan hormat,\n\nSehubungan dengan [uraian singkat], kami memberitahukan bahwa [isi pemberitahuan].\n\nDemikian pemberitahuan ini kami sampaikan untuk diketahui.\n\n[Tempat], [Tanggal]\n\n[Nama]\n[Jabatan]",
            ],
            'Surat Rekomendasi' => [
                'subject' => 'Surat Rekomendasi untuk [nama]',
                'content' => "Yang bertanda tangan di bawah ini memberikan rekomendasi kepada:\n\nNama    : [Nama]\nKeterangan singkat mengenai kemampuan/kelayakan yang direkomendasikan.\n\nRekomendasi ini diberikan untuk keperluan [tujuan].\n\n[Tempat], [Tanggal]\n\n[Nama Pemberi Rekomendasi]\n[Jabatan]",
            ],
            'Surat Permohonan' => [
                'subject' => 'Permohonan [jenis permohonan] kepada [penerima]',
                'content' => "Dengan hormat,\n\nKami bermaksud mengajukan permohonan [uraian permohonan] kepada [penerima] dengan rincian sebagai berikut:\n\n[Rincian permohonan]\n\nDemikian permohonan ini kami sampaikan. Atas perhatian dan kebijaksanaan Saudara, kami ucapkan terima kasih.\n\n[Tempat], [Tanggal]\n\n[Nama Pemohon]\n[Jabatan]",
            ],
            'Surat Kontrak' => [
                'subject' => 'Surat Perjanjian / Kontrak antara [pihak A] dan [pihak B]',
                'content' => "Pada hari ini [Hari, Tanggal], yang bertanda tangan di bawah ini:\n\nPihak Pertama  : [Nama / Perusahaan A]\nPihak Kedua    : [Nama / Perusahaan B]\n\nKedua belah pihak sepakat untuk mengadakan perjanjian dengan ketentuan sebagai berikut:\n1. [Ruang lingkup kerja]\n2. [Harga dan pembayaran]\n3. [Jangka waktu]\n4. [Ketentuan lain]\n\nDemikian perjanjian ini dibuat dalam rangkap 2 dan mempunyai kekuatan hukum yang sama.\n\n[Tempat], [Tanggal]\n\n[Nama Pihak Pertama]\n[Nama Pihak Kedua]",
            ],
        ];

        foreach ($templates as $type => $tpl) {
            // skip if already exists
            if (Letter::where('type', $type)->exists()) {
                continue;
            }

            $count = Letter::whereYear('created_at', Carbon::now()->year)->count() + 1;
            $ref = str_pad($count, 3, '0', STR_PAD_LEFT) . '/CT/' . strtoupper(substr(preg_replace('/[^A-Z]/i', '', $type), 0, 2)) . '/' . Carbon::now()->year;

            Letter::create([
                'reference_number' => $ref,
                'type' => $type,
                'letter_date' => Carbon::now()->toDateString(),
                'sifat' => 'Biasa',
                'recipient' => '-',
                'subject' => $tpl['subject'],
                'content' => $tpl['content'],
                'status' => 'Draft',
                'created_by' => $user->id,
            ]);
        }
    }
}
