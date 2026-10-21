<?php

namespace App\Mcp\Support;

use Closure;

/**
 * Satu aksi aplikasi yang bisa dijalankan Claude lewat MCP.
 *
 * Aksi selalu menunjuk ke method controller yang sudah dipakai halaman web,
 * jadi validasi, log aktivitas, dan perhitungan bisnisnya identik.
 */
final class McpAction
{
    public const READ = 'read';

    public const WRITE = 'write';

    public const DELETE = 'delete';

    public const LINK = 'link';

    public string $key = '';

    public string $module = '';

    /**
     * @param  array{0: class-string, 1: string}|Closure|null  $handler
     * @param  array<string, class-string|null>  $bindings  nama parameter controller => model (null = id biasa)
     * @param  array<string, string>  $query  parameter query yang didukung halaman baca
     * @param  string|null  $prefill  nama binding model yang nilainya dipakai sebagai nilai awal saat update
     * @param  Closure|null  $prefillExtra  nilai awal tambahan (relasi/item) di luar kolom model
     * @param  Closure|null  $url  pembuat tautan untuk aksi LINK
     */
    public function __construct(
        public readonly string $kind,
        public readonly string $menu,
        public readonly string $label,
        public readonly array|Closure|null $handler = null,
        public readonly array $bindings = [],
        public readonly array $query = [],
        public readonly ?string $prefill = null,
        public readonly ?Closure $prefillExtra = null,
        public readonly ?string $role = null,
        public readonly ?Closure $url = null,
    ) {}

    /**
     * @param  array{0: class-string, 1: string}|Closure  $handler
     * @param  array<string, class-string|null>  $bindings
     * @param  array<string, string>  $query
     */
    public static function read(string $menu, string $label, array|Closure $handler, array $bindings = [], array $query = [], ?string $role = null): self
    {
        return new self(self::READ, $menu, $label, $handler, $bindings, $query, role: $role);
    }

    /**
     * @param  array{0: class-string, 1: string}  $handler
     * @param  array<string, class-string|null>  $bindings
     */
    public static function write(string $menu, string $label, array $handler, array $bindings = [], ?string $prefill = null, ?Closure $prefillExtra = null, ?string $role = null): self
    {
        return new self(self::WRITE, $menu, $label, $handler, $bindings, prefill: $prefill, prefillExtra: $prefillExtra, role: $role);
    }

    /**
     * @param  array{0: class-string, 1: string}  $handler
     * @param  array<string, class-string|null>  $bindings
     */
    public static function delete(string $menu, string $label, array $handler, array $bindings = [], ?string $role = null): self
    {
        return new self(self::DELETE, $menu, $label, $handler, $bindings, role: $role);
    }

    /**
     * @param  array<string, class-string|null>  $bindings
     */
    public static function link(string $menu, string $label, Closure $url, array $bindings = []): self
    {
        return new self(self::LINK, $menu, $label, bindings: $bindings, url: $url);
    }

    public function withKey(string $module, string $key): self
    {
        $this->module = $module;
        $this->key = $key;

        return $this;
    }

    /**
     * Ringkasan untuk daftar aksi.
     *
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        return array_filter([
            'aksi' => $this->key,
            'jenis' => $this->kind,
            'keterangan' => $this->label,
            'butuh_id' => array_keys($this->bindings) ?: null,
            'parameter_query' => $this->query ?: null,
            'khusus_role' => $this->role,
        ], fn (mixed $value): bool => $value !== null);
    }
}
