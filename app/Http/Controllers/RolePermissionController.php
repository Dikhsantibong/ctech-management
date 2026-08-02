<?php

namespace App\Http\Controllers;

use App\Services\KpiService;
use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly MenuAccess $menuAccess)
    {
    }

    public function index()
    {
        $registry = MenuRegistry::all();

        $menus = collect($registry)
            ->map(fn ($menu, $key) => [
                'key' => $key,
                'label' => $menu['label'],
                'href' => $menu['href'],
                'group' => $menu['group'],
                'icon' => $menu['icon'],
                'sensitive' => $menu['sensitive'] ?? false,
                'locked' => $menu['locked'] ?? false,
            ])
            ->values()
            ->all();

        // Role selain direktur utama; direktur utama selalu punya akses penuh
        $roles = collect(KpiService::ROLES)
            ->reject(fn ($role) => $role === MenuRegistry::SUPER_ROLE)
            ->map(fn ($role) => [
                'value' => $role,
                'label' => KpiService::ROLE_LABELS[$role] ?? $role,
                'allowed' => $this->menuAccess->allowedKeys($role),
                'user_count' => \App\Models\User::where('role', $role)->count(),
            ])
            ->values()
            ->all();

        return Inertia::render('role-permissions/index', [
            'menus' => $menus,
            'groups' => MenuRegistry::groups(),
            'roles' => $roles,
            'super_role_label' => KpiService::ROLE_LABELS[MenuRegistry::SUPER_ROLE],
            'always_allowed' => MenuRegistry::ALWAYS_ALLOWED,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string|in:' . implode(',', array_diff(KpiService::ROLES, [MenuRegistry::SUPER_ROLE])),
            'menu_keys' => 'present|array',
            'menu_keys.*' => 'string|in:' . implode(',', MenuRegistry::keys()),
        ]);

        // Menu terkunci tidak boleh diberikan ke role lain lewat request langsung
        $locked = collect(MenuRegistry::all())->filter(fn ($m) => $m['locked'] ?? false)->keys()->all();
        $requested = array_values(array_diff($validated['menu_keys'], $locked));

        $this->menuAccess->sync($validated['role'], $requested);

        $roleLabel = KpiService::ROLE_LABELS[$validated['role']] ?? $validated['role'];
        $this->logActivity('updated', 'RoleMenuPermission', 0, "Mengubah hak akses menu role {$roleLabel} (" . count($requested) . ' menu)');

        Inertia::flash('toast', ['type' => 'success', 'message' => "Hak akses {$roleLabel} diperbarui."]);

        return redirect()->back();
    }
}
