<?php

namespace App\Services;

use App\Models\RoleMenuPermission;
use App\Models\User;
use App\Support\MenuRegistry;
use Illuminate\Support\Facades\Cache;

class MenuAccess
{
    private const CACHE_KEY = 'role_menu_permissions';

    /** Peta role => daftar menu_key yang diizinkan. */
    public function map(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return RoleMenuPermission::query()
                ->get(['role', 'menu_key'])
                ->groupBy('role')
                ->map(fn ($rows) => $rows->pluck('menu_key')->all())
                ->all();
        });
    }

    public function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /** Menu yang boleh diakses satu role. Direktur utama selalu dapat semuanya. */
    public function allowedKeys(?string $role): array
    {
        if ($role === MenuRegistry::SUPER_ROLE) {
            return MenuRegistry::keys();
        }

        if (! $role) {
            return [];
        }

        // Hanya kunci yang masih terdaftar — sisa data lama diabaikan
        return array_values(array_intersect($this->map()[$role] ?? [], MenuRegistry::keys()));
    }

    public function allows(?string $role, string $menuKey): bool
    {
        if (in_array($menuKey, MenuRegistry::ALWAYS_ALLOWED, true)) {
            return true;
        }

        return in_array($menuKey, $this->allowedKeys($role), true);
    }

    /**
     * Menu siap render untuk sidebar, sudah dikelompokkan sesuai urutan grup.
     *
     * @return array<int, array{group: string, items: array}>
     */
    public function sidebarFor(?User $user): array
    {
        $allowed = $this->allowedKeys($user?->role);
        $registry = MenuRegistry::all();
        $grouped = [];

        foreach (MenuRegistry::groups() as $group) {
            $items = [];

            foreach ($registry as $key => $menu) {
                if ($menu['group'] !== $group || ! in_array($key, $allowed, true)) {
                    continue;
                }

                $items[] = [
                    'key' => $key,
                    'title' => $menu['label'],
                    'href' => $menu['href'],
                    'icon' => $menu['icon'],
                ];
            }

            if ($items !== []) {
                $grouped[] = ['group' => $group, 'items' => $items];
            }
        }

        return $grouped;
    }

    /** Simpan ulang hak akses satu role. */
    public function sync(string $role, array $menuKeys): void
    {
        $valid = array_values(array_intersect($menuKeys, MenuRegistry::keys()));

        RoleMenuPermission::where('role', $role)->delete();

        if ($valid !== []) {
            RoleMenuPermission::insert(array_map(
                fn ($key) => ['role' => $role, 'menu_key' => $key, 'created_at' => now(), 'updated_at' => now()],
                $valid,
            ));
        }

        $this->forget();
    }
}
