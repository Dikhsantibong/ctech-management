<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            // Pengaturan halaman PDF per surat (mm); null = pakai default template
            $table->unsignedSmallInteger('margin_top')->nullable();
            $table->unsignedSmallInteger('margin_right')->nullable();
            $table->unsignedSmallInteger('margin_bottom')->nullable();
            $table->unsignedSmallInteger('margin_left')->nullable();
            $table->string('line_spacing', 8)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropColumn(['margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'line_spacing']);
        });
    }
};
