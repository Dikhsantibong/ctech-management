<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\ActionRegistry;
use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('Mulai dari sini. Menampilkan semua modul dan aksi aplikasi CTECH (baca, buat, ubah, hapus) yang tersedia beserta ID yang dibutuhkan setiap aksi. Modul pesan (chat) tidak disertakan.')]
class ListActionsTool extends ActionTool
{
    protected string $name = 'daftar-aksi';

    protected function kinds(): array
    {
        return [];
    }

    public function handle(Request $request): Response
    {
        $user = $this->resolveUser($request);

        if (! $user) {
            return Response::error('Koneksi belum terautentikasi.');
        }

        $module = $request->get('module');
        if (is_string($module) && in_array(strtolower(trim($module)), ['chat', 'chats', 'pesan', 'messages', 'conversations'], true)) {
            return Response::error('Modul Pesan/Chat bersifat pribadi dan tidak dapat diakses melalui MCP.');
        }

        $modules = ActionRegistry::modules();
        $available = $this->runner->availableFor($user, is_string($module) && $module !== '' ? $module : null);

        if ($available === []) {
            return Response::error('Tidak ada aksi yang ditemukan untuk modul tersebut.');
        }

        $result = [];

        foreach ($available as $key => $actions) {
            $result[] = [
                'modul' => $key,
                'nama' => $modules[$key] ?? $key,
                'aksi' => array_map(fn (McpAction $action): array => $action->summary(), $actions),
            ];
        }

        return Response::json([
            'akun' => ['nama' => $user->name, 'role' => $user->role, 'akses_mcp' => 'full_access'],
            'cara_pakai' => [
                'read' => 'jalankan dengan baca-data',
                'link' => 'jalankan dengan baca-data; hasilnya tautan unduhan',
                'write' => 'jalankan dengan simpan-data (kirim field di parameter data atau data_json, serta ID di ids atau id)',
                'delete' => 'jalankan dengan hapus-data (kirim action dan ID di ids atau id)',
            ],
            'modul' => $result,
        ]);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'module' => $schema->string()->enum(array_keys(ActionRegistry::modules()))
                ->description('Opsional: tampilkan satu modul saja.'),
        ];
    }
}
