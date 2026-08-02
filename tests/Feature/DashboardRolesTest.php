<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

/**
 * Dashboard punya cabang query berbeda per role. Cabang selain direktur_utama
 * pernah memakai kolom/model yang tidak ada (scheduled_at, SuratMasuk, SuratKeluar,
 * relasi Invoice->project) sehingga langsung fatal saat dibuka.
 */
class DashboardRolesTest extends TestCase
{
    use DatabaseTransactions;

    public static function roleProvider(): array
    {
        return [
            'direktur_utama' => ['direktur_utama'],
            'operation' => ['operation'],
            'marketing' => ['marketing'],
            'administrasi' => ['administrasi'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('roleProvider')]
    public function test_dashboard_loads_for_role(string $role): void
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        // Ubah role di dalam transaksi; perubahan di-rollback setelah test selesai
        $user->forceFill(['role' => $role])->save();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertStatus(200);
    }
}
