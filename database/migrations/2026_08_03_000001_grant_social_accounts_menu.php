<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Menu baru harus diberikan eksplisit ke role yang berhak, karena tabel
 * role_menu_permissions bersifat otoritatif (baris yang tidak ada = tidak boleh).
 * Direktur utama tidak perlu didaftarkan — aksesnya selalu penuh.
 */
return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::table('role_menu_permissions')
            ->where('role', 'marketing')
            ->where('menu_key', 'social-accounts')
            ->exists();

        if (! $exists) {
            DB::table('role_menu_permissions')->insert([
                'role' => 'marketing',
                'menu_key' => 'social-accounts',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('role_menu_permissions')->where('menu_key', 'social-accounts')->delete();
    }
};
