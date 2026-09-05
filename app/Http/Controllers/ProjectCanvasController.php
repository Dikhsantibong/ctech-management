<?php

namespace App\Http\Controllers;

use App\Models\CanvasVersion;
use App\Models\Project;
use App\Models\ProjectCanvas;
use App\Services\Canvas\CanvasImportService;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProjectCanvasController extends Controller
{
    use LogsActivity;

    /** Halaman editor canvas (full-screen di dalam Project). */
    public function show(Project $project)
    {
        $canvas = $this->canvasFor($project);
        $this->authorize('view', $canvas);

        $canvas->load(['nodes', 'edges', 'versions.creator']);

        // Dokumen Markdown milik project untuk aksi "Tambahkan ke Canvas".
        $markdownDocs = $project->documents()
            ->get()
            ->filter(fn ($doc) => str_ends_with(strtolower((string) ($doc->file_name ?? $doc->name ?? '')), '.md'))
            ->map(fn ($doc) => ['id' => $doc->id, 'name' => $doc->file_name ?? $doc->name])
            ->values();

        return Inertia::render('projects/canvas', [
            'project' => [
                'id' => $project->id,
                'project_name' => $project->project_name,
                'client_name' => $project->client_name,
            ],
            'canvas' => [
                'id' => $canvas->id,
                'name' => $canvas->name,
                'viewport' => $canvas->viewport,
                'settings' => $canvas->settings,
                'updated_at' => $canvas->updated_at,
            ],
            'nodes' => $this->serializeNodes($canvas),
            'edges' => $this->serializeEdges($canvas),
            'versions' => $this->serializeVersions($canvas),
            'markdownDocuments' => $markdownDocs,
        ]);
    }

    /** Autosave (JSON, dipanggil via fetch dengan debounce). */
    public function update(Request $request, Project $project)
    {
        $canvas = $this->canvasFor($project);
        $this->authorize('update', $canvas);

        $validated = $request->validate([
            'nodes' => ['present', 'array'],
            'nodes.*.id' => ['required', 'string', 'max:191'],
            'nodes.*.type' => ['nullable', 'string', 'max:64'],
            'nodes.*.position' => ['required', 'array'],
            'nodes.*.position.x' => ['required', 'numeric'],
            'nodes.*.position.y' => ['required', 'numeric'],
            'nodes.*.data' => ['nullable', 'array'],
            'nodes.*.width' => ['nullable', 'numeric'],
            'nodes.*.height' => ['nullable', 'numeric'],
            'nodes.*.style' => ['nullable', 'array'],
            'edges' => ['present', 'array'],
            'edges.*.id' => ['required', 'string', 'max:191'],
            'edges.*.source' => ['required', 'string', 'max:191'],
            'edges.*.target' => ['required', 'string', 'max:191'],
            'edges.*.label' => ['nullable', 'string', 'max:255'],
            'edges.*.type' => ['nullable', 'string', 'max:64'],
            'edges.*.sourceHandle' => ['nullable', 'string', 'max:191'],
            'edges.*.targetHandle' => ['nullable', 'string', 'max:191'],
            'edges.*.data' => ['nullable', 'array'],
            'edges.*.style' => ['nullable', 'array'],
            'viewport' => ['nullable', 'array'],
        ]);

        abort_if(count($validated['nodes']) > 2000, 422, 'Canvas melebihi batas jumlah node.');

        $this->replaceGraph($canvas, $validated['nodes'], $validated['edges']);
        $canvas->update(['viewport' => $validated['viewport'] ?? $canvas->viewport]);

        return response()->json([
            'saved_at' => now()->toIso8601String(),
            'nodes' => count($validated['nodes']),
            'edges' => count($validated['edges']),
        ]);
    }

    /** Parse dokumentasi Markdown untuk PREVIEW (tidak menyimpan apa pun). */
    public function import(Request $request, Project $project, CanvasImportService $service)
    {
        $canvas = $this->canvasFor($project);
        $this->authorize('update', $canvas);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500000'],
            'type' => ['nullable', 'string', 'max:64'],
            'source_document_id' => ['nullable', 'integer'],
        ]);

        $result = $service->parse($validated['content'], $validated['type'] ?? 'auto');

        // Tandai asal node bila import berasal dari dokumen project.
        if (! empty($validated['source_document_id'])) {
            $result['nodes'] = array_map(function ($node) use ($validated) {
                $node['source_document_id'] = $validated['source_document_id'];

                return $node;
            }, $result['nodes']);
        }

        return response()->json($result);
    }

    /** Unduh template Markdown untuk canvas (database / flow). */
    public function template(Request $request, Project $project)
    {
        $type = $request->query('type', 'database');
        [$filename, $content] = $this->templateContent(is_string($type) ? $type : 'database');

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    /** Simpan snapshot versi baru. */
    public function storeVersion(Request $request, Project $project)
    {
        $canvas = $this->canvasFor($project);
        $this->authorize('update', $canvas);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $version = $this->snapshot($canvas, $validated['name'] ?? null, $validated['description'] ?? null);

        $this->logActivity('created', 'CanvasVersion', $version->id, "Menyimpan versi canvas #{$version->version_number} project {$project->project_name}");

        return response()->json([
            'version' => $this->serializeVersion($version->load('creator')),
            'versions' => $this->serializeVersions($canvas->fresh(['versions.creator'])),
        ]);
    }

    /** Restore ke versi tertentu (versi saat ini di-snapshot dulu, tidak dihapus). */
    public function restoreVersion(Project $project, CanvasVersion $version)
    {
        $canvas = $this->canvasFor($project);
        $this->authorize('update', $canvas);

        abort_unless($version->canvas_id === $canvas->id, 404);

        // Amankan kondisi saat ini sebagai versi baru sebelum menimpa.
        $this->snapshot($canvas, 'Auto-snapshot sebelum restore', "Sebelum restore ke versi #{$version->version_number}");

        $snapshot = $version->snapshot;
        $nodes = $snapshot['nodes'] ?? [];
        $edges = $snapshot['edges'] ?? [];

        $this->replaceGraph($canvas, $nodes, $edges);
        $canvas->update(['viewport' => $snapshot['viewport'] ?? $canvas->viewport]);

        $canvas->load(['nodes', 'edges', 'versions.creator']);

        $this->logActivity('updated', 'CanvasVersion', $version->id, "Restore canvas ke versi #{$version->version_number} project {$project->project_name}");

        return response()->json([
            'nodes' => $this->serializeNodes($canvas),
            'edges' => $this->serializeEdges($canvas),
            'viewport' => $snapshot['viewport'] ?? null,
            'versions' => $this->serializeVersions($canvas),
        ]);
    }

    private function canvasFor(Project $project): ProjectCanvas
    {
        return $project->canvas()->firstOrCreate(
            ['project_id' => $project->id],
            ['name' => $project->project_name.' — Documentation', 'created_by' => Auth::id()],
        );
    }

    /**
     * Ganti seluruh node & edge canvas dengan set baru (atomic).
     *
     * @param  array<int, array<string,mixed>>  $nodes
     * @param  array<int, array<string,mixed>>  $edges
     */
    private function replaceGraph(ProjectCanvas $canvas, array $nodes, array $edges): void
    {
        DB::transaction(function () use ($canvas, $nodes, $edges) {
            $canvas->nodes()->delete();
            $canvas->edges()->delete();
            $now = now();

            $nodeRows = [];
            foreach ($nodes as $node) {
                $data = $node['data'] ?? [];
                $nodeRows[] = [
                    'canvas_id' => $canvas->id,
                    'node_key' => $node['id'],
                    'type' => $node['type'] ?? 'process',
                    'label' => is_array($data) ? ($data['label'] ?? null) : null,
                    'position_x' => $node['position']['x'] ?? 0,
                    'position_y' => $node['position']['y'] ?? 0,
                    'width' => $node['width'] ?? null,
                    'height' => $node['height'] ?? null,
                    'data' => json_encode($data),
                    'style' => isset($node['style']) ? json_encode($node['style']) : null,
                    'source_document_id' => $node['source_document_id'] ?? null,
                    'source_type' => $node['source_type'] ?? ($data['source_type'] ?? null),
                    'source_reference' => $node['source_reference'] ?? ($data['source_reference'] ?? null),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            $edgeRows = [];
            foreach ($edges as $edge) {
                $edgeRows[] = [
                    'canvas_id' => $canvas->id,
                    'edge_key' => $edge['id'],
                    'source_node' => $edge['source'],
                    'target_node' => $edge['target'],
                    'source_handle' => $edge['sourceHandle'] ?? null,
                    'target_handle' => $edge['targetHandle'] ?? null,
                    'label' => $edge['label'] ?? null,
                    'type' => $edge['type'] ?? null,
                    'data' => isset($edge['data']) ? json_encode($edge['data']) : null,
                    'style' => isset($edge['style']) ? json_encode($edge['style']) : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            foreach (array_chunk($nodeRows, 200) as $chunk) {
                $canvas->nodes()->insert($chunk);
            }
            foreach (array_chunk($edgeRows, 200) as $chunk) {
                $canvas->edges()->insert($chunk);
            }
        });
    }

    private function snapshot(ProjectCanvas $canvas, ?string $name, ?string $description): CanvasVersion
    {
        $canvas->load(['nodes', 'edges']);
        $number = (int) $canvas->versions()->max('version_number') + 1;

        return CanvasVersion::create([
            'canvas_id' => $canvas->id,
            'version_number' => $number,
            'name' => $name,
            'description' => $description,
            'snapshot' => [
                'nodes' => $this->serializeNodes($canvas),
                'edges' => $this->serializeEdges($canvas),
                'viewport' => $canvas->viewport,
            ],
            'created_by' => Auth::id(),
        ]);
    }

    /**
     * @return array<int, array<string,mixed>>
     */
    private function serializeNodes(ProjectCanvas $canvas): array
    {
        return $canvas->nodes->map(fn ($node) => [
            'id' => $node->node_key,
            'type' => $node->type,
            'position' => ['x' => $node->position_x, 'y' => $node->position_y],
            'width' => $node->width,
            'height' => $node->height,
            'data' => $node->data ?? ['label' => $node->label],
            'style' => $node->style,
            'source_document_id' => $node->source_document_id,
            'source_type' => $node->source_type,
            'source_reference' => $node->source_reference,
        ])->all();
    }

    /**
     * @return array<int, array<string,mixed>>
     */
    private function serializeEdges(ProjectCanvas $canvas): array
    {
        return $canvas->edges->map(fn ($edge) => [
            'id' => $edge->edge_key,
            'source' => $edge->source_node,
            'target' => $edge->target_node,
            'sourceHandle' => $edge->source_handle,
            'targetHandle' => $edge->target_handle,
            'label' => $edge->label,
            'type' => $edge->type,
            'data' => $edge->data,
            'style' => $edge->style,
        ])->all();
    }

    /**
     * @return array<int, array<string,mixed>>
     */
    private function serializeVersions(ProjectCanvas $canvas): array
    {
        return $canvas->versions->map(fn ($v) => $this->serializeVersion($v))->all();
    }

    /**
     * @return array<string,mixed>
     */
    private function serializeVersion(CanvasVersion $version): array
    {
        return [
            'id' => $version->id,
            'version_number' => $version->version_number,
            'name' => $version->name,
            'description' => $version->description,
            'created_by' => $version->creator?->name,
            'created_at' => $version->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function templateContent(string $type): array
    {
        if ($type === 'flow') {
            return ['canvas-flow-template.md', <<<'MD'
# Business Flow

Customer
↓
Login
↓
Pilih Produk
↓
Checkout
↓
Pembayaran Berhasil?
↓
Invoice
↓
Selesai

# Catatan
- Baris pertama menjadi node Start, baris terakhir menjadi End.
- Baris yang diakhiri tanda tanya (?) menjadi node Decision.
- Pisahkan langkah dengan panah (↓ atau ->) atau baris baru.
MD];
        }

        return ['canvas-database-template.md', <<<'MD'
# Database Schema

## users

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| name | varchar | |
| email | varchar | |
| created_at | timestamp | |

## projects

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| name | varchar | |
| client_id | bigint | FK |
| created_at | timestamp | |

## clients

| Column | Type | Key |
| --- | --- | --- |
| id | bigint | PK |
| name | varchar | |

## Relationships

- projects.client_id → clients.id
MD];
    }
}
