<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add direktur_operasional to the role enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'direktur_operasional', 'admin_operasional', 'staff') DEFAULT 'staff'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove direktur_operasional from the role enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'admin_operasional', 'staff') DEFAULT 'staff'");
    }
};
