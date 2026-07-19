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
        // Add the new roles to the ENUM
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'direktur_operasional', 'admin_operasional', 'staff', 'operation', 'marketing', 'administrasi') DEFAULT 'operation'");
        
        // Migrate existing users to 'operation'
        DB::statement("UPDATE users SET role = 'operation' WHERE role IN ('direktur_operasional', 'admin_operasional', 'staff')");
        
        // Remove old roles from the ENUM
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'operation', 'marketing', 'administrasi') DEFAULT 'operation'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old roles
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'operation', 'marketing', 'administrasi', 'direktur_operasional', 'admin_operasional', 'staff') DEFAULT 'staff'");
        
        DB::statement("UPDATE users SET role = 'staff' WHERE role IN ('operation', 'marketing', 'administrasi')");
        
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('direktur_utama', 'direktur_operasional', 'admin_operasional', 'staff') DEFAULT 'staff'");
    }
};
