<?php

namespace Tests\Feature;

use App\Mcp\Servers\CtechServer;
use App\Mcp\Support\ActionRegistry;
use App\Mcp\Support\McpAction;
use App\Mcp\Tools\DeleteDataTool;
use App\Mcp\Tools\DescribeActionTool;
use App\Mcp\Tools\ListActionsTool;
use App\Mcp\Tools\ReadDataTool;
use App\Mcp\Tools\WriteDataTool;
use App\Models\ActivityLog;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use ReflectionMethod;
use Tests\TestCase;

class McpServerTest extends TestCase
{
    use RefreshDatabase;

    private function director(): User
    {
        return User::factory()->create(['role' => MenuRegistry::SUPER_ROLE]);
    }

    /**
     * @param  array<int, string>  $menus
     */
    private function operationWithMenus(array $menus): User
    {
        app(MenuAccess::class)->sync('operation', $menus);

        return User::factory()->create(['role' => 'operation']);
    }

    private function project(): Project
    {
        return Project::create([
            'project_name' => 'Website Klien',
            'client_name' => 'PT Klien',
            'start_date' => '2026-10-01',
            'deadline' => '2026-12-31',
            'status' => 'Progress',
            'project_type' => 'Website',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rpc(string $method, array $params = []): array
    {
        return ['jsonrpc' => '2.0', 'id' => 1, 'method' => $method, 'params' => $params];
    }

    // ===== Koneksi & OAuth =====

    public function test_mcp_endpoint_rejects_requests_without_oauth_token(): void
    {
        $this->postJson('/mcp', $this->rpc('tools/list'))
            ->assertUnauthorized()
            ->assertHeader('WWW-Authenticate');
    }

    public function test_oauth_discovery_metadata_points_to_passport_endpoints(): void
    {
        $this->getJson('/.well-known/oauth-authorization-server')
            ->assertOk()
            ->assertJsonPath('authorization_endpoint', url('/oauth/authorize'))
            ->assertJsonPath('token_endpoint', url('/oauth/token'))
            ->assertJsonPath('registration_endpoint', url('/oauth/register'));

        $this->getJson('/.well-known/oauth-protected-resource/mcp')
            ->assertOk()
            ->assertJsonPath('resource', url('/mcp'));
    }

    public function test_dynamic_registration_only_accepts_claude_redirects(): void
    {
        $this->postJson('/oauth/register', [
            'client_name' => 'Klien Asing',
            'redirect_uris' => ['https://evil.example.com/callback'],
        ])->assertStatus(400)->assertJsonPath('error', 'invalid_redirect_uri');

        $this->postJson('/oauth/register', [
            'client_name' => 'Claude',
            'redirect_uris' => ['https://claude.ai/api/mcp/auth_callback'],
        ])->assertCreated()->assertJsonStructure(['client_id']);

        $this->postJson('/oauth/register', [
            'client_name' => 'Gemini Enterprise',
            'redirect_uris' => ['https://vertexaisearch.cloud.google.com/oauth-redirect'],
        ])->assertCreated()->assertJsonStructure(['client_id']);

        $this->postJson('/oauth/register', [
            'client_name' => 'Gemini CLI',
            'redirect_uris' => ['http://localhost:7777/oauth/callback'],
        ])->assertCreated()->assertJsonStructure(['client_id']);
    }

    public function test_claude_client_command_creates_confidential_client(): void
    {
        $this->artisan('mcp:claude-client', ['--name' => 'Claude Uji'])
            ->expectsOutputToContain('OAuth Client Secret')
            ->assertSuccessful();

        $client = Client::where('name', 'Claude Uji')->firstOrFail();

        $this->assertTrue($client->confidential());
        $this->assertContains('https://claude.ai/api/mcp/auth_callback', $client->redirect_uris);
        $this->assertTrue($client->hasScope('mcp:use'));
    }

    public function test_gemini_client_command_creates_oauth_client_and_optional_bearer_token(): void
    {
        $director = $this->director();

        $this->artisan('mcp:gemini-client', [
            '--name' => 'Gemini Uji',
            '--user' => $director->email,
        ])
            ->expectsOutputToContain('OAuth Client Secret')
            ->expectsOutputToContain('Bearer Token')
            ->assertSuccessful();

        $client = Client::where('name', 'Gemini Uji')->firstOrFail();

        $this->assertTrue($client->confidential());
        $this->assertContains('https://vertexaisearch.cloud.google.com/oauth-redirect', $client->redirect_uris);
        $this->assertContains('https://gemini.google.com/api/mcp/auth_callback', $client->redirect_uris);
        $this->assertContains('http://localhost:7777/oauth/callback', $client->redirect_uris);
        $this->assertTrue($client->hasScope('mcp:use'));
        $this->assertSame(1, $director->tokens()->where('name', 'Gemini Uji')->count());
    }

    public function test_local_stdio_user_config_allows_tools_without_http_session(): void
    {
        $director = $this->director();
        config(['mcp.local_user' => $director->email]);

        CtechServer::tool(ListActionsTool::class)
            ->assertOk()
            ->assertSee($director->name)
            ->assertSee('projects.list');
    }

    public function test_oauth_flow_works_for_both_claude_and_gemini_without_invalid_client(): void
    {
        $director = $this->director();

        // 1. Buat client lewat mcp:claude-client
        $this->artisan('mcp:claude-client', ['--name' => 'Claude Utama'])->assertSuccessful();
        $claudeClient = Client::where('name', 'Claude Utama')->firstOrFail();

        // 2. Client yang sama dipakai untuk callback Claude maupun callback Gemini & localhost port dinamis
        foreach ([
            'https://claude.ai/api/mcp/auth_callback',
            'https://vertexaisearch.cloud.google.com/oauth-redirect',
            'https://gemini.google.com/api/mcp/auth_callback',
            'http://localhost:54321/oauth/callback',
        ] as $redirectUri) {
            $authorizeResponse = $this->actingAs($director)->get('/oauth/authorize?'.http_build_query([
                'response_type' => 'code',
                'client_id' => '...'.$claudeClient->id.' ',
                'redirect_uri' => $redirectUri,
                'scope' => 'mcp:use',
                'state' => 'state-123',
                'prompt' => 'consent',
            ]));

            $authorizeResponse->assertOk();
            $authToken = session('authToken');
            $this->assertNotEmpty($authToken);

            $approveResponse = $this->actingAs($director)->post('/oauth/authorize', [
                'state' => 'state-123',
                'client_id' => $claudeClient->id,
                'auth_token' => $authToken,
            ]);

            $approveResponse->assertRedirect();
            $location = (string) $approveResponse->headers->get('Location');
            $this->assertStringStartsWith($redirectUri, $location);

            parse_str((string) parse_url($location, PHP_URL_QUERY), $query);
            $this->assertArrayHasKey('code', $query);
            $this->assertSame('state-123', $query['state'] ?? null);

            $tokenResponse = $this->postJson('/oauth/token', [
                'grant_type' => 'authorization_code',
                'client_id' => ' '.$claudeClient->id.'...',
                'client_secret' => 'secret-bebas-atau-terformat',
                'redirect_uri' => $redirectUri,
                'code' => $query['code'],
            ]);

            $tokenResponse->assertOk()->assertJsonStructure(['access_token', 'token_type']);
        }

        // 3. Auto-provision bila client_id belum ada di DB tetapi redirect_uri berasal dari domain resmi Gemini
        $autoAuthorize = $this->actingAs($director)->get('/oauth/authorize?'.http_build_query([
            'response_type' => 'code',
            'client_id' => 'gemini-custom-connector',
            'redirect_uri' => 'https://vertexaisearch.cloud.google.com/oauth-redirect',
            'scope' => 'mcp:use',
            'state' => 'gemini-state',
        ]));

        $autoAuthorize->assertOk();
        $autoClient = Client::where('name', 'gemini-custom-connector')->firstOrFail();

        $autoApprove = $this->actingAs($director)->post('/oauth/authorize', [
            'state' => 'gemini-state',
            'client_id' => $autoClient->id,
            'auth_token' => session('authToken'),
        ]);
        $autoApprove->assertRedirect();
        parse_str((string) parse_url((string) $autoApprove->headers->get('Location'), PHP_URL_QUERY), $autoQuery);

        $this->postJson('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => 'gemini-custom-connector',
            'client_secret' => 'custom-secret',
            'redirect_uri' => 'https://vertexaisearch.cloud.google.com/oauth-redirect',
            'code' => $autoQuery['code'],
        ])->assertOk()->assertJsonStructure(['access_token']);

        // 4. Redirect URI asing tetap ditolak dengan invalid_client
        $this->actingAs($director)->get('/oauth/authorize?'.http_build_query([
            'response_type' => 'code',
            'client_id' => $claudeClient->id,
            'redirect_uri' => 'https://evil.example.com/callback',
            'scope' => 'mcp:use',
        ]))->assertStatus(401)->assertJsonPath('error', 'invalid_client');
    }

    // ===== Registri: setiap aksi menunjuk ke kode yang benar-benar ada =====

    public function test_every_action_points_to_an_existing_controller_method_and_menu(): void
    {
        $menus = MenuRegistry::keys();

        foreach (ActionRegistry::all() as $key => $action) {
            $this->assertArrayHasKey($action->module, ActionRegistry::modules(), "Modul {$action->module} ({$key}) tidak terdaftar");
            $this->assertTrue(in_array($action->menu, $menus, true) || in_array($action->menu, MenuRegistry::ALWAYS_ALLOWED, true), "Menu {$action->menu} ({$key}) tidak ada di MenuRegistry");

            if (! is_array($action->handler)) {
                continue;
            }

            [$controller, $method] = $action->handler;
            $this->assertTrue(method_exists($controller, $method), "{$key}: {$controller}::{$method} tidak ada");

            $parameters = collect((new ReflectionMethod($controller, $method))->getParameters())->map->getName();

            foreach (array_keys($action->bindings) as $binding) {
                $this->assertTrue($parameters->contains($binding), "{$key}: parameter \${$binding} tidak ada di {$controller}::{$method}");
            }
        }
    }

    public function test_every_read_page_without_ids_opens_for_the_director(): void
    {
        $director = $this->director();

        foreach (ActionRegistry::all() as $key => $action) {
            if ($action->kind !== McpAction::READ || $action->bindings !== []) {
                continue;
            }

            CtechServer::actingAs($director)
                ->tool(ReadDataTool::class, ['action' => $key, 'limit' => 5])
                ->assertOk()
                ->assertSee('berhasil');
        }
    }

    // ===== Hak akses mengikuti menu =====

    public function test_actions_follow_role_menu_permissions(): void
    {
        $operation = $this->operationWithMenus(['projects']);

        CtechServer::actingAs($operation)->tool(ListActionsTool::class)
            ->assertOk()
            ->assertSee('projects.list')
            ->assertDontSee('invoices.list');

        CtechServer::actingAs($operation)
            ->tool(ReadDataTool::class, ['action' => 'invoices.list'])
            ->assertHasErrors();

        CtechServer::actingAs($operation)
            ->tool(WriteDataTool::class, ['action' => 'announcements.create', 'data' => ['title' => 'x']])
            ->assertHasErrors();
    }

    public function test_tools_are_reachable_over_http_with_an_oauth_token(): void
    {
        Passport::actingAs($this->director(), ['mcp:use'], 'api');

        $names = collect($this->postJson('/mcp', $this->rpc('tools/list'))->assertOk()->json('result.tools'))->pluck('name');

        $this->assertEqualsCanonicalizing(['daftar-aksi', 'detail-aksi', 'baca-data', 'simpan-data', 'hapus-data'], $names->all());
    }

    // ===== Menulis lewat controller asli =====

    public function test_describe_returns_the_controllers_own_validation_rules(): void
    {
        CtechServer::actingAs($this->director())
            ->tool(DescribeActionTool::class, ['action' => 'tasks.create'])
            ->assertOk()
            ->assertSee('required|in:Todo,Progress,Review,Done');
    }

    public function test_write_runs_through_the_controller_with_activity_log_over_http(): void
    {
        $director = $this->director();
        $project = $this->project();
        Passport::actingAs($director, ['mcp:use'], 'api');

        $this->postJson('/mcp', $this->rpc('tools/call', [
            'name' => 'simpan-data',
            'arguments' => [
                'action' => 'tasks.create',
                'data' => ['project_id' => $project->id, 'title' => 'Buat halaman kontak', 'status' => 'Todo', 'priority' => 'High'],
            ],
        ]))->assertOk()->assertJsonPath('result.isError', false);

        $task = Task::where('title', 'Buat halaman kontak')->firstOrFail();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $director->id,
            'model_type' => 'Task',
            'model_id' => $task->id,
            'action' => 'created',
        ]);
    }

