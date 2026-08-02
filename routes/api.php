<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Catatan: endpoint /api/v1/* ada di routes/web.php
|--------------------------------------------------------------------------
|
| Aplikasi ini memakai session auth (Inertia), sedangkan grup middleware "api"
| bersifat stateless — bootstrap/app.php tidak mengaktifkan statefulApi().
| Karena itu middleware 'auth' di file ini tidak pernah mengenali user yang
| sudah login dan semua request dari frontend dibalas 401 Unauthorized.
|
| Seluruh endpoint /api/v1/* karenanya didaftarkan di routes/web.php agar
| ikut grup middleware 'web' (session + CSRF). Jangan pindahkan ke sini.
|
*/
