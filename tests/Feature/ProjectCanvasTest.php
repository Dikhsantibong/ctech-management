<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Services\Canvas\CanvasImportService;
use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ProjectCanvasTest extends TestCase
{
    use DatabaseTransactions;

    private function actor(): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => MenuRegistry::SUPER_ROLE])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    private function makeProject(): Project
    {
        return Project::create([
            'project_name' => 'Canvas Uji '.uniqid(),
            'client_name' => 'Klien Uji',
            'start_date' => now()->toDateString(),
            'deadline' => now()->addMonth()->toDateString(),
            'status' => 'Progress',
            'project_type' => 'Aplikasi',
        ]);
    }

    public function test_show_creates_canvas_for_project(): void
    {
        $user = $this->actor();
        $project = $this->makeProject();

        $this->actingAs($user)->get("/projects/{$project->id}/canvas")->assertStatus(200);

        $this->assertDatabaseHas('project_canvases', ['project_id' => $project->id]);
    }

    public function test_autosave_replaces_nodes_and_edges(): void
    {
        $user = $this->actor();
        $project = $this->makeProject();

        $payload = [
            'nodes' => [
                ['id' => 'a', 'type' => 'start', 'position' => ['x' => 0, 'y' => 0], 'data' => ['label' => 'Mulai']],
                ['id' => 'b', 'type' => 'process', 'position' => ['x' => 0, 'y' => 120], 'data' => ['label' => 'Proses']],
            ],
            'edges' => [
                ['id' => 'e1', 'source' => 'a', 'target' => 'b', 'type' => 'flow'],
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
        ];

        $this->actingAs($user)->putJson("/projects/{$project->id}/canvas", $payload)
            ->assertOk()
            ->assertJsonStructure(['saved_at', 'nodes', 'edges']);

        $this->assertDatabaseHas('canvas_nodes', ['node_key' => 'a', 'type' => 'start', 'label' => 'Mulai']);
        $this->assertDatabaseHas('canvas_edges', ['edge_key' => 'e1', 'source_node' => 'a', 'target_node' => 'b']);

        // Autosave berikutnya harus mengganti (bukan menumpuk).
        $this->actingAs($user)->putJson("/projects/{$project->id}/canvas", [
            'nodes' => [['id' => 'c', 'type' => 'end', 'position' => ['x' => 0, 'y' => 0], 'data' => ['label' => 'Selesai']]],
            'edges' => [],
        ])->assertOk();

        $this->assertDatabaseMissing('canvas_nodes', ['node_key' => 'a']);
        $this->assertDatabaseHas('canvas_nodes', ['node_key' => 'c']);
    }

    public function test_import_database_markdown_produces_erd(): void
    {
        $md = <<<'MD'
# Database Schema

## users

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| name | varchar | |

## projects

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| client_id | bigint | FK |

## clients

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| name | varchar | |

## Relationships

- projects.client_id → clients.id
MD;

        $result = app(CanvasImportService::class)->parse($md, 'database');

        $this->assertSame('database', $result['detected_type']);
        $this->assertCount(3, $result['nodes']);
        $this->assertNotEmpty($result['edges']);
        $this->assertSame('database', $result['nodes'][0]['type']);
    }

    public function test_import_flow_markdown_produces_start_and_end(): void
    {
        $md = "# Business Flow\n\nCustomer\n↓\nLogin\n↓\nSelesai\n";

        $result = app(CanvasImportService::class)->parse($md, 'flow');

        $this->assertSame('flow', $result['detected_type']);
        $this->assertSame('start', $result['nodes'][0]['type']);
        $this->assertSame('end', $result['nodes'][count($result['nodes']) - 1]['type']);
        $this->assertCount(2, $result['edges']);
    }

    public function test_import_endpoint_previews_without_saving(): void
    {
        $user = $this->actor();
        $project = $this->makeProject();

        $md = "# Flow\n\nA\n↓\nB\n↓\nC\n";

        $this->actingAs($user)->postJson("/projects/{$project->id}/canvas/import", ['content' => $md, 'type' => 'auto'])
            ->assertOk()
            ->assertJsonStructure(['detected_type', 'nodes', 'edges', 'warnings', 'unmapped']);

        // Preview tidak menyimpan node apa pun.
        $canvasId = $project->canvas()->first()?->id;
        if ($canvasId) {
            $this->assertDatabaseMissing('canvas_nodes', ['canvas_id' => $canvasId]);
        }
    }

    public function test_version_snapshot_and_restore(): void
    {
        $user = $this->actor();
        $project = $this->makeProject();

        // Simpan graph awal.
        $this->actingAs($user)->putJson("/projects/{$project->id}/canvas", [
            'nodes' => [['id' => 'a', 'type' => 'process', 'position' => ['x' => 0, 'y' => 0], 'data' => ['label' => 'V1']]],
            'edges' => [],
        ])->assertOk();

        // Snapshot versi.
        $this->actingAs($user)->postJson("/projects/{$project->id}/canvas/versions", ['description' => 'Awal'])
            ->assertOk()->assertJsonStructure(['version', 'versions']);

        // Ubah graph.
        $this->actingAs($user)->putJson("/projects/{$project->id}/canvas", [
            'nodes' => [['id' => 'b', 'type' => 'process', 'position' => ['x' => 0, 'y' => 0], 'data' => ['label' => 'V2']]],
            'edges' => [],
        ])->assertOk();

        $version = $project->canvas()->first()->versions()->first();

        // Restore ke versi awal.
        $this->actingAs($user)->postJson("/projects/{$project->id}/canvas/versions/{$version->id}/restore")
            ->assertOk()->assertJsonStructure(['nodes', 'edges', 'versions']);

        $this->assertDatabaseHas('canvas_nodes', ['node_key' => 'a']);
        $this->assertDatabaseMissing('canvas_nodes', ['node_key' => 'b']);
    }

    public function test_template_download(): void
    {
        $user = $this->actor();
        $project = $this->makeProject();

        $response = $this->actingAs($user)->get("/projects/{$project->id}/canvas/template?type=database");
        $response->assertStatus(200);
        $this->assertStringContainsString('markdown', strtolower($response->headers->get('content-type') ?? ''));
        $this->assertStringContainsString('users', $response->getContent());
    }
}