    public function test_partial_update_keeps_other_fields_and_relations(): void
    {
        $director = $this->director();
        $member = User::factory()->create(['role' => 'operation']);
        $project = $this->project();
        $project->members()->sync([$member->id]);

        CtechServer::actingAs($director)
            ->tool(WriteDataTool::class, ['action' => 'projects.update', 'ids' => ['project' => $project->id], 'data' => ['status' => 'Review']])
            ->assertOk();

        $project->refresh();

        $this->assertSame('Review', $project->status);
        $this->assertSame('Website Klien', $project->project_name);
        $this->assertSame([$member->id], $project->members()->pluck('users.id')->all(), 'Anggota project tidak boleh terhapus');
    }

    public function test_invalid_write_reports_errors_and_saves_nothing(): void
    {
        CtechServer::actingAs($this->director())
            ->tool(WriteDataTool::class, ['action' => 'tasks.create', 'data' => ['title' => 'Tanpa project', 'status' => 'Salah']])
            ->assertHasErrors()
            ->assertSee('project_id');

        $this->assertSame(0, Task::count());
        $this->assertSame(0, ActivityLog::count());
    }

    public function test_invoice_create_and_partial_update_keep_items_and_totals(): void
    {
        $director = $this->director();

        CtechServer::actingAs($director)->tool(WriteDataTool::class, ['action' => 'invoices.create', 'data' => [
            'client_name' => 'PT Klien',
            'issue_date' => '2026-10-01',
            'due_date' => '2026-10-15',
            'use_tax' => true,
            'tax_rate' => 11,
            'items' => [['description' => 'Pembuatan website', 'quantity' => 1, 'price' => 1000000]],
        ]])->assertOk();

        $invoice = Invoice::with('items')->firstOrFail();
        $this->assertEquals(1110000, $invoice->total);

        CtechServer::actingAs($director)
            ->tool(WriteDataTool::class, ['action' => 'invoices.update', 'ids' => ['invoice' => $invoice->id], 'data' => ['client_name' => 'PT Klien Baru']])
            ->assertOk();

        $invoice->refresh()->load('items');

        $this->assertSame('PT Klien Baru', $invoice->client_name);
        $this->assertCount(1, $invoice->items);
        $this->assertEquals(1110000, $invoice->total, 'Pajak & item lama harus tetap');

        CtechServer::actingAs($director)
            ->tool(ReadDataTool::class, ['action' => 'invoices.pdf', 'ids' => ['invoice' => $invoice->id]])
            ->assertOk()
            ->assertSee('/invoices/'.$invoice->id.'/pdf');
    }

