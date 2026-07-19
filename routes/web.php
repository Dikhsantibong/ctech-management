<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\ProjectMilestoneController;
use App\Http\Controllers\Api\V1\ProjectDocumentController;
use App\Http\Controllers\Api\V1\ProjectMeetingController;
use App\Http\Controllers\Api\V1\ProjectActivityController;
use App\Http\Controllers\Api\V1\DailyReportController;
use App\Http\Controllers\Api\V1\ProjectRevisionController;
use App\Http\Controllers\Api\V1\ClientFeedbackController;

use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    $news = \App\Models\News::where('status', 'Published')->latest()->take(3)->get();
    $portfolios = \App\Models\Portfolio::latest()->take(6)->get();
    return inertia('welcome', ['news' => $news, 'portfolios' => $portfolios]);
})->name('home');

Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

Route::get('/berita', [\App\Http\Controllers\PublicController::class, 'newsIndex'])->name('public.news.index');
Route::get('/berita/{slug}', [\App\Http\Controllers\PublicController::class, 'newsShow'])->name('public.news.show');

Route::get('/tentang', function () { return inertia('public/about/index'); })->name('public.about');

Route::get('/layanan', function () { return inertia('public/services/index'); })->name('public.services');

Route::get('/kontak', function () { return inertia('public/contact/index'); })->name('public.contact');

Route::prefix('solusi')->group(function () {
    Route::get('/photobooth', function () { return inertia('public/solutions/photobooth'); })->name('public.solutions.photobooth');
});

Route::get('/industri', function () {
    $portfolios = \App\Models\Portfolio::latest()->take(6)->get();
    return inertia('public/industries/index', ['portfolios' => $portfolios]);
})->name('public.industries');
Route::get('/proses', function () { return inertia('public/process/index'); })->name('public.process');
Route::get('/case-studi', function () {
    $category = request()->input('category');
    $portfolios = \App\Models\Portfolio::when($category, function($query, $category) {
            return $query->where('category', $category);
        })
        ->latest()
        ->get();
    $categories = \App\Models\Portfolio::select('category')->distinct()->pluck('category');
    return inertia('public/case-studies/index', [
        'portfolios' => $portfolios,
        'categories' => $categories,
        'filters' => ['category' => $category]
    ]);
})->name('public.case-studies');

Route::get('/produk', function () { return inertia('public/products/index'); })->name('public.products');

Route::get('/produk/{product}', function ($product) {
    $validProducts = ['paylo', 'booth'];
    if (!in_array($product, $validProducts)) {
        abort(404);
    }
    return inertia("public/products/{$product}");
})->name('public.products.show');

Route::get('/portfolio', [\App\Http\Controllers\PublicController::class, 'portfolioIndex'])->name('public.portfolio.index');
Route::get('/portfolio/{id}', [\App\Http\Controllers\PublicController::class, 'portfolioShow'])->name('public.portfolio.show');

