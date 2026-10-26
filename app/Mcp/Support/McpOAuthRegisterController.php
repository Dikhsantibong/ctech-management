<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use Illuminate\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Mcp\Server\Http\Controllers\OAuthRegisterController;
use Laravel\Mcp\Server\Registrar;
use Laravel\Passport\ClientRepository;
use Throwable;

class McpOAuthRegisterController extends OAuthRegisterController
{
    /**
     * Register a new OAuth client for a third-party application (Claude, Gemini, dsb.).
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_name' => ['nullable', 'string', 'min:1', 'max:255'],
            'name' => ['nullable', 'string', 'min:1', 'max:255'],
            'token_endpoint_auth_method' => ['nullable', 'string', 'in:none,client_secret_post,client_secret_basic'],
            'redirect_uris' => ['required', 'array', 'min:1'],
            'redirect_uris.*' => ['required', 'string', function (string $attribute, mixed $value, callable $fail): void {
                if (! is_string($value) || ! $this->isValidRedirectUri($value)) {
                    $fail($attribute.' is not a valid URL.');

                    return;
                }

                if (! McpBridgeClientRepository::isAllowedRedirectUri($value)) {
                    $fail($attribute.' is not a permitted redirect domain.');
                }
            }],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();

            $isRedirectError = collect($errors->keys())->contains(
                fn (string $key): bool => str_starts_with($key, 'redirect_uris')
            );

            return response()->json([
                'error' => $isRedirectError ? 'invalid_redirect_uri' : 'invalid_client_metadata',
                'error_description' => $errors->first(),
            ], 400);
        }

        $validated = $validator->validated();
        $authMethod = (string) ($validated['token_endpoint_auth_method'] ?? 'none');
        $confidential = in_array($authMethod, ['client_secret_post', 'client_secret_basic'], true);

        /** @var ClientRepository $clients */
        $clients = Container::getInstance()->make(ClientRepository::class);

        try {
            $client = $clients->createAuthorizationCodeGrantClient(
                name: $this->resolveClientName($validated),
                redirectUris: $validated['redirect_uris'],
                confidential: $confidential,
                enableDeviceFlow: false,
            );

            $this->grantMcpScope($client);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'error' => 'server_error',
                'error_description' => 'The client could not be registered.',
            ], 500);
        }

        $payload = [
            'client_id' => (string) $client->id,
            'grant_types' => $client->grant_types,
            'response_types' => ['code'],
            'redirect_uris' => $client->redirect_uris,
            'scope' => Registrar::OAUTH_SCOPE,
            'token_endpoint_auth_method' => $authMethod,
        ];

        if ($confidential) {
            $payload['client_secret'] = (string) $client->plainSecret;
            $payload['client_secret_expires_at'] = 0;
        }

        return response()->json($payload, 201);
    }
}
