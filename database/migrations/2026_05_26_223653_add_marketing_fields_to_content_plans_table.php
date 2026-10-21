<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrasi ini bertanggal sebelum create_content_plans. Pada database baru
        // tabelnya belum ada; kolom-kolom ini lalu ditambahkan oleh migrasi create.
        if (! Schema::hasTable('content_plans')) {
            return;
        }

        Schema::table('content_plans', function (Blueprint $table) {
            $table->string('campaign_name')->nullable()->after('status');
            $table->text('brief')->nullable()->after('campaign_name');
            $table->text('reference_links')->nullable()->after('brief');
            $table->string('visual_assets_url')->nullable()->after('reference_links');
            $table->string('target_audience')->nullable()->after('visual_assets_url');
            $table->string('keywords')->nullable()->after('target_audience');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('content_plans') || ! Schema::hasColumn('content_plans', 'campaign_name')) {
            return;
        }

        Schema::table('content_plans', function (Blueprint $table) {
            $table->dropColumn([
                'campaign_name',
                'brief',
                'reference_links',
                'visual_assets_url',
                'target_audience',
                'keywords',
            ]);
        });
    }
};
