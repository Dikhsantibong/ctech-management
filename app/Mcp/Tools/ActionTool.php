<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\ActionRegistry;
use App\Mcp\Support\ActionRunner;
use App\Mcp\Support\McpAction;
use App\Models\User;
use App\Support\MenuRegistry;
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
    private const RESERVED_ARGS = [
        'action',
        'ids',
        'id',
        'data',
        'data_json',
        'query',
        'only',
        'limit',
    ];

    /**
     * Seluruh nama parameter ID yang digunakan di ActionRegistry.
     * Dideklarasikan eksplisit di JSON Schema agar Gemini (yang mewajibkan
     * `properties` pada `type: object`) dapat mengisi ID saat ubah/hapus data.
     *
     * @var array<int, string>
     */
    protected const ID_KEYS = [
        'id',
        'project',
        'projectId',
        'task',
        'work',
        'invoice',
        'quotation',
        'client',
        'prospect',
        'activity',
        'announcement',
        'meeting',
        'document',
        'letter',
        'incoming_letter',
        'file',
        'user',
        'app_subscription',
        'payment',
        'category',
        'contentPlan',
        'news',
        'portfolio',
        'platform',
        'revisionId',
        'feedbackId',
    ];

    public function __construct(protected ActionRunner $runner) {}

    /**
     * Jenis aksi yang boleh dijalankan tool ini.
     *
     * @return array<int, string>
     */
    abstract protected function kinds(): array;

    public function shouldRegister(Request $request): bool
    {
        return true;
    }

    /**
     * Ambil user dari koneksi OAuth/Bearer, dari konfigurasi `mcp.local_user`,
     * atau fallback ke akun direktur utama bila token bersifat client_credentials/lokal.
     */
    protected function resolveUser(Request $request): ?User
    {
        $user = $request->user();

        if ($user instanceof User) {
            return $user;
        }

        $localUser = config('mcp.local_user');

        if (is_string($localUser) || is_int($localUser)) {
            $identifier = trim((string) $localUser);

            if ($identifier !== '') {
                $found = ctype_digit($identifier)
                    ? User::find((int) $identifier)
                    : User::where('email', $identifier)->first();

                if ($found instanceof User) {
                    return $found;
                }
            }
        }

        return User::where('role', MenuRegistry::SUPER_ROLE)->first()
            ?? User::orderBy('id')->first();
    }

    /**
     * Cari aksi, pastikan bukan modul pesan (chat), dan pastikan jenisnya cocok dengan tool ini.
     */
    protected function resolveAction(Request $request): McpAction|Response
    {
        $key = trim((string) $request->get('action', ''));
        $lowerKey = strtolower($key);

        foreach (['chat', 'chats', 'pesan', 'messages', 'conversation', 'conversations'] as $forbidden) {
            if ($lowerKey === $forbidden || str_starts_with($lowerKey, $forbidden.'.') || str_starts_with($lowerKey, $forbidden.'-')) {
                return Response::error('Modul Pesan/Chat bersifat pribadi dan tidak dapat diakses melalui MCP.');
            }
        }

        $action = ActionRegistry::find($key);

        if (! $action) {
            return Response::error("Aksi \"{$key}\" tidak dikenal. Panggil daftar-aksi untuk melihat aksi yang tersedia.");
        }

        if (ActionRunner::isForbiddenChatAction($action)) {
            return Response::error('Modul Pesan/Chat bersifat pribadi dan tidak dapat diakses melalui MCP.');
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
     * Ambil argumen array/object dari request; otomatis decode bila dikirim sebagai JSON string.
     *
     * @return array<string, mixed>
     */
    protected function arrayArgument(Request $request, string $key): array
    {
        $value = $request->get($key);

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value) && trim($value) !== '') {
            $decoded = json_decode(trim($value), true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }

    /**
     * Ambil peta ID dari argumen `ids`, `id`, maupun parameter tingkat atas.
     *
     * @return array<string, mixed>
     */
    protected function idsArgument(Request $request, ?McpAction $action = null): array
    {
        $ids = $this->arrayArgument($request, 'ids');
        $rawIds = $request->get('ids');

        if ($ids === [] && (is_int($rawIds) || (is_string($rawIds) && ctype_digit(trim($rawIds))))) {
            $ids['id'] = trim((string) $rawIds);
        }

        $topId = $request->get('id');
        if (($topId !== null && $topId !== '') && ! isset($ids['id'])) {
            $ids['id'] = $topId;
        }

        foreach (self::ID_KEYS as $idKey) {
            $topVal = $request->get($idKey);
            if ($topVal !== null && $topVal !== '' && ! isset($ids[$idKey])) {
                $ids[$idKey] = $topVal;
            }
        }

        if ($action !== null && count($action->bindings) === 1) {
            $primary = array_key_first($action->bindings);

            if ($primary !== null && (! isset($ids[$primary]) || $ids[$primary] === '') && isset($ids['id']) && $ids['id'] !== '') {
                $ids[$primary] = $ids['id'];
            }
        }

        return $ids;
    }

    /**
     * Ambil payload data untuk simpan-data / hapus-data (mendukung objek `data`,
     * string JSON `data_json`, maupun field yang dikirim sebagai JSON string).
     *
     * @return array<string, mixed>
     */
    protected function dataArgument(Request $request, ?McpAction $action = null): array
    {
        $data = $this->arrayArgument($request, 'data');
        $fromJson = $this->arrayArgument($request, 'data_json');

        if ($fromJson !== []) {
            $data = array_replace($fromJson, $data);
        }

        $bindingKeys = $action !== null ? array_keys($action->bindings) : [];

        foreach ($request->all() as $key => $value) {
            if (! is_string($key) || in_array($key, self::RESERVED_ARGS, true) || in_array($key, $bindingKeys, true)) {
                continue;
            }

            if (! array_key_exists($key, $data)) {
                $data[$key] = $value;
            }
        }

        return $data;
    }

    protected function actionSchema(JsonSchema $schema): Type
    {
        return $schema->string()
            ->description('Kunci aksi dari daftar-aksi, mis. "tasks.update", "tasks.delete", atau "invoices.create".')
            ->required();
    }

    protected function idSchema(JsonSchema $schema): Type
    {
        return $schema->integer()
            ->description('Opsional: ID numerik utama bila aksi hanya membutuhkan satu ID (mis. 12). Alternatif langsung dari parameter ids.');
    }

    protected function idsSchema(JsonSchema $schema): Type
    {
        $properties = [];

        foreach (self::ID_KEYS as $key) {
            $properties[$key] = $key === 'platform'
                ? $schema->string()->description('Nama platform media sosial (instagram, facebook, linkedin, tiktok, youtube, x)')
                : $schema->integer()->description("ID numerik untuk {$key}");
        }

        return $schema->object($properties)
            ->description('Objek berisi ID yang dibutuhkan aksi (lihat "butuh_id" di daftar-aksi), mis. {"task": 12} atau {"project": 3, "feedbackId": 7}.');
    }
}
