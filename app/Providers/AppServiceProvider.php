<?php

namespace App\Providers;

use App\Mcp\Support\McpBridgeClientRepository;
use App\Mcp\Support\McpOAuthRegisterController;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Mcp\Server\Http\Controllers\OAuthRegisterController;
use Laravel\Mcp\Server\Registrar;
use Laravel\Passport\Bridge\ClientRepository as BridgeClientRepository;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(BridgeClientRepository::class, McpBridgeClientRepository::class);
        $this->app->bind(OAuthRegisterController::class, McpOAuthRegisterController::class);

        // routes/channels.php membuat broadcaster saat aplikasi dimuat. Bila kunci
        // Pusher belum diisi, broadcaster Pusher gagal dibuat dan SELURUH aplikasi
        // ikut error. Jatuhkan ke "log" agar aplikasi tetap jalan; chat lalu
        // otomatis memakai polling.
        if (config('broadcasting.default') === 'pusher' && blank(config('broadcasting.connections.pusher.key'))) {
            config(['broadcasting.default' => 'log']);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Layar "Izinkan akses" saat connector MCP (Claude) meminta login OAuth
        Passport::authorizationView(fn (array $parameters) => view('mcp.authorize', $parameters));
        Passport::tokensCan([
            Registrar::OAUTH_SCOPE => 'Membaca data proyek, tugas, invoice, dan klien sesuai hak akses menu akun Anda',
        ]);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
