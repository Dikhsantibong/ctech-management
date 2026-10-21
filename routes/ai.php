<?php

use App\Mcp\Servers\CtechServer;
use Laravel\Mcp\Facades\Mcp;

// Endpoint discovery OAuth (.well-known/*) dan pendaftaran client dinamis (/oauth/register)
Mcp::oauthRoutes();

Mcp::web('/mcp', CtechServer::class)
    ->middleware(['auth:api', 'throttle:60,1']);
