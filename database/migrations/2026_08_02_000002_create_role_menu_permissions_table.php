<?php

use App\Support\MenuRegistry;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_menu_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role');
            $table->string('menu_key');
            $table->timestamps();

            $table->unique(['role', 'menu_key']);
        });

        // Isi dengan hak akses yang berlaku saat ini supaya tidak ada yang
        // kehilangan menu begitu sistem hak akses diaktifkan.
        $rows = [];
        $now = now();

        foreach (MenuRegistry::defaultsByRole() as $role => $keys) {
            foreach ($keys as $key) {
                $rows[] = ['role' => $role, 'menu_key' => $key, 'created_at' => $now, 'updated_at' => $now];
            }
        }

        if ($rows !== []) {
            DB::table('role_menu_permissions')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('role_menu_permissions');
    }
};
