<?php

namespace App\Mcp\Support;

use Illuminate\Support\Str;
use Laravel\Passport\Bridge\Client;
use Laravel\Passport\Bridge\ClientRepository as BaseBridgeClientRepository;
use Laravel\Passport\Client as ClientModel;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Entities\ClientEntityInterface;

class McpBridgeClientRepository extends BaseBridgeClientRepository
{
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

        // Untuk authorization_code dan refresh_token, League OAuth2 langsung mendekripsi
        // payload code / refresh_token memakai kunci enkripsi server dan memverifikasi
        // bahwa payload tersebut benar-benar diterbitkan untuk client_id & redirect_uri ini.
        if (in_array($grantType, ['authorization_code', 'refresh_token'], true) &&
            (request()->filled('code') || request()->filled('refresh_token'))) {
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
            self::isAllowedRedirectUri($requestRedirectUri)) {
            $redirectUris[] = $requestRedirectUri;

            $model->forceFill([
                'redirect_uris' => array_values(array_unique($redirectUris)),
            ])->save();
        }

        if (request()->is('oauth/authorize') && $requestRedirectUri === null && count($redirectUris) > 1) {
            $redirectUris = [$redirectUris[0]];
        }

        $confidential = $model->confidential();

        if (request()->is('oauth/authorize') && ! request()->filled('code_challenge')) {
            $confidential = true;
        } elseif (request()->is('oauth/token') && ! $this->requestHasClientSecret() && (request()->filled('code') || request()->filled('refresh_token'))) {
            $confidential = false;
        }

        return new Client(
            $model->getKey(),
            $model->name,
            $redirectUris,
            $confidential,
            $model->provider,
            $model->grant_types
        );
    }

    /**
     * Cari atau (bila redirect_uri termasuk domain MCP resmi) buat record OAuth Client.
     */
    protected function resolveClientRecord(string $clientIdentifier): ?ClientModel
    {
        $id = self::sanitizeClientId($clientIdentifier);

        if ($id === '') {
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
            $redirectUri = $this->currentRedirectUri();

            if ($redirectUri !== null && self::isAllowedRedirectUri($redirectUri)) {
                $attributes = [
                    'name' => Str::isUuid($id)
                        ? (parse_url($redirectUri, PHP_URL_HOST) ?: 'MCP Client')
                        : $id,
                    'secret' => Str::random(40),
                    'provider' => null,
                    'redirect_uris' => [$redirectUri],
                    'grant_types' => ['authorization_code', 'refresh_token'],
                    'revoked' => false,
                ];

                if (Str::isUuid($id)) {
                    $attributes['id'] = $id;
                }

                /** @var ClientModel $record */
                $record = Passport::client()->newQuery()->forceCreate($attributes);
            }
        }

        return $record;
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

    protected function requestHasClientSecret(): bool
    {
        if (request()->filled('client_secret')) {
            return true;
        }

        $phpAuthPw = request()->server('PHP_AUTH_PW');
        if (is_string($phpAuthPw) && $phpAuthPw !== '') {
            return true;
        }

        $authHeader = (string) request()->header('Authorization', '');
        if (str_starts_with(strtolower($authHeader), 'basic ')) {
            $decoded = base64_decode(substr($authHeader, 6), true);
            if (is_string($decoded) && str_contains($decoded, ':')) {
                [, $password] = explode(':', $decoded, 2);

                return $password !== '';
            }
        }

        return false;
    }

    public static function isAllowedRedirectUri(string $value): bool
    {
        $scheme = parse_url($value, PHP_URL_SCHEME);

        if (! is_string($scheme) || $scheme === '') {
            return false;
        }

        if (! in_array($scheme, ['http', 'https'], true)) {
            /** @var array<int, string> $allowedSchemes */
            $allowedSchemes = config('mcp.custom_schemes', []);
            $host = parse_url($value, PHP_URL_HOST);

            return in_array($scheme, $allowedSchemes, true) && is_string($host) && $host !== '';
        }

        if (! Str::isUrl($value, ['http', 'https'])) {
            return false;
        }

        /** @var array<int, string> $configuredDomains */
        $configuredDomains = config('mcp.redirect_domains', []);

        if (in_array('*', $configuredDomains, true)) {
            return true;
        }

        if (self::hasLocalhostDomain($configuredDomains) && self::isLocalhostUrl($value)) {
            return true;
        }

        $normalizedDomains = collect($configuredDomains)
            ->map(fn (string $domain): string => rtrim($domain, '/'))
            ->filter()
            ->values();

        foreach ($normalizedDomains as $domain) {
            if ($value === $domain || str_starts_with($value, $domain.'/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<int, string>  $domains
     */
    protected static function hasLocalhostDomain(array $domains): bool
    {
        return collect($domains)->contains(fn (string $domain): bool => in_array(
            rtrim(Str::after($domain, '://'), '/'),
            ['localhost', '127.0.0.1', '[::1]'],
            true,
        ));
    }

    protected static function isLocalhostUrl(string $url): bool
    {
        $scheme = parse_url($url, PHP_URL_SCHEME);
        $host = parse_url($url, PHP_URL_HOST);

        return $scheme === 'http' && in_array($host, ['localhost', '127.0.0.1', '[::1]'], true);
    }
}
