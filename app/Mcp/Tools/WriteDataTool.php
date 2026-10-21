<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Membuat atau mengubah data lewat aksi berjenis write (mis. tasks.create, invoices.update, app-subscriptions.record-payment). Validasi, log aktivitas, dan perhitungannya sama dengan aplikasi web. Bila gagal, tidak ada data yang tersimpan.')]
class WriteDataTool extends ActionTool
{
    protected string $name = 'simpan-data';

    protected function kinds(): array
    {
        return [McpAction::WRITE];
    }

    public function handle(Request $request): Response
    {
        $action = $this->resolveAction($request);

        if ($action instanceof Response) {
            return $action;
        }

        return $this->respond($this->runner->run(
            $request->user(),
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
            'data' => $schema->object()->description('Isi field sesuai detail-aksi, mis. {"status": "Done"}.'),
        ];
    }
}
