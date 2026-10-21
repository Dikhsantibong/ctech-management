<?php

namespace App\Mcp\Support;

use InvalidArgumentException;

/**
 * Aksi MCP dipanggil tanpa id yang dibutuhkan controller.
 */
class MissingIdException extends InvalidArgumentException {}
