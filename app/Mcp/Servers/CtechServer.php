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
#[Version('2.0.0')]
#[Instructions(<<<'TXT'
Akses penuh ke sistem manajemen CTECH: dashboard, project (milestone, rapat, dokumen, revisi, feedback), tasks, work, daily report, kalender, klien, CRM (prospek, pipeline, aktivitas), penawaran/RAB, invoice & kwitansi, langganan aplikasi, content planning & media sosial, berita, portfolio, surat keluar/masuk, dokumen, file, KPI, log aktivitas, tim, hak akses menu, dan pengaturan perusahaan.

Alur kerja:
1. Panggil daftar-aksi untuk melihat aksi yang boleh dijalankan akun ini. Hak aksesnya sama dengan menu di aplikasi web.
2. Baca data dengan baca-data. Untuk mencari id, gunakan aksi list modul terkait.
3. Sebelum menyimpan, panggil detail-aksi untuk melihat field dan aturan validasinya, lalu jalankan simpan-data. Pada aksi update, cukup kirim field yang berubah.
4. hapus-data tidak bisa dibatalkan. Selalu konfirmasi ke pengguna terlebih dahulu.

Nominal dalam Rupiah. Tanggal memakai format Y-m-d. Unggah file (lampiran, gambar, media) tidak tersedia lewat MCP; arahkan pengguna ke aplikasi web untuk itu.
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
