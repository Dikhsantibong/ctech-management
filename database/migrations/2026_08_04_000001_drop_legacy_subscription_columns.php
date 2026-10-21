<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Buang kolom lama yang sudah digantikan.
 *
 * billing_amount  -> monthly_price x billing_cycle_months (lihat AppSubscription::cycle_amount)
 * siklus_tagihan  -> billing_cycle_months
 *
 * Nilainya sudah dipindahkan pada migrasi 2026_08_04_000000. Kolom ini bersifat
 * NOT NULL tanpa nilai bawaan, sehingga bila dibiarkan setiap penyimpanan data
 * baru akan gagal.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Lihat catatan pada 2026_08_04_000000: dilewati bila tabel belum ada
        // atau kolom lama sudah dibuang.
        if (! Schema::hasTable('app_subscriptions') || ! Schema::hasColumn('app_subscriptions', 'billing_amount')) {
            return;
        }

        Schema::table('app_subscriptions', function (Blueprint $table) {
            $table->dropColumn(['billing_amount', 'siklus_tagihan']);
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('app_subscriptions') || Schema::hasColumn('app_subscriptions', 'billing_amount')) {
            return;
        }

        Schema::table('app_subscriptions', function (Blueprint $table) {
            $table->decimal('billing_amount', 15, 2)->default(0)->after('app_name');
            $table->integer('siklus_tagihan')->default(12)->after('billing_amount');
        });
    }
};
