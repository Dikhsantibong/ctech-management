<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    $news = \App\Models\News::where('status', 'Published')->latest()->take(3)->get();
    $portfolios = \App\Models\Portfolio::latest()->take(6)->get();
    return inertia('welcome', ['news' => $news, 'portfolios' => $portfolios]);
})->name('home');

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
    // Accessible by all authenticated users (Staff, Admin Operasional, Direktur Operasional, Direktur Utama)
    Route::middleware('role:direktur_utama,direktur_operasional,admin_operasional,staff')->group(function () {
        Route::get('/dashboard', function () {
            $user = auth()->user();
            $role = $user->role;

            // Base data for all roles
            $data = [
                'user_role' => $role,
                'announcements' => \App\Models\Announcement::active()->forRole($role)->latest()->take(3)->get(),
            ];

            // Direktur Utama and Direktur Operasional see all information
            if (in_array($role, ['direktur_utama', 'direktur_operasional'])) {
                $data['stats'] = [
                    'active_projects' => \App\Models\Project::where('status', '!=', 'Completed')->count(),
                    'pending_tasks' => \App\Models\Task::where('status', '!=', 'Done')->count(),
                    'unpaid_invoices' => \App\Models\Invoice::where('status', '!=', 'Paid')->count(),
                    'team_members' => \App\Models\User::count(),
                ];
                $data['upcoming_tasks'] = \App\Models\Task::with('project')->where('status', '!=', 'Done')->whereNotNull('deadline')->orderBy('deadline')->take(5)->get();
                $data['task_status_counts'] = DB::table('tasks')
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->pluck('count', 'status');
                $data['tasks_last_7_days'] = (function () {
                    $rows = DB::table('tasks')
                        ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                        ->where('created_at', '>=', now()->subDays(6))
                        ->groupBy(DB::raw('DATE(created_at)'))
                        ->orderBy(DB::raw('DATE(created_at)'))
                        ->get()
                        ->pluck('count', 'date')
                        ->toArray();

                    $labels = [];
                    $data_points = [];
                    for ($i = 6; $i >= 0; $i--) {
                        $d = now()->subDays($i)->format('Y-m-d');
                        $labels[] = now()->subDays($i)->format('M j');
                        $data_points[] = isset($rows[$d]) ? (int) $rows[$d] : 0;
                    }

                    return ['labels' => $labels, 'data' => $data_points];
                })();
            }

            // Staff sees limited information
            if ($role === 'staff' || $role === 'admin_operasional') {
                $data['stats'] = [
                    'pending_tasks' => \App\Models\Task::where('status', '!=', 'Done')->count(),
                    'active_projects' => \App\Models\Project::where('status', '!=', 'Completed')->count(),
                    'content_plans' => \App\Models\ContentPlan::count(),
                    'scheduled_content' => \App\Models\ContentPlan::whereNotNull('scheduled_date')->where('scheduled_date', '>=', now())->count(),
                    'news' => \App\Models\News::where('status', 'published')->count(),
                    'portfolios' => \App\Models\Portfolio::count(),
                ];
                $data['upcoming_tasks'] = \App\Models\Task::with('project')->where('status', '!=', 'Done')->whereNotNull('deadline')->orderBy('deadline')->take(5)->get();

                // Content plans by status
                $data['content_plan_status_counts'] = DB::table('content_plans')
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->pluck('count', 'status');

                // Content plans by platform
                $data['content_plan_platform_counts'] = DB::table('content_plans')
                    ->select('platform', DB::raw('count(*) as count'))
                    ->groupBy('platform')
                    ->pluck('count', 'platform');

                // News by category
                $data['news_category_counts'] = DB::table('news')
                    ->select('category', DB::raw('count(*) as count'))
                    ->where('status', 'published')
                    ->groupBy('category')
                    ->pluck('count', 'category');

                // Portfolios by category
                $data['portfolio_category_counts'] = DB::table('portfolios')
                    ->select('category', DB::raw('count(*) as count'))
                    ->groupBy('category')
                    ->pluck('count', 'category');

                // Content plans last 7 days
                $data['content_plans_last_7_days'] = (function () {
                    $rows = DB::table('content_plans')
                        ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                        ->where('created_at', '>=', now()->subDays(6))
                        ->groupBy(DB::raw('DATE(created_at)'))
                        ->orderBy(DB::raw('DATE(created_at)'))
                        ->get()
                        ->pluck('count', 'date')
                        ->toArray();

                    $labels = [];
                    $data_points = [];
                    for ($i = 6; $i >= 0; $i--) {
                        $d = now()->subDays($i)->format('Y-m-d');
                        $labels[] = now()->subDays($i)->format('M j');
                        $data_points[] = isset($rows[$d]) ? (int) $rows[$d] : 0;
                    }

                    return ['labels' => $labels, 'data' => $data_points];
                })();
            }

            return inertia('dashboard', $data);
        })->name('dashboard');

        Route::resource('projects', \App\Http\Controllers\ProjectController::class);
        Route::resource('tasks', \App\Http\Controllers\TaskController::class);
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
    Route::middleware('role:direktur_utama,direktur_operasional,admin_operasional')->group(function () {
        Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
        Route::put('invoices/{invoice}/status', [\App\Http\Controllers\InvoiceController::class, 'updateStatus'])->name('invoices.status');
        Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
        Route::resource('letters', \App\Http\Controllers\LetterController::class);
        Route::get('letters/{letter}/preview', [\App\Http\Controllers\LetterController::class, 'previewPdf'])->name('letters.preview');
        Route::get('letters/{letter}/pdf', [\App\Http\Controllers\LetterController::class, 'downloadPdf'])->name('letters.pdf');
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

    // Announcements - CRUD for direktur utama, read-only for others
    Route::middleware('role:direktur_utama')->group(function () {
        Route::resource('announcements', \App\Http\Controllers\AnnouncementController::class)->except(['index', 'show']);
    });
    Route::get('announcements', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('announcements/{announcement}', [\App\Http\Controllers\AnnouncementController::class, 'show'])->name('announcements.show');
});

require __DIR__.'/settings.php';
