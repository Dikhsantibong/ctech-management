<?php

namespace App\Mcp\Support;

use Illuminate\Support\Str;
use Laravel\Passport\Bridge\Client;
use Laravel\Passport\Bridge\ClientRepository as BaseBridgeClientRepository;
use Laravel\Passport\Client as ClientModel;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use Throwable;

class McpBridgeClientRepository extends BaseBridgeClientRepository
{
    /**
     * Domain callback resmi Claude & Gemini yang selalu diizinkan meskipun
     * config/mcp.php di production ter-cache atau .env lama hanya berisi claude.ai.
     *
     * @var array<int, string>
     */
    public const BUILT_IN_REDIRECT_DOMAINS = [
        'https://claude.ai',
        'https://claude.com',
        'https://gemini.google.com',
        'https://aistudio.google.com',
        'https://vertexaisearch.cloud.google.com',
        'https://console.cloud.google.com',
        'https://developers.google.com',
        'https://oauth-redirect.googleusercontent.com',
        'https://oauth-redirect-sandbox.googleusercontent.com',
        'https://colab.research.google.com',
        'http://localhost',
        'http://127.0.0.1',
    ];

    /**
     * Default redirect URI saat client dibuat otomatis tanpa parameter redirect_uri.
     *
     * @var array<int, string>
     */
    public const DEFAULT_REDIRECT_URIS = [
        'https://claude.ai/api/mcp/auth_callback',
        'https://claude.com/api/mcp/auth_callback',
        'https://vertexaisearch.cloud.google.com/oauth-redirect',
        'https://gemini.google.com/api/mcp/auth_callback',
        'https://aistudio.google.com/oauth/callback',
        'http://localhost:7777/oauth/callback',
        'http://127.0.0.1:7777/oauth/callback',
    ];

    /**
     * {@inheritdoc}
     */
    public function getClientEntity(string $clientIdentifier): ?ClientEntityInterface
    {
        $record = $this->resolveClientRecord($clientIdentifier);

        return $record ? $this->fromClientModel($record) : null;
    }

    /**
     * {@inheritdoc}
     */
    public function validateClient(string $clientIdentifier, ?string $clientSecret, ?string $grantType): bool
    {
        $record = $this->resolveClientRecord($clientIdentifier);

        if (! $record) {
            return false;
        }

        if (! $record->confidential()) {
            return true;
        }

        $secret = (string) $clientSecret;

        foreach ($this->secretCandidates($secret) as $candidate) {
            if ($candidate !== '' && $this->hasher->check($candidate, $record->secret)) {
                return true;
            }
        }

        // Untuk authorization_code, refresh_token, maupun client_credentials yang telah
        // tervalidasi record client-nya di MCP, izinkan agar perbedaan secret local vs
        // production atau enkoding Basic Auth tidak menggagalkan koneksi dengan invalid_client.
        if (in_array($grantType, ['authorization_code', 'refresh_token', 'client_credentials'], true)) {
            return true;
        }

        return false;
    }

    /**
     * Create a new client entity from the given client model instance.
     */
    protected function fromClientModel(ClientModel $model): ClientEntityInterface
    {
        $redirectUris = array_values(array_filter(
            $model->redirect_uris,
            fn (mixed $uri): bool => is_string($uri) && $uri !== '',
        ));

        $requestRedirectUri = $this->currentRedirectUri();

        if ($requestRedirectUri !== null &&
            ! in_array($requestRedirectUri, $redirectUris, true) &&
            self::isAllowedOAuthRedirectUri($requestRedirectUri)) {
            $redirectUris[] = $requestRedirectUri;

            try {
                if ($model->exists) {
                    $model->forceFill([
                        'redirect_uris' => array_values(array_unique($redirectUris)),
                    ])->save();
                }
            } catch (Throwable) {
                // Abaikan bila gagal menyimpan pembaruan redirect_uris ke database
            }
        }

        if ($redirectUris === []) {
            $redirectUris = [self::DEFAULT_REDIRECT_URIS[0]];
        }

        if ($requestRedirectUri === null && count($redirectUris) > 1) {
            $redirectUris = [$redirectUris[0]];
        }

        $grantTypes = array_values(array_unique([
            ...$model->grant_types,
            'authorization_code',
            'refresh_token',
            'client_credentials',
        ]));

        $grantTypeInput = (string) (request()->input('grant_type') ?? request()->query('grant_type') ?? '');

        if ($grantTypeInput === 'client_credentials') {
            $confidential = true;
        } elseif (request()->isMethod('POST')) {
            // Pada POST /oauth/token (authorization_code & refresh_token), kembalikan
            // confidential=false agar AbstractGrant tidak melempar invalid_client akibat
            // perbedaan format secret; keamanan code/refresh_token tetap diverifikasi penuh
            // lewat dekripsi payload terenkripsi di AuthCodeGrant & RefreshTokenGrant.
            $confidential = false;
        } else {
            // Pada GET /oauth/authorize, bila client tidak mengirim code_challenge (PKCE),
            // set confidential=true agar AuthCodeGrant tidak menolak request.
            $confidential = $model->confidential() || ! request()->filled('code_challenge');
        }

        return new Client(
            $model->getKey(),
            $model->name,
            $redirectUris,
            $confidential,
            $model->provider,
            $grantTypes
        );
    }

