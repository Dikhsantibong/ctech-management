<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Beri role marketing (Sales) akses default ke menu CRM. Direktur Utama
     * (SUPER_ROLE) selalu punya akses via MenuAccess, jadi tidak perlu baris.
     * Idempotent: aman dijalankan ulang, tidak menimpa pengaturan yang ada.
     */
    private array $keys = [
        'crm-dashboard',
        'crm-prospects',
        'crm-pipeline',
        'crm-activities',
        'crm-quotations',
    ];

    public function up(): void
    {
        $now = now();

        foreach ($this->keys as $key) {
            $exists = DB::table('role_menu_permissions')
                ->where('role', 'marketing')
                ->where('menu_key', $key)
                ->exists();

            if (! $exists) {
                DB::table('role_menu_permissions')->insert([
                    'role' => 'marketing',
                    'menu_key' => $key,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('role_menu_permissions')
            ->where('role', 'marketing')
            ->whereIn('menu_key', $this->keys)
            ->delete();
    }
};
