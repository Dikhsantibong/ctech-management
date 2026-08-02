<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * KPI ketepatan waktu butuh tanggal penyelesaian yang stabil.
 * Tanpa kolom ini satu-satunya acuan adalah updated_at, yang ikut berubah
 * setiap kali data diedit sehingga capaian bulan lalu bisa berpindah bulan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->timestamp('completed_at')->nullable()->after('deadline');
        });

        Schema::table('project_milestones', function (Blueprint $table) {
            $table->timestamp('completed_at')->nullable()->after('status');
        });

        // Backfill data lama memakai updated_at sebagai perkiraan terbaik yang tersedia
        DB::table('tasks')->where('status', 'Done')->update(['completed_at' => DB::raw('updated_at')]);
        DB::table('project_milestones')->where('status', 'Completed')->update(['completed_at' => DB::raw('updated_at')]);
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('completed_at');
        });

        Schema::table('project_milestones', function (Blueprint $table) {
            $table->dropColumn('completed_at');
        });
    }
};
