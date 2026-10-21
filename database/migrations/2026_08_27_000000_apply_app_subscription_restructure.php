<?php

use Illuminate\Database\Migrations\Migration;

/**
 * Menjalankan perombakan langganan (2026_08_04_000000 & 000001) setelah tabel
 * app_subscriptions dibuat.
 *
 * Kedua migrasi itu bertanggal lebih awal dari create_app_subscriptions, sehingga
 * pada database baru keduanya dilewati. Pada database yang sudah dirombak,
 * guard di dalam migrasi asli membuat langkah ini tidak melakukan apa-apa.
 */
return new class extends Migration
{
    public function up(): void
    {
        (require __DIR__.'/2026_08_04_000000_restructure_app_subscriptions.php')->up();
        (require __DIR__.'/2026_08_04_000001_drop_legacy_subscription_columns.php')->up();
    }

    public function down(): void
    {
        (require __DIR__.'/2026_08_04_000001_drop_legacy_subscription_columns.php')->down();
        (require __DIR__.'/2026_08_04_000000_restructure_app_subscriptions.php')->down();
    }
};
