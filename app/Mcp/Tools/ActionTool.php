<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\ActionRegistry;
use App\Mcp\Support\ActionRunner;
use App\Mcp\Support\McpAction;
use App\Models\User;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

/**
 * Dasar tool yang menjalankan aksi dari ActionRegistry.
 */
abstract class ActionTool extends Tool
{
    public function __construct(protected ActionRunner $runner) {}

    /**
     * Jenis aksi yang boleh dijalankan tool ini.
     *
     * @return array<int, string>
     */
    abstract protected function kinds(): array;

    public function shouldRegister(Request $request): bool
    {
        return $this->resolveUser($request) !== null;
    }

    /**
     * Ambil user dari koneksi OAuth/Bearer atau dari konfigurasi `mcp.local_user`
     * saat dijalankan lewat STDIO lokal (`php artisan mcp:start ctech`).
     */
    protected function resolveUser(Request $request): ?User
    {
        $user = $request->user();

        if ($user instanceof User) {
            return $user;
        }

        $localUser = config('mcp.local_user');

        if (! is_string($localUser) && ! is_int($localUser)) {
            return null;
        }

        $identifier = trim((string) $localUser);

        if ($identifier === '') {
            return null;
        }

        return ctype_digit($identifier)
            ? User::find((int) $identifier)
            : User::where('email', $identifier)->first();
    }

    /**
     * Cari aksi dan pastikan jenisnya cocok dengan tool ini.
     */
    protected function resolveAction(Request $request): McpAction|Response
    {
        $key = (string) $request->get('action', '');
        $action = ActionRegistry::find($key);

        if (! $action) {
            return Response::error("Aksi \"{$key}\" tidak dikenal. Panggil daftar-aksi untuk melihat aksi yang tersedia.");
        }

        if (! in_array($action->kind, $this->kinds(), true)) {
            $tool = match ($action->kind) {
                McpAction::READ, McpAction::LINK => 'baca-data',
                McpAction::WRITE => 'simpan-data',
                McpAction::DELETE => 'hapus-data',
            };

            return Response::error("Aksi {$key} berjenis {$action->kind}; jalankan dengan tool {$tool}.");
        }

        return $action;
    }

    /**
     * @param  array<string, mixed>  $result
     */
    protected function respond(array $result): Response
    {
        $ok = (bool) ($result['ok'] ?? false);
        unset($result['ok']);

        if (! $ok) {
            return Response::error((string) json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }

        return Response::json($result + ['berhasil' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function arrayArgument(Request $request, string $key): array
    {
        $value = $request->get($key);

        return is_array($value) ? $value : [];
    }

    protected function actionSchema(JsonSchema $schema): Type
    {
        return $schema->string()
            ->description('Kunci aksi dari daftar-aksi, mis. "tasks.update" atau "invoices.create".')
            ->required();
    }

    protected function idsSchema(JsonSchema $schema): Type
    {
        return $schema->object()
            ->description('Id yang dibutuhkan aksi (lihat "butuh_id"), mis. {"task": 12} atau {"project": 3, "feedbackId": 7}.');
    }
}
