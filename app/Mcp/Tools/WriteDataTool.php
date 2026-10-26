<?php

namespace App\Mcp\Tools;

use App\Mcp\Support\McpAction;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Membuat atau mengubah data lewat aksi berjenis write (mis. tasks.create, tasks.update, projects.create, projects.update, invoices.create, invoices.update, content-plans.update, announcements.create, dll.). Akses penuh tersedia untuk seluruh modul bisnis.')]
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
            'data' => $this->dataSchema($schema),
            'data_json' => $schema->string()->description('Alternatif/pelengkap parameter data: kirim data sebagai JSON string, mis. "{\"status\":\"Done\",\"title\":\"Judul Baru\"}".'),
        ];
    }

    protected function dataSchema(JsonSchema $schema): Type
    {
        $str = [
            'title', 'name', 'project_name', 'client_name', 'company_name', 'brand_name',
            'description', 'content', 'summary', 'notes', 'note',
            'status', 'priority', 'stage', 'category', 'type', 'project_type',
            'platform', 'content_type', 'start_date', 'end_date', 'deadline', 'due_date',
            'issue_date', 'valid_until', 'scheduled_date', 'scheduled_time', 'scheduled_at',
            'published_date', 'published_at', 'letter_date', 'received_date', 'completion_date',
            'expected_close_date', 'next_follow_up_at', 'follow_up_date', 'paid_at', 'expires_at',
            'date', 'period', 'email', 'company_email', 'pic_email', 'client_email', 'account_email',
            'phone', 'company_phone', 'company_whatsapp', 'pic_phone', 'pic_whatsapp', 'client_phone',
            'address', 'client_address', 'recipient_address', 'city', 'province', 'country', 'website',
            'pic_name', 'pic_position', 'pic_linkedin', 'source', 'industry', 'company_type',
            'products_interest', 'next_action', 'follow_up_action', 'outcome',
            'subject', 'recipient', 'recipient_position', 'recipient_company', 'sender',
            'reference_number', 'disposition', 'classification', 'signatory_name', 'signatory_position',
            'caption', 'hashtags', 'target_audience', 'excerpt', 'project_url', 'technologies',
            'app_name', 'vendor_name', 'billing_cycle', 'currency', 'payment_method', 'period_covered',
            'color', 'location', 'meeting_link', 'agenda', 'minutes', 'action_item',
            'feedback', 'revision_note', 'folder_name', 'tech_stack', 'repository_url', 'domain_url',
            'design_url', 'structure_notes', 'tasks_completed', 'blockers', 'plans_tomorrow', 'mood',
            'role', 'metric_key', 'password', 'position', 'department', 'leader_name',
            'account_name', 'account_id', 'access_token', 'refresh_token',
        ];

        $num = [
            'project_id', 'milestone_id', 'user_id', 'sales_id', 'assigned_to', 'category_id',
            'prospect_id', 'parent_id', 'progress', 'budget', 'contract_value', 'cost', 'profit',
            'estimated_value', 'amount', 'price', 'quantity', 'discount', 'tax_rate', 'target',
            'attachment_count',
        ];

        $bool = ['use_tax', 'auto_publish', 'auto_renew', 'is_active', 'is_featured', 'enabled'];

        $arr = [
            'items', 'members', 'collaborators', 'attendees', 'checklist', 'needs',
            'menus', 'target_roles', 'visible_to_roles', 'platforms', 'bank_accounts', 'credentials',
        ];

        $properties = [];

        foreach ($str as $field) {
            $properties[$field] = $schema->string();
        }

        foreach ($num as $field) {
            $properties[$field] = $schema->number();
        }

        foreach ($bool as $field) {
            $properties[$field] = $schema->boolean();
        }

        foreach ($arr as $field) {
            $properties[$field] = $schema->array();
        }

        return $schema->object($properties)
            ->description('Field data yang ingin disimpan atau diubah sesuai detail-aksi, mis. {"status": "Done", "title": "Update"}. Untuk update, cukup kirim field yang ingin diubah.');
    }
}