Route::middleware(['auth', 'verified'])->group(function () {

    // API Routes moved from api.php to allow Session Authentication
    Route::prefix('api/v1')->group(function () {
// Milestones
    Route::post('/projects/{project}/milestones', [ProjectMilestoneController::class, 'store']);
    Route::put('/milestones/{milestone}/progress', [ProjectMilestoneController::class, 'updateProgress']);

    // Documents
    Route::get('/projects/{project}/documents', [ProjectDocumentController::class, 'index']);
    Route::post('/projects/{project}/document-folders', [ProjectDocumentController::class, 'storeFolder']);
    Route::post('/projects/{project}/documents', [ProjectDocumentController::class, 'storeDocument']);
    Route::get('/documents/{document}/download', [ProjectDocumentController::class, 'download']);
    Route::delete('/documents/{document}', [ProjectDocumentController::class, 'destroy']);

    // Meetings
    Route::get('/projects/{project}/meetings', [ProjectMeetingController::class, 'index']);
    Route::post('/projects/{project}/meetings', [ProjectMeetingController::class, 'store']);
    Route::put('/meetings/{meeting}/minutes', [ProjectMeetingController::class, 'updateMinutes']);
    Route::post('/meetings/{meeting}/action-items', [ProjectMeetingController::class, 'storeActionItem']);

    // Activities
    Route::get('/projects/{project}/activities', [ProjectActivityController::class, 'index']);

    // Activities
    Route::get('/projects/{project}/activities', [ProjectActivityController::class, 'index']);
    });

    // Accessible by all authenticated users (Staff, Admin Operasional, Direktur Operasional, Direktur Utama)
    Route::middleware('role:direktur_utama,operation,marketing,administrasi')->group(function () {
        Route::get('/dashboard', function () {
            $user = auth()->user();
            $role = $user->role;

            $data = [
                'user_role' => $role,
                'announcements' => \App\Models\Announcement::active()->forRole($role)->latest()->take(3)->get(),
                'activity_logs' => \App\Models\ActivityLog::with('user')->latest()->take(8)->get(),
            ];

            // direktur_utama (CEO)
            if ($role === 'direktur_utama') {
                $active_projects = \App\Models\Project::whereNotIn('status', ['Completed'])->count();
                $delayed_projects = \App\Models\Project::whereHas('milestones', function($q) {
                    $q->where('status', 'Delayed');
                })->count();
                $project_health = $active_projects > 0 ? round((($active_projects - $delayed_projects) / $active_projects) * 100) : 100;
                
                $data['stats'] = [
                    'active_projects' => $active_projects,
                    'completed_projects' => \App\Models\Project::where('status', 'Completed')->count(),
                    'delayed_projects' => $delayed_projects,
                    'team_members' => \App\Models\User::count(),
                    'project_health' => $project_health, // percentage
                    'active_clients' => \App\Models\Client::count(),
                    'unpaid_invoices' => \App\Models\Invoice::where('status', 'Unpaid')->sum('total'),
                    'paid_invoices' => \App\Models\Invoice::where('status', 'Paid')->sum('total'),
                ];
                
                // Team workload
                $data['team_workload'] = \App\Models\User::withCount(['tasks' => function ($query) {
                    $query->whereNotIn('status', ['Done']);
                }])->orderBy('tasks_count', 'desc')->take(5)->get();
                
                // Client overview (clients with most active projects)
                $data['client_overview'] = \App\Models\Project::selectRaw('client_name, count(*) as count')
                    ->whereNotIn('status', ['Completed'])
                    ->groupBy('client_name')
                    ->orderBy('count', 'desc')
                    ->take(5)->get();
                
                $data['financials'] = \App\Models\ProjectFinancial::selectRaw('SUM(contract_value) as total_revenue, SUM(cost) as total_cost, SUM(profit) as total_profit')->first();

                $data['upcoming_deadlines'] = \App\Models\Project::whereNotNull('deadline')
                    ->where('status', '!=', 'Completed')
                    ->orderBy('deadline')
                    ->take(5)->get();
                
                // Chart Data
                $data['project_status_chart'] = \App\Models\Project::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
                
                // Real revenue trend (Paid invoices over the last 7 months)
                $months = collect(range(6, 0))->map(function($i) {
                    return now()->subMonths($i)->format('M');
                })->values()->toArray();
                
                $revenueData = [];
                for ($i = 6; $i >= 0; $i--) {
                    $monthStart = now()->subMonths($i)->startOfMonth();
                    $monthEnd = now()->subMonths($i)->endOfMonth();
                    
                    $sum = \App\Models\Invoice::where('status', 'Paid')
                        ->whereBetween('created_at', [$monthStart, $monthEnd])
                        ->sum('total');
                    $revenueData[] = (float) $sum;
                }
                
                $data['revenue_trend_chart'] = [
                    'labels' => $months,
                    'data' => $revenueData,
                ];
            }

            // operation
            if ($role === 'operation') {
                $data['stats'] = [
                    'project_assigned' => \App\Models\Project::whereHas('tasks', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })->count(),
                    'pending_tasks' => \App\Models\Task::where('user_id', $user->id)->where('status', '!=', 'Done')->count(),
                    'today_tasks' => \App\Models\Task::where('user_id', $user->id)->whereDate('deadline', now()->format('Y-m-d'))->count(),
                ];
                $data['milestones_progress'] = \App\Models\ProjectMilestone::with('project')
                    ->where('status', 'In Progress')
                    ->latest()
                    ->take(5)->get();
                $data['my_tasks'] = \App\Models\Task::with('project')
                    ->where('user_id', $user->id)
                    ->where('status', '!=', 'Done')
                    ->orderBy('deadline')
                    ->take(5)->get();
                
                // Chart Data
                $data['task_status_chart'] = \App\Models\Task::where('user_id', $user->id)->selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
            }

            // marketing
            if ($role === 'marketing') {
                $data['stats'] = [
                    'active_portfolios' => \App\Models\Portfolio::count(),
                    'published_news' => \App\Models\News::where('status', 'Published')->count(),
                    'content_plans' => \App\Models\ContentPlan::where('status', 'Scheduled')->count(),
                    'total_clients' => \App\Models\Client::count(),
                ];
                $data['recent_contents'] = \App\Models\ContentPlan::orderBy('scheduled_at', 'desc')->take(5)->get();
                $data['recent_clients'] = \App\Models\Client::latest()->take(5)->get();

                // Chart Data
                $data['content_platform_chart'] = \App\Models\ContentPlan::selectRaw('platform, count(*) as count')->groupBy('platform')->pluck('count', 'platform');
                $data['portfolio_category_chart'] = \App\Models\Portfolio::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category');
            }

            // administrasi
            if ($role === 'administrasi') {
                $data['stats'] = [
                    'surat_masuk' => \App\Models\SuratMasuk::count(),
                    'surat_keluar' => \App\Models\SuratKeluar::count(),
                    'invoices_pending' => \App\Models\Invoice::where('status', 'Unpaid')->count(),
                    'total_documents' => \App\Models\Document::count(),
                ];
                $data['recent_invoices'] = \App\Models\Invoice::with('project')->where('status', 'Unpaid')->latest()->take(5)->get();

                // Chart Data
                $data['invoice_status_chart'] = \App\Models\Invoice::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
                
                // Manual build of document categories since there's no single column for type
                $data['document_category_chart'] = [
                    'Surat Masuk' => \App\Models\SuratMasuk::count(),
                    'Surat Keluar' => \App\Models\SuratKeluar::count(),
                    'Dokumen Internal' => \App\Models\Document::count(),
                ];
            }

            return inertia('dashboard', $data);
        })->name('dashboard');

        Route::resource('projects', \App\Http\Controllers\ProjectController::class);

        Route::put('/projects/{project}/metadata', [\App\Http\Controllers\ProjectController::class, 'updateMetadata'])->name('projects.metadata.update');
Route::post('/projects/{project}/revisions', [\App\Http\Controllers\ProjectController::class, 'storeRevision'])->name('projects.revisions.store');
    Route::post('/projects/{project}/feedbacks', [\App\Http\Controllers\ProjectController::class, 'storeFeedback'])->name('projects.feedbacks.store');
    Route::post('/projects/{project}/feedbacks/{feedback}/convert-to-task', [\App\Http\Controllers\ProjectController::class, 'convertFeedbackToTask'])->name('projects.feedbacks.convert');

        Route::resource('tasks', \App\Http\Controllers\TaskController::class);
        Route::get('works/report', [\App\Http\Controllers\WorkController::class, 'report'])->name('works.report');
        Route::resource('works', \App\Http\Controllers\WorkController::class);
        Route::get('content-plans/report', [\App\Http\Controllers\ContentPlanController::class, 'report'])->name('content-plans.report');
        Route::resource('content-plans', \App\Http\Controllers\ContentPlanController::class)->except(['create', 'edit', 'show']);
        Route::resource('news', \App\Http\Controllers\NewsController::class)->except(['create', 'edit', 'show']);
        Route::resource('portfolios', \App\Http\Controllers\PortfolioController::class)->except(['create', 'edit', 'show']);
        Route::get('calendar', function () {
            $events = collect();

            // Get projects with deadlines
            $projects = \App\Models\Project::whereNotNull('deadline')->get();
            foreach ($projects as $project) {
                $deadline = is_string($project->deadline) ? \Carbon\Carbon::parse($project->deadline) : $project->deadline;
                $events->push([
                    'id' => "project-{$project->id}",
                    'title' => "Project: {$project->name}",
                    'date' => $deadline->format('Y-m-d'),
                    'type' => 'project',
                    'description' => $project->description ?? '',
                    'priority' => 'high',
                ]);
            }

            // Get tasks with deadlines
            $tasks = \App\Models\Task::whereNotNull('deadline')->where('status', '!=', 'Done')->get();
            foreach ($tasks as $task) {
                $deadline = is_string($task->deadline) ? \Carbon\Carbon::parse($task->deadline) : $task->deadline;
                $events->push([
                    'id' => "task-{$task->id}",
                    'title' => "Task: {$task->title}",
                    'date' => $deadline->format('Y-m-d'),
                    'type' => 'task',
                    'description' => $task->description ?? '',
                    'priority' => $task->priority ?? 'medium',
                ]);
            }

            // Get content plans with scheduled dates
            $contentPlans = \App\Models\ContentPlan::whereNotNull('scheduled_date')->where('status', '!=', 'Cancelled')->get();
            foreach ($contentPlans as $contentPlan) {
                $scheduledDate = is_string($contentPlan->scheduled_date) ? \Carbon\Carbon::parse($contentPlan->scheduled_date) : $contentPlan->scheduled_date;
                $events->push([
                    'id' => "content-plan-{$contentPlan->id}",
                    'title' => "Content: {$contentPlan->title}",
                    'date' => $scheduledDate->format('Y-m-d'),
                    'type' => 'content_plan',
                    'description' => $contentPlan->description ?? '',
                    'platform' => $contentPlan->platform,
                    'content_type' => $contentPlan->content_type,
                    'priority' => 'medium',
                ]);
            }

            return inertia('calendar/index', [
                'events' => $events->sortBy('date')->values(),
            ]);
        })->name('calendar.index');
    });

    // Accessible by Admin Operasional, Direktur Operasional, and Direktur Utama
    Route::middleware('role:direktur_utama,operation,administrasi')->group(function () {
        Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
        Route::put('invoices/{invoice}/status', [\App\Http\Controllers\InvoiceController::class, 'updateStatus'])->name('invoices.status');
        Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
        Route::resource('letters', \App\Http\Controllers\LetterController::class);
        Route::get('letters/{letter}/preview', [\App\Http\Controllers\LetterController::class, 'previewPdf'])->name('letters.preview');
        Route::get('letters/{letter}/pdf', [\App\Http\Controllers\LetterController::class, 'downloadPdf'])->name('letters.pdf');
        Route::resource('incoming-letters', \App\Http\Controllers\IncomingLetterController::class)->except(['create', 'edit']);
        Route::get('incoming-letters/{incoming_letter}/download', [\App\Http\Controllers\IncomingLetterController::class, 'downloadAttachment'])->name('incoming-letters.download');
        Route::resource('documents', \App\Http\Controllers\DocumentController::class);
        Route::resource('files', \App\Http\Controllers\FileController::class)->except(['create', 'edit', 'update', 'show']);
        Route::get('files/{file}/download', [\App\Http\Controllers\FileController::class, 'download'])->name('files.download');
        Route::get('files/{file}/preview', [\App\Http\Controllers\FileController::class, 'preview'])->name('files.preview');
    });

    // Accessible only by Direktur Utama
    Route::middleware('role:direktur_utama')->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::resource('clients', \App\Http\Controllers\ClientController::class);
        Route::get('activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

    // Daily Reports UI
    Route::get('/daily-reports', function () {
        return inertia('daily-reports/index', [
            'users' => \App\Models\User::all(),
            'projects' => \App\Models\Project::where('status', '!=', 'Completed')->get()
        ]);
    })->name('daily-reports.index');

    // API-like endpoints for stateful fetch (with session auth)
    Route::get('/api/v1/projects/{project}/activities', [\App\Http\Controllers\Api\V1\ProjectActivityController::class, 'index']);
    
    Route::get('/api/v1/daily-reports', [\App\Http\Controllers\Api\V1\DailyReportController::class, 'index']);
    Route::post('/api/v1/daily-reports', [\App\Http\Controllers\Api\V1\DailyReportController::class, 'store']);
    
    Route::get('/api/v1/projects/{project}/revisions', [\App\Http\Controllers\Api\V1\ProjectRevisionController::class, 'index']);
    Route::post('/api/v1/projects/{project}/revisions', [\App\Http\Controllers\Api\V1\ProjectRevisionController::class, 'store']);
    Route::put('/api/v1/revisions/{revision}/status', [\App\Http\Controllers\Api\V1\ProjectRevisionController::class, 'update']);
    
    Route::get('/api/v1/projects/{project}/feedbacks', [\App\Http\Controllers\Api\V1\ClientFeedbackController::class, 'index']);
    Route::post('/api/v1/projects/{project}/feedbacks', [\App\Http\Controllers\Api\V1\ClientFeedbackController::class, 'store']);
    Route::put('/api/v1/feedbacks/{feedback}/status', [\App\Http\Controllers\Api\V1\ClientFeedbackController::class, 'update']);

    // Dashboard routes - CRUD for direktur utama, read-only for others
    Route::middleware('role:direktur_utama')->group(function () {
        Route::resource('announcements', \App\Http\Controllers\AnnouncementController::class)->except(['index', 'show']);
    });
    Route::get('announcements', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('announcements/{announcement}', [\App\Http\Controllers\AnnouncementController::class, 'show'])->name('announcements.show');
});

require __DIR__.'/settings.php';
