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
#[Description('Mulai dari sini. Menampilkan semua modul dan aksi aplikasi CTECH yang boleh dijalankan akun ini (sesuai hak akses menu), beserta id yang dibutuhkan setiap aksi.')]
class ListActionsTool extends ActionTool
{
    protected string $name = 'daftar-aksi';

    protected function kinds(): array
    {
        return [];
    }

    public function handle(Request $request): Response
    {
        $module = $request->get('module');
        $modules = ActionRegistry::modules();
        $available = $this->runner->availableFor($request->user(), is_string($module) && $module !== '' ? $module : null);

        if ($available === []) {
            return Response::error('Tidak ada aksi yang bisa diakses untuk modul ini dengan hak akses akun Anda.');
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
            'akun' => ['nama' => $request->user()->name, 'role' => $request->user()->role],
            'cara_pakai' => [
                'read' => 'jalankan dengan baca-data',
                'link' => 'jalankan dengan baca-data; hasilnya tautan unduhan',
                'write' => 'panggil detail-aksi untuk melihat field, lalu jalankan dengan simpan-data',
                'delete' => 'jalankan dengan hapus-data setelah pengguna mengonfirmasi',
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
