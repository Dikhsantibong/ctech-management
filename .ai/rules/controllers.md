---
paths:
  - app/Http/Controllers/ProjectCanvasController.php
---

# Controllers

## Project Canvas: per-project React Flow docs, JSON autosave
Project Canvas = dokumentasi visual per-project (bukan menu global). Masuk sebagai tab "Canvas" di resources/js/pages/projects/show.tsx yang me-link ke halaman full-screen /projects/{project}/canvas (route di grup menu:projects).
- Satu project = satu canvas (project_canvases.project_id unique). Tabel: project_canvases, canvas_nodes, canvas_edges, canvas_versions. Edge merujuk canvas_nodes.node_key (bukan id DB).
- Engine: @xyflow/react v12. Editor di resources/js/components/project-canvas/Canvas.tsx (ProjectCanvasEditor, dibungkus ReactFlowProvider). Node/edge custom di nodes/index.tsx & edges/index.tsx.
- Autosave & aksi canvas (versi/restore/import) pakai csrfFetch (lib/canvas.ts) — fetch JSON dengan header X-XSRF-TOKEN, BUKAN Inertia router, supaya state editor tidak ter-reset. Autosave = PUT /canvas, debounce 800ms, replace-all node/edge dalam transaksi.
- Import Markdown AMAN (hanya baca, tidak eksekusi): app/Services/Canvas/ (MarkdownParser, DatabaseSchemaParser, FlowParser, CanvasImportService). POST /canvas/import hanya PREVIEW (tidak menyimpan); frontend merge lalu autosave. Template .md via GET /canvas/template?type=database|flow.
- Otorisasi: ProjectCanvasPolicy (auto-discovered) delegasi ke MenuAccess allows('projects'); canvas selalu diturunkan dari Project (firstOrCreate), ID dari frontend tidak dipercaya.
- Tes MySQL: DB_CONNECTION=mysql DB_DATABASE=ctech_management php artisan test tests/Feature/ProjectCanvasTest.php (pola DatabaseTransactions + User::first()).
