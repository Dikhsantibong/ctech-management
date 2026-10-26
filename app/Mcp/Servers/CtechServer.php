<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\DeleteDataTool;
use App\Mcp\Tools\DescribeActionTool;
use App\Mcp\Tools\ListActionsTool;
use App\Mcp\Tools\ReadDataTool;
use App\Mcp\Tools\WriteDataTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('CTECH Management')]
#[Version('2.1.0')]
#[Instructions(<<<'TXT'
Akses penuh (Full Access: Baca, Buat, Ubah, Hapus) ke seluruh sistem manajemen CTECH: dashboard, pengumuman, project (milestone, rapat, dokumen, revisi, feedback, canvas), tasks, work, daily report, kalender, klien, CRM (prospek, pipeline, aktivitas), penawaran/RAB, invoice & kwitansi, langganan aplikasi, content planning & media sosial, berita, portfolio, surat keluar/masuk, dokumen, file, KPI, log aktivitas, tim, hak akses menu, dan pengaturan perusahaan.
Catatan privasi: Modul Pesan (Chat pribadi antar pengguna) tidak dibuka dan tidak dapat dibaca melalui MCP.

Alur kerja:
1. Panggil daftar-aksi untuk melihat daftar modul dan aksi yang tersedia.
2. Baca data dengan baca-data. Untuk mencari id, gunakan aksi list modul terkait.
3. Untuk menambah atau mengubah data, jalankan simpan-data (bisa mengirim field lewat objek `data` atau JSON string `data_json`, serta ID lewat `ids` atau `id`). Pada aksi update, cukup kirim field yang berubah.
4. Untuk menghapus data saat diminta pengguna, langsung jalankan hapus-data dengan `action` dan `ids` (atau `id`).

Nominal dalam Rupiah. Tanggal memakai format Y-m-d. Unggah file biner (lampiran, gambar, media) dilakukan lewat aplikasi web.
TXT)]
class CtechServer extends Server
{
    protected array $tools = [
        ListActionsTool::class,
        DescribeActionTool::class,
        ReadDataTool::class,
        WriteDataTool::class,
        DeleteDataTool::class,
    ];

    protected array $resources = [
        //
    ];

    protected array $prompts = [
        //
    ];
}
