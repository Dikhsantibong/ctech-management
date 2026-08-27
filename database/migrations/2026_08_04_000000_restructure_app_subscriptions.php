<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Perombakan struktur langganan aplikasi.
 *
 * Tiga perubahan pokok:
 *
 * 1. Kategori aplikasi dipisah ke tabelnya sendiri (POS APP, Photobooth App),
 *    menggantikan kolom app_name yang berupa teks bebas sehingga tidak bisa
 *    direkap per jenis aplikasi.
 *
 * 2. Harga disimpan sebagai HARGA PER BULAN, bukan nominal per siklus. Dengan
 *    begitu siklus tagihan (1/3/6/12 bulan) bisa diubah tanpa mengubah harga,
 *    dan nilai terakru bisa dihitung tepat per bulan berjalan.
 *
 * 3. Pembayaran dicatat di tabel tersendiri. Sebelumnya "total terbayar"
 *    dihitung dari lamanya waktu berjalan — artinya klien yang menunggak tetap
 *    terhitung lunas. Sekarang yang tercatat adalah pembayaran yang benar-benar
 *    diterima, dan selisihnya terhadap nilai terakru menjadi tunggakan.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ===== Kategori aplikasi =====
        Schema::create('app_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('default_monthly_price', 15, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $now = now();
        DB::table('app_categories')->insert([
            [
                'name' => 'POS App',
                'slug' => 'pos-app',
                'description' => 'Aplikasi kasir dan pencatatan penjualan.',
                'default_monthly_price' => 0,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Photobooth App',
                'slug' => 'photobooth-app',
                'description' => 'Aplikasi photobooth beserta pengelolaan cetak dan galeri.',
                'default_monthly_price' => 0,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Lainnya',
                'slug' => 'lainnya',
                'description' => 'Aplikasi di luar kategori baku.',
                'default_monthly_price' => 0,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $categories = DB::table('app_categories')->pluck('id', 'slug');

        // ===== Kolom baru pada langganan =====
        Schema::table('app_subscriptions', function (Blueprint $table) use ($categories) {
            $table->foreignId('app_category_id')->nullable()->after('id')->constrained('app_categories')->nullOnDelete();
            $table->decimal('monthly_price', 15, 2)->default(0)->after('app_name');
            $table->unsignedTinyInteger('billing_cycle_months')->default(1)->after('monthly_price');
            $table->string('status', 20)->default('active')->after('billing_cycle_months');
            $table->date('ended_at')->nullable()->after('deadline');
            $table->text('notes')->nullable()->after('ended_at');
        });

        // ===== Riwayat pembayaran =====
        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('app_subscription_id')->constrained()->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->unsignedSmallInteger('months');
            $table->decimal('amount', 15, 2);
            $table->date('paid_at');
            $table->string('method', 40)->nullable();
            $table->string('reference')->nullable();
            $table->text('note')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['app_subscription_id', 'period_start']);
        });

        // ===== Pindahkan data lama =====
        foreach (DB::table('app_subscriptions')->get() as $row) {
            $cycle = max(1, (int) ($row->siklus_tagihan ?? 1));

            // billing_amount lama adalah nominal per siklus, bukan per bulan
            $monthlyPrice = $cycle > 0 ? round(((float) $row->billing_amount) / $cycle, 2) : (float) $row->billing_amount;

            $name = Str::lower((string) $row->app_name);
            $slug = str_contains($name, 'photobooth') ? 'photobooth-app'
                : (str_contains($name, 'pos') || str_contains($name, 'kasir') ? 'pos-app' : 'lainnya');

            DB::table('app_subscriptions')->where('id', $row->id)->update([
                'app_category_id' => $categories[$slug] ?? null,
                'monthly_price' => $monthlyPrice,
                'billing_cycle_months' => $cycle,
                'status' => $row->is_active ? 'active' : 'ended',
            ]);

            // Kolom deadline lama berarti "sudah dibayar sampai tanggal ini",
            // jadi periode itu dicatat sebagai satu pembayaran saldo awal agar
            // total terbayar tidak mendadak nol setelah perombakan.
            $start = Carbon::parse($row->start_date)->startOfDay();
            $paidThrough = Carbon::parse($row->deadline)->startOfDay();

            if ($paidThrough->greaterThan($start)) {
                $months = max(1, $start->diffInMonths($paidThrough));

                DB::table('subscription_payments')->insert([
                    'app_subscription_id' => $row->id,
                    'period_start' => $start->toDateString(),
                    'period_end' => $paidThrough->toDateString(),
                    'months' => $months,
                    'amount' => round($monthlyPrice * $months, 2),
                    'paid_at' => $start->toDateString(),
                    'method' => 'migrasi',
                    'note' => 'Saldo awal dari data sebelum perombakan — periksa dan sesuaikan bila nominalnya berbeda.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_payments');

        Schema::table('app_subscriptions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('app_category_id');
            $table->dropColumn(['monthly_price', 'billing_cycle_months', 'status', 'ended_at', 'notes']);
        });

        Schema::dropIfExists('app_categories');
    }
};
