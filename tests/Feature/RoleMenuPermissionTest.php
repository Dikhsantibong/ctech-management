<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class RoleMenuPermissionTest extends TestCase
{
    use DatabaseTransactions;

    private function user(string $role): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => $role])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    public function test_revoking_a_menu_also_blocks_the_url(): void
    {
        $user = $this->user('operation');
        $access = app(MenuAccess::class);

        // Awalnya operation boleh membuka Projects
        $access->sync('operation', ['projects']);
        $this->actingAs($user)->get('/projects')->assertStatus(200);

        // Setelah dicabut, URL-nya ikut tertutup — bukan cuma hilang dari sidebar
        $access->sync('operation', []);
        $this->actingAs($user)->get('/projects')->assertStatus(403);
    }

    public function test_granting_a_menu_opens_access(): void
    {
        $user = $this->user('marketing');
        $access = app(MenuAccess::class);

        $access->sync('marketing', []);
        $this->actingAs($user)->get('/invoices')->assertStatus(403);

        $access->sync('marketing', ['invoices']);
        $this->actingAs($user)->get('/invoices')->assertStatus(200);
    }

    public function test_direktur_utama_keeps_full_access_even_with_no_rows(): void
    {
        $user = $this->user(MenuRegistry::SUPER_ROLE);
        $access = app(MenuAccess::class);

        $access->sync(MenuRegistry::SUPER_ROLE, []);

        $this->actingAs($user)->get('/projects')->assertStatus(200);
        $this->actingAs($user)->get('/invoices')->assertStatus(200);
        $this->actingAs($user)->get('/role-permissions')->assertStatus(200);
    }

    public function test_sidebar_only_lists_allowed_menus(): void
    {
        $user = $this->user('operation');
        app(MenuAccess::class)->sync('operation', ['tasks', 'projects']);

        $keys = collect(app(MenuAccess::class)->sidebarFor($user))
            ->flatMap(fn ($group) => collect($group['items'])->pluck('key'))
            ->all();

        sort($keys);
        $this->assertSame(['projects', 'tasks'], $keys);
    }

    public function test_permission_page_is_locked_to_direktur_utama(): void
    {
        $user = $this->user('operation');

        // Bahkan bila menu-nya dipaksa diberikan, halamannya tetap tertutup
        app(MenuAccess::class)->sync('operation', ['role-permissions']);

        $this->actingAs($user)->get('/role-permissions')->assertStatus(403);
        $this->actingAs($user)->put('/role-permissions', [
            'role' => 'marketing',
            'menu_keys' => ['users'],
        ])->assertStatus(403);
    }

    public function test_locked_menu_cannot_be_granted_through_the_form(): void
    {
        $user = $this->user(MenuRegistry::SUPER_ROLE);

        $this->actingAs($user)->put('/role-permissions', [
            'role' => 'operation',
            'menu_keys' => ['tasks', 'role-permissions'],
        ])->assertRedirect();

        $allowed = app(MenuAccess::class)->allowedKeys('operation');

        $this->assertContains('tasks', $allowed);
        $this->assertNotContains('role-permissions', $allowed, 'Menu terkunci tetap tersimpan');
    }

    /**
     * Prop halaman menimpa prop global di Inertia. Sidebar sempat rusak karena
     * halaman ini mengirim prop bernama "menus" yang sama dengan prop global.
     */
    public function test_sidebar_prop_is_not_shadowed_by_page_props(): void
    {
        $user = $this->user(MenuRegistry::SUPER_ROLE);

        $props = $this->actingAs($user)->get('/role-permissions')
            ->assertStatus(200)
            ->viewData('page')['props'];

        $this->assertArrayHasKey('navMenus', $props, 'Prop sidebar hilang');

        foreach ($props['navMenus'] as $group) {
            $this->assertArrayHasKey('group', $group);
            $this->assertArrayHasKey('items', $group, 'Setiap grup sidebar wajib punya items');
        }
    }

    /** Prop sidebar harus utuh di setiap halaman, bukan hanya di halaman ini. */
    public function test_sidebar_prop_present_on_every_page(): void
    {
        $user = $this->user(MenuRegistry::SUPER_ROLE);

        foreach (['/dashboard', '/projects', '/tasks', '/invoices', '/kpi'] as $url) {
            $props = $this->actingAs($user)->get($url)->assertStatus(200)->viewData('page')['props'];

            $this->assertArrayHasKey('navMenus', $props, "Prop sidebar hilang di {$url}");

            foreach ($props['navMenus'] as $group) {
                $this->assertArrayHasKey('items', $group, "Grup sidebar rusak di {$url}");
            }
        }
    }

    public function test_super_role_cannot_be_edited(): void
    {
        $user = $this->user(MenuRegistry::SUPER_ROLE);

        $this->actingAs($user)->putJson('/role-permissions', [
            'role' => MenuRegistry::SUPER_ROLE,
            'menu_keys' => [],
        ])->assertStatus(422);
    }
}
