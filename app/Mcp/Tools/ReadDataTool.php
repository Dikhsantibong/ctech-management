<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Description('Membaca data dari halaman aplikasi (aksi berjenis read) atau mengambil tautan unduhan PDF/berkas (aksi berjenis link). Datanya sama dengan yang tampil di halaman web.')]
class ReadDataTool extends ActionTool
{
    protected string $name = 'baca-data';

    protected function kinds(): array
    {
        return [McpAction::READ, McpAction::LINK];
    }

    public function handle(Request $request): Response
    {
        $action = $this->resolveAction($request);

        if ($action instanceof Response) {
            return $action;
        }

        $user = $this->resolveUser($request);

        if (! $user) {
            return Response::error('Koneksi belum terautentikasi.');
        }

        $only = array_values(array_filter($this->arrayArgument($request, 'only'), 'is_string'));
        $limit = max(5, min(200, (int) ($request->get('limit') ?? 50)));

        return $this->respond($this->runner->run(
            $user,
            $action,
            $this->arrayArgument($request, 'ids'),
            $this->arrayArgument($request, 'query'),
            $only,
            $limit,
        ));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'action' => $this->actionSchema($schema),
            'ids' => $this->idsSchema($schema),
            'query' => $schema->object()->description('Parameter halaman (lihat "parameter_query"), mis. {"search": "kopi", "page": 2}.'),
            'only' => $schema->array()->items($schema->string())->description('Opsional: hanya ambil props tertentu dari halaman, mis. ["tasks"].'),
            'limit' => $schema->integer()->description('Maksimal item per daftar (5-200, bawaan 50).'),
        ];
    }
}
