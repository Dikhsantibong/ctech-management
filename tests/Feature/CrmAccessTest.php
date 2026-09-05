<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\MenuAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CrmAccessTest extends TestCase
{
    use DatabaseTransactions;

    private function userWithRole(string $role): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => $role])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    public function test_marketing_can_access_crm_prospek(): void
    {
        $user = $this->userWithRole('marketing');

        $this->actingAs($user)->get('/crm/prospek')->assertStatus(200);
    }

    public function test_role_without_permission_is_forbidden(): void
    {
        // administrasi tidak diberi menu CRM secara default.
        $user = $this->userWithRole('administrasi');

        $this->actingAs($user)->get('/crm/prospek')->assertStatus(403);
    }

    public function test_dashboard_loads_for_super_role(): void
    {
        $user = $this->userWithRole('direktur_utama');

        $this->actingAs($user)->get('/crm')->assertStatus(200);
    }
}