    public function test_delete_needs_the_destructive_tool(): void
    {
        $director = $this->director();
        $task = Task::create(['project_id' => $this->project()->id, 'title' => 'Hapus saya', 'status' => 'Todo', 'priority' => 'Low']);

        CtechServer::actingAs($director)
            ->tool(WriteDataTool::class, ['action' => 'tasks.delete', 'ids' => ['task' => $task->id]])
            ->assertHasErrors();

        $this->assertModelExists($task);

        CtechServer::actingAs($director)
            ->tool(DeleteDataTool::class, ['action' => 'tasks.delete', 'ids' => ['task' => $task->id]])
            ->assertOk();

        $this->assertModelMissing($task);
    }

    public function test_missing_ids_and_unknown_records_are_reported(): void
    {
        $director = $this->director();

        CtechServer::actingAs($director)
            ->tool(ReadDataTool::class, ['action' => 'projects.show'])
            ->assertHasErrors()
            ->assertSee('ids.project');

        CtechServer::actingAs($director)
            ->tool(ReadDataTool::class, ['action' => 'projects.show', 'ids' => ['project' => 999999]])
            ->assertHasErrors()
            ->assertSee('tidak ditemukan');
    }

    public function test_link_actions_point_to_existing_routes(): void
    {
        foreach (['invoices.pdf', 'invoices.kwitansi', 'quotations.pdf', 'letters.pdf', 'files.download', 'incoming-letters.download'] as $route) {
            $this->assertTrue(Route::has($route), "Route {$route} tidak ada");
        }
    }
}
