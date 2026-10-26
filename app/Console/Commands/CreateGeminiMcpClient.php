<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Laravel\Mcp\Server\Registrar;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use RuntimeException;

class CreateGeminiMcpClient extends Command
{
    /**
     * Callback OAuth resmi milik connector Gemini (Gemini Enterprise / Vertex AI,
     * Gemini Web, Google AI Studio, serta Gemini CLI lokal).
     *
     * @var array<int, string>
     */
    public const GEMINI_REDIRECT_URIS = [
        'https://vertexaisearch.cloud.google.com/oauth-redirect',
        'https://gemini.google.com/api/mcp/auth_callback',
        'https://aistudio.google.com/oauth/callback',
        'http://localhost:7777/oauth/callback',
        'http://127.0.0.1:7777/oauth/callback',
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcp:gemini-client
        {--name=Gemini : Nama client yang tampil di layar persetujuan}
        {--user= : Opsional: email atau ID user untuk langsung membuat Bearer Token (Personal Access Token)}
        {--redirect=* : Opsional: URL callback OAuth tambahan}
        {--public : Buat public OAuth client (tanpa secret, dengan PKCE) untuk CLI lokal}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat OAuth Client ID & Secret (serta opsional Bearer Token) untuk menghubungkan Gemini ke server MCP aplikasi ini';

    /**
     * Execute the console command.
     */
    public function handle(ClientRepository $clients): int
    {
        $extraRedirects = array_values(array_filter(
            array_map('strval', (array) $this->option('redirect')),
            fn (string $uri): bool => trim($uri) !== '',
        ));

        $redirectUris = array_values(array_unique([
            ...self::GEMINI_REDIRECT_URIS,
            ...$extraRedirects,
        ]));

        $confidential = ! (bool) $this->option('public');
        $name = (string) $this->option('name');

        $client = $clients->createAuthorizationCodeGrantClient(
            name: $name,
            redirectUris: $redirectUris,
            confidential: $confidential,
        );

        $this->components->info('Client OAuth untuk Gemini berhasil dibuat.');
        $this->components->twoColumnDetail('URL server MCP', url('/mcp'));
        $this->components->twoColumnDetail('OAuth Authorization URL', url('/oauth/authorize'));
        $this->components->twoColumnDetail('OAuth Token URL', url('/oauth/token'));
        $this->components->twoColumnDetail('OAuth Client ID', (string) $client->getKey());

        if ($confidential) {
            $this->components->twoColumnDetail('OAuth Client Secret', (string) $client->plainSecret);
            $this->components->warn('Simpan secret sekarang. Secret disimpan dalam bentuk hash dan tidak bisa ditampilkan lagi.');
        } else {
            $this->components->twoColumnDetail('Tipe Client', 'Public (PKCE)');
        }

        $userIdentifier = $this->option('user');

        if (is_string($userIdentifier) && trim($userIdentifier) !== '') {
            $user = $this->resolveUser(trim($userIdentifier));

            if (! $user) {
                $this->components->error("User \"{$userIdentifier}\" tidak ditemukan.");

                return self::FAILURE;
            }

            $this->ensurePersonalAccessClient($clients);
            Registrar::ensureMcpScope();

            $token = $user->createToken($name, [Registrar::OAUTH_SCOPE])->accessToken;

            $this->components->info("Bearer Token MCP untuk {$user->email} ({$user->role}) berhasil dibuat.");
            $this->components->twoColumnDetail('Bearer Token', $token);
        }

        return self::SUCCESS;
    }

    private function resolveUser(string $identifier): ?User
    {
        if (ctype_digit($identifier)) {
            return User::find((int) $identifier);
        }

        return User::where('email', $identifier)->first();
    }

    private function ensurePersonalAccessClient(ClientRepository $clients): void
    {
        if (blank(config('passport.private_key')) && ! is_file(Passport::keyPath('oauth-private.key'))) {
            $this->callSilent('passport:keys', ['--force' => true]);
        }

        $provider = (string) config('auth.guards.api.provider', 'users');

        try {
            $clients->personalAccessClient($provider);
        } catch (RuntimeException) {
            $clients->createPersonalAccessGrantClient(config('app.name').' Personal Access Client', $provider);
        }
    }
}
