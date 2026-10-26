<?php

use App\Mcp\Servers\CtechServer;
use Illuminate\Support\Facades\Route;
use Laravel\Mcp\Facades\Mcp;
use Laravel\Mcp\Server\Registrar;

$authServerMetadata = static fn (): array => [
    'issuer' => config('mcp.authorization_server') ?? url('/'),
    'authorization_endpoint' => route('passport.authorizations.authorize'),
    'token_endpoint' => route('passport.token'),
    'registration_endpoint' => url('oauth/register'),
    'response_types_supported' => ['code'],
    'code_challenge_methods_supported' => ['S256', 'plain'],
    'token_endpoint_auth_methods_supported' => ['none', 'client_secret_post', 'client_secret_basic'],
    'scopes_supported' => [Registrar::OAUTH_SCOPE],
    'grant_types_supported' => ['authorization_code', 'refresh_token'],
];

// Endpoint discovery OAuth (.well-known/*) dan pendaftaran client dinamis (/oauth/register)
Mcp::oauthRoutes();

Route::get('/.well-known/oauth-authorization-server', static fn () => response()->json($authServerMetadata()))
    ->name('mcp.oauth.authorization-server');

Route::get('/.well-known/oauth-authorization-server/{path}', static fn (string $path) => response()->json($authServerMetadata()))
    ->where('path', '.*')
    ->name('mcp.oauth.authorization-server.nested');

Mcp::web('/mcp', CtechServer::class)
    ->middleware(['auth:api', 'throttle:60,1']);

// Server MCP lokal berbasis STDIO (`php artisan mcp:start ctech`) untuk Gemini CLI / Antigravity / Claude Code
Mcp::local('ctech', CtechServer::class);
