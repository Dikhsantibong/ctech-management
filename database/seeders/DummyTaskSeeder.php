<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;
use App\Models\Project;

class DummyTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'operation')->first() ?? User::first();
        $project = Project::first();

        if (!$user || !$project) {
            $this->command->info('No user or project found to assign tasks to.');
            return;
        }

        $tasks = [
            [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'title' => 'Desain Antarmuka Login',
                'description' => 'Membuat desain UI/UX untuk halaman login dengan mengacu pada brand guidelines klien.',
                'status' => 'Todo',
                'priority' => 'High',
                'start_date' => now()->subDays(1)->format('Y-m-d'),
                'deadline' => now()->addDays(3)->format('Y-m-d'),
                'metadata' => [
                    'checklists' => [
                        ['id' => uniqid(), 'text' => 'Buat wireframe dasar', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Pilih skema warna', 'completed' => false],
                        ['id' => uniqid(), 'text' => 'Buat aset logo', 'completed' => false],
                        ['id' => uniqid(), 'text' => 'Finalisasi desain hi-fi', 'completed' => false],
                    ],
                    'attachments' => [],
                    'comments' => [
                        ['id' => uniqid(), 'user' => 'System', 'text' => 'Tugas telah dibuat dan di-assign.', 'timestamp' => now()->format('Y-m-d H:i:s')]
                    ]
                ]
            ],
            [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'title' => 'Setup Database & Migrasi',
                'description' => 'Merancang arsitektur database dan membuat file migrasi di Laravel untuk tabel-tabel utama (users, roles, profiles).',
                'status' => 'Progress',
                'priority' => 'Medium',
                'start_date' => now()->subDays(2)->format('Y-m-d'),
                'deadline' => now()->addDays(5)->format('Y-m-d'),
                'metadata' => [
                    'checklists' => [
                        ['id' => uniqid(), 'text' => 'Buat ERD', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Tulis migrasi users', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Tulis seeder awal', 'completed' => false],
                    ],
                    'attachments' => [],
                    'comments' => []
                ]
            ],
            [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'title' => 'Review Code AuthController',
                'description' => 'Mengecek celah keamanan pada AuthController yang baru dibuat, pastikan tidak ada kebocoran token.',
                'status' => 'Done',
                'priority' => 'High',
                'start_date' => now()->subDays(5)->format('Y-m-d'),
                'deadline' => now()->subDays(1)->format('Y-m-d'),
                'metadata' => [
                    'checklists' => [
                        ['id' => uniqid(), 'text' => 'Cek brute force protection', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Cek password hashing', 'completed' => true],
                    ],
                    'attachments' => [],
                    'comments' => []
                ]
            ],
            [
                'project_id' => $project->id,
                'user_id' => $user->id,
                'title' => 'Integrasi API Payment Gateway',
                'description' => 'Memasang Midtrans snap API untuk memproses pembayaran di modul checkout.',
                'status' => 'Review',
                'priority' => 'High',
                'start_date' => now()->format('Y-m-d'),
                'deadline' => now()->addDays(2)->format('Y-m-d'),
                'metadata' => [
                    'checklists' => [
                        ['id' => uniqid(), 'text' => 'Daftar akun sandbox', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Generate server key', 'completed' => true],
                        ['id' => uniqid(), 'text' => 'Buat endpoint callback', 'completed' => false],
                    ],
                    'attachments' => [],
                    'comments' => []
                ]
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }

        $this->command->info('Dummy tasks created successfully!');
    }
}
