<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_targets', function (Blueprint $table) {
            $table->id();
            $table->string('role');            // direktur_utama, operation, marketing, administrasi
            $table->string('metric_key');      // lihat App\Services\KpiService::definitions()
            $table->string('period', 7);       // YYYY-MM
            $table->decimal('target_value', 15, 2);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['role', 'metric_key', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_targets');
    }
};
