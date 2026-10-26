<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Menghapus data lewat aksi berjenis delete (mis. tasks.delete, projects.delete, invoices.delete, content-plans.delete, dll.) berdasarkan parameter action dan ids (atau id).')]
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
            $this->idsArgument($request, $action),
            $this->dataArgument($request, $action),
        ));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'action' => $this->actionSchema($schema),
            'id' => $this->idSchema($schema),
            'ids' => $this->idsSchema($schema),
            'data' => $schema->object([
                'role' => $schema->string()->description('Role untuk aksi kpi.reset-target.'),
                'metric_key' => $schema->string()->description('Metric key untuk aksi kpi.reset-target.'),
            ])->description('Opsional, hanya untuk aksi yang butuh data tambahan seperti kpi.reset-target.'),
            'data_json' => $schema->string()->description('Opsional, alternatif data dalam bentuk JSON string.'),
        ];
    }
}