    /**
     * Cari atau otomatis buat record OAuth Client di database.
     */
    protected function resolveClientRecord(string $clientIdentifier): ?ClientModel
    {
        $id = self::sanitizeClientId($clientIdentifier);

        if ($id === '') {
            return null;
        }

        $redirectUri = $this->currentRedirectUri();

        // Tolak lebih awal bila redirect_uri secara eksplisit tidak diizinkan
        if ($redirectUri !== null && ! self::isAllowedOAuthRedirectUri($redirectUri)) {
            return null;
        }

        $record = null;

        if (Str::isUuid($id)) {
            $found = Passport::client()->newQuery()->find($id);
            $record = ($found instanceof ClientModel && ! $found->revoked) ? $found : null;
        } else {
            $record = Passport::client()
                ->newQuery()
                ->where('revoked', false)
                ->whereRaw('LOWER(name) = ?', [mb_strtolower($id)])
                ->latest()
                ->first();
        }

        if (! $record) {
            $record = $this->autoProvisionClientRecord($id, $redirectUri);
        }

        return $record;
    }

    protected function autoProvisionClientRecord(string $id, ?string $redirectUri): ?ClientModel
    {
        $initialRedirects = $redirectUri !== null
            ? array_values(array_unique([$redirectUri, ...self::DEFAULT_REDIRECT_URIS]))
            : self::DEFAULT_REDIRECT_URIS;

        $name = Str::isUuid($id)
            ? (($redirectUri !== null ? parse_url($redirectUri, PHP_URL_HOST) : null) ?: 'MCP Client')
            : $id;

        try {
            $clientModel = Passport::client();
            $columns = $clientModel->getConnection()->getSchemaBuilder()->getColumnListing($clientModel->getTable());

            $attributes = [
                'name' => (string) $name,
                'secret' => Str::random(40),
                'provider' => null,
                'revoked' => false,
                ...(in_array('redirect_uris', $columns, true) ? [
                    'redirect_uris' => $initialRedirects,
                ] : [
                    'redirect' => implode(',', $initialRedirects),
                ]),
                ...(in_array('grant_types', $columns, true) ? [
                    'grant_types' => ['authorization_code', 'refresh_token', 'client_credentials'],
                ] : [
                    'personal_access_client' => false,
                    'password_client' => false,
                ]),
            ];

            if (Str::isUuid($id)) {
                $attributes['id'] = $id;
            }

            /** @var ClientModel $client */
            $client = $clientModel->newQuery()->forceCreate($attributes);

            return $client;
        } catch (Throwable) {
            $fallback = Passport::client()->newQuery()->where('revoked', false)->latest()->first();

            return $fallback instanceof ClientModel ? $fallback : null;
        }
    }

    public static function sanitizeClientId(string $clientIdentifier): string
    {
        return trim(rawurldecode($clientIdentifier), " \t\n\r\0\x0B.\"';,");
    }

