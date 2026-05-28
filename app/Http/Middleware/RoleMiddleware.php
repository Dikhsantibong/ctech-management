<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        $userRole = auth()->user()->role;

        // If no roles are specified or user is admin, allow access
        if (empty($roles) || $userRole === 'admin' || $userRole === 'superadmin') {
            return $next($request);
        }

        if (!in_array($userRole, $roles)) {
            // Redirect back with an error or to a specific route
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
