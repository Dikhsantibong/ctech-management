<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Redirect Domains
    |--------------------------------------------------------------------------
    |
    | These domains are the domains that OAuth clients are permitted to use
    | for redirect URIs. Each domain should be specified with its scheme
    | and host. Domains not in this list will raise validation errors.
    |
    | An "*" may be used to allow all domains.
    |
    */

    // Connector Claude (claude.ai / claude.com, termasuk Cowork) dan Gemini
    // (Gemini Enterprise/Vertex AI, Gemini Web, AI Studio, serta Gemini CLI/lokal)
    // yang boleh mendaftar sebagai client OAuth. Tambahkan domain lain bila perlu.
    'redirect_domains' => array_filter(array_map('trim', explode(',', env(
        'MCP_REDIRECT_DOMAINS',
        'https://claude.ai,https://claude.com,https://gemini.google.com,https://aistudio.google.com,https://vertexaisearch.cloud.google.com,https://console.cloud.google.com,https://developers.google.com,https://oauth-redirect.googleusercontent.com,http://localhost,http://127.0.0.1',
    )))),

    /*
    |--------------------------------------------------------------------------
    | Local STDIO User
    |--------------------------------------------------------------------------
    |
    | Email atau ID user yang dipakai saat server MCP dijalankan secara lokal
    | lewat STDIO (`php artisan mcp:start ctech`), misalnya dari Gemini CLI,
    | Antigravity, atau Claude Code.
    |
    */

    'local_user' => env('MCP_USER_EMAIL', env('MCP_USER_ID')),

    /*
    |--------------------------------------------------------------------------
    | Allowed Custom Schemes
    |--------------------------------------------------------------------------
    |
    | Native desktop OAuth clients like Cursor and VS Code use private-use URI
    | schemes (RFC 8252) for redirect callbacks instead of standard schemes
    | like HTTPS. Here, you may list which custom schemes you will allow.
    |
    */

    'custom_schemes' => [
        // 'claude',
        // 'cursor',
        // 'vscode',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authorization Server
    |--------------------------------------------------------------------------
    |
    | Here you may configure the OAuth authorization server issuer identifier
    | per RFC 8414. This value appears in your protected resource and auth
    | server metadata endpoints. When null, this defaults to `url('/')`.
    |
    */

    'authorization_server' => null,

    /*
    |--------------------------------------------------------------------------
    | Tool Search
    |--------------------------------------------------------------------------
    |
    | Here you may configure the limits enforced during tool search. The maximum
    | number of tool calls limits how many tools each search request can run
    | while the maximum output bytes value caps the size of every result.
    |
    */

    'tool_search' => [
        'max_tool_calls' => 10,
        'max_output_bytes' => 65_536,
    ],

];
