<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@ctech.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        User::factory()->create([
            'name' => 'Admin Operasional',
            'email' => 'ops@ctech.com',
            'password' => bcrypt('password'),
            'role' => 'admin_operasional',
        ]);

        User::factory()->create([
            'name' => 'Staff Member',
            'email' => 'staff@ctech.com',
            'password' => bcrypt('password'),
            'role' => 'staff',
        ]);
    }
}
