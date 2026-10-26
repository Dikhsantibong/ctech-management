<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[IsDestructive]
#[Description('Menghapus data lewat aksi berjenis delete (mis. tasks.delete). Tidak bisa dibatalkan — selalu minta konfirmasi pengguna dan sebutkan data yang akan dihapus sebelum memanggil.')]
class DeleteDataTool extends ActionTool
{
    protected string $name = 'hapus-data';

    protected function kinds(): array
    {
        return [McpAction::DELETE];
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

        return $this->respond($this->runner->run(
            $user,
            $action,
            $this->arrayArgument($request, 'ids'),
            $this->arrayArgument($request, 'data'),
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
            'data' => $schema->object()->description('Hanya untuk aksi yang butuh data, mis. kpi.reset-target.'),
        ];
    }
}
