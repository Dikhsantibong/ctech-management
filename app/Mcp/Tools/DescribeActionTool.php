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
#[Description('Menampilkan field dan aturan validasi sebuah aksi, diambil langsung dari aplikasi. Panggil sebelum simpan-data atau hapus-data agar data yang dikirim benar.')]
class DescribeActionTool extends ActionTool
{
    protected string $name = 'detail-aksi';

    protected function kinds(): array
    {
        return [McpAction::READ, McpAction::LINK, McpAction::WRITE, McpAction::DELETE];
    }

    public function handle(Request $request): Response
    {
        $action = $this->resolveAction($request);

        if ($action instanceof Response) {
            return $action;
        }

        $user = $this->resolveUser($request);

        if ($reason = $this->runner->denialReason($user, $action)) {
            return Response::error($reason);
        }

        $detail = $action->summary();

        if (in_array($action->kind, [McpAction::WRITE, McpAction::DELETE], true)) {
            $rules = $this->runner->rules($user, $action, $this->arrayArgument($request, 'ids'));

            $detail['field'] = $rules ?? 'Aksi ini tidak membutuhkan data tambahan, atau aturannya diperiksa saat dijalankan.';

            if ($action->prefill !== null || $action->prefillExtra !== null) {
                $detail['catatan'] = 'Cukup kirim field yang berubah. Field lain otomatis memakai nilai yang tersimpan.';
            }
        }

        return Response::json($detail);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'action' => $this->actionSchema($schema),
            'ids' => $this->idsSchema($schema),
        ];
    }
}