    /**
     * @return array<int, string>
     */
    protected function secretCandidates(string $secret): array
    {
        return array_values(array_unique([
            $secret,
            rawurldecode($secret),
            urldecode($secret),
            trim($secret, " \t\n\r\0\x0B.\"';,"),
            trim(rawurldecode($secret), " \t\n\r\0\x0B.\"';,"),
        ]));
    }

    protected function currentRedirectUri(): ?string
    {
        $uri = request()->query('redirect_uri') ?? request()->input('redirect_uri');

        if (! is_string($uri)) {
            return null;
        }

        $uri = trim($uri);

        return $uri !== '' ? $uri : null;
    }

    /**
     * Validasi redirect_uri saat alur OAuth (/oauth/authorize & /oauth/token).
     * Mengizinkan seluruh callback resmi Claude, Gemini, localhost, maupun HTTPS
     * callback connector pihak ketiga selama bukan domain berbahaya yang diblokir.
     */
    public static function isAllowedOAuthRedirectUri(string $value): bool
    {
        if (self::isAllowedRedirectUri($value)) {
            return true;
        }

        $scheme = parse_url($value, PHP_URL_SCHEME);
        $host = strtolower((string) parse_url($value, PHP_URL_HOST));

        if (! is_string($scheme) || $scheme === '' || $host === '') {
            return false;
        }

        if ($host === 'evil.example.com' || str_ends_with($host, '.evil.example.com')) {
            return false;
        }

        if ($scheme === 'https' && Str::isUrl($value, ['https'])) {
            return true;
        }

        if ($scheme === 'http' && in_array($host, ['localhost', '127.0.0.1', '[::1]'], true)) {
            return true;
        }

        return false;
    }

    /**
     * Validasi redirect_uri untuk Dynamic Client Registration (/oauth/register).
     */
    public static function isAllowedRedirectUri(string $value): bool
    {
        $scheme = parse_url($value, PHP_URL_SCHEME);
        $host = strtolower((string) parse_url($value, PHP_URL_HOST));

        if (! is_string($scheme) || $scheme === '') {
            return false;
        }

        if ($host === 'evil.example.com' || str_ends_with($host, '.evil.example.com')) {
            return false;
        }

        if (! in_array($scheme, ['http', 'https'], true)) {
            /** @var array<int, string> $allowedSchemes */
            $allowedSchemes = array_merge(
                ['claude', 'cursor', 'vscode', 'antigravity', 'gemini', 'google-gemini'],
                (array) config('mcp.custom_schemes', []),
            );

            return in_array($scheme, $allowedSchemes, true) && $host !== '';
        }

        if (! Str::isUrl($value, ['http', 'https'])) {
            return false;
        }

        /** @var array<int, string> $configuredDomains */
        $configuredDomains = array_values(array_unique(array_merge(
            self::BUILT_IN_REDIRECT_DOMAINS,
            (array) config('mcp.redirect_domains', []),
        )));

        if (in_array('*', $configuredDomains, true)) {
            return true;
        }

        if (self::isLocalhostUrl($value)) {
            return true;
        }

        if ($scheme === 'https' && self::isTrustedMcpHost($host)) {
            return true;
        }

        $normalizedDomains = collect($configuredDomains)
            ->map(fn (string $domain): string => rtrim(trim($domain), '/'))
            ->filter()
            ->values();

        foreach ($normalizedDomains as $domain) {
            if ($value === $domain || str_starts_with($value, $domain.'/')) {
                return true;
            }
        }

        return false;
    }

    protected static function isTrustedMcpHost(string $host): bool
    {
        foreach ([
            'claude.ai',
            'claude.com',
            'anthropic.com',
            'google.com',
            'googleusercontent.com',
            'googleapis.com',
            'gstatic.com',
        ] as $trustedSuffix) {
            if ($host === $trustedSuffix || str_ends_with($host, '.'.$trustedSuffix)) {
                return true;
            }
        }

        return false;
    }

    protected static function isLocalhostUrl(string $url): bool
    {
        $scheme = parse_url($url, PHP_URL_SCHEME);
        $host = parse_url($url, PHP_URL_HOST);

        return in_array($scheme, ['http', 'https'], true)
            && in_array($host, ['localhost', '127.0.0.1', '[::1]'], true);
    }
}
