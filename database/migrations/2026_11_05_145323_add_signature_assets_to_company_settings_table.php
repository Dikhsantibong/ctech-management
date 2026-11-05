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
        Schema::table('company_settings', function (Blueprint $table) {
            // Path di disk privat "local" — tidak pernah bisa diakses lewat URL publik
            $table->string('signature_image')->nullable()->after('leader_name');
            $table->string('stamp_image')->nullable()->after('signature_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_settings', function (Blueprint $table) {
            $table->dropColumn(['signature_image', 'stamp_image']);
        });
    }
};
