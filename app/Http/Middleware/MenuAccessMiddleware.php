<?php

namespace App\Http\Middleware;

use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Menjaga route berdasarkan hak akses menu yang diatur direktur utama.
 *
 * Dipakai sebagai `menu:<key>`. Tanpa ini pengaturan hak akses hanya kosmetik —
 * menu hilang dari sidebar tapi URL-nya tetap bisa diketik manual.
 */
class MenuAccessMiddleware
{
    public function __construct(private readonly MenuAccess $menuAccess)
    {
    }

    public function handle(Request $request, Closure $next, string $menuKey): Response
    {
        if (! auth()->check()) {
            return redirect('login');
        }

        abort_unless(MenuRegistry::has($menuKey), 500, "Menu '{$menuKey}' tidak terdaftar di MenuRegistry.");

        if (! $this->menuAccess->allows(auth()->user()->role, $menuKey)) {
            abort(403, 'Anda tidak memiliki akses ke menu ini.');
        }

        return $next($request);
    }
}
