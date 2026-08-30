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

Route::get('/', [\App\Http\Controllers\PublicController::class, 'home'])->name('home');

Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

Route::get('/berita', [\App\Http\Controllers\PublicController::class, 'newsIndex'])->name('public.news.index');
Route::get('/berita/{slug}', [\App\Http\Controllers\PublicController::class, 'newsShow'])->name('public.news.show');

Route::get('/tentang', [\App\Http\Controllers\PublicController::class, 'about'])->name('public.about');

Route::get('/layanan', [\App\Http\Controllers\PublicController::class, 'services'])->name('public.services');

Route::get('/kontak', [\App\Http\Controllers\PublicController::class, 'contact'])->name('public.contact');

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
    Route::put('/milestones/{milestone}', [ProjectMilestoneController::class, 'update']);
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
                    // "Unpaid" bukan status yang valid (Draft/Sent/Paid/Overdue), jadi nilainya selalu 0
                    'unpaid_invoices' => \App\Models\Invoice::where('status', '!=', 'Paid')->sum('total'),
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
                // Kolomnya bernama scheduled_date; scheduled_at milik tabel meetings
                $data['recent_contents'] = \App\Models\ContentPlan::orderBy('scheduled_date', 'desc')->take(5)->get();
                $data['recent_clients'] = \App\Models\Client::latest()->take(5)->get();

                // Chart Data
                $data['content_platform_chart'] = \App\Models\ContentPlan::selectRaw('platform, count(*) as count')->groupBy('platform')->pluck('count', 'platform');
                $data['portfolio_category_chart'] = \App\Models\Portfolio::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category');
            }

            // administrasi
            if ($role === 'administrasi') {
                // Surat masuk = IncomingLetter, surat keluar = Letter.
                // Model SuratMasuk/SuratKeluar tidak pernah ada sehingga dashboard role ini selalu fatal.
                $suratMasuk = \App\Models\IncomingLetter::count();
                $suratKeluar = \App\Models\Letter::count();

                $data['stats'] = [
                    'surat_masuk' => $suratMasuk,
                    'surat_keluar' => $suratKeluar,
                    // Status invoice yang valid: Draft, Sent, Paid, Overdue — tidak ada "Unpaid"
                    'invoices_pending' => \App\Models\Invoice::where('status', '!=', 'Paid')->count(),
                    'total_documents' => \App\Models\Document::count(),
                ];

                // Invoice tidak punya relasi project (hanya menyimpan client_name)
                $data['recent_invoices'] = \App\Models\Invoice::where('status', '!=', 'Paid')
                    ->latest()->take(5)->get();

                // Chart Data
                $data['invoice_status_chart'] = \App\Models\Invoice::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');

                // Manual build of document categories since there's no single column for type
                $data['document_category_chart'] = [
                    'Surat Masuk' => $suratMasuk,
                    'Surat Keluar' => $suratKeluar,
                    'Dokumen Internal' => \App\Models\Document::count(),
                ];
            }

            // Setiap role melihat capaian KPI-nya sendiri di dashboard
            $data['kpi'] = app(\App\Services\KpiService::class)->forRole($role);

            return inertia('dashboard', $data);
        })->name('dashboard');

        Route::middleware('menu:projects')->group(function () {
            Route::resource('projects', \App\Http\Controllers\ProjectController::class);

        Route::put('/projects/{project}/metadata', [\App\Http\Controllers\ProjectController::class, 'updateMetadata'])->name('projects.metadata.update');
        Route::post('/projects/{project}/revisions', [\App\Http\Controllers\ProjectController::class, 'storeRevision'])->name('projects.revisions.store');
        Route::put('/projects/{project}/revisions/{revision}/status', [\App\Http\Controllers\ProjectController::class, 'updateRevisionStatus'])->name('projects.revisions.status');
        Route::post('/projects/{project}/feedbacks', [\App\Http\Controllers\ProjectController::class, 'storeFeedback'])->name('projects.feedbacks.store');
        Route::put('/projects/{project}/feedbacks/{feedback}/status', [\App\Http\Controllers\ProjectController::class, 'updateFeedbackStatus'])->name('projects.feedbacks.status');
        Route::post('/projects/{project}/feedbacks/{feedback}/convert-to-task', [\App\Http\Controllers\ProjectController::class, 'convertFeedbackToTask'])->name('projects.feedbacks.convert');
        });

        Route::resource('tasks', \App\Http\Controllers\TaskController::class)->middleware('menu:tasks');
        Route::get('works/report', [\App\Http\Controllers\WorkController::class, 'report'])->middleware('menu:works')->name('works.report');
        Route::resource('works', \App\Http\Controllers\WorkController::class)->middleware('menu:works');
        Route::get('content-plans/report', [\App\Http\Controllers\ContentPlanController::class, 'report'])->middleware('menu:content-plans')->name('content-plans.report');
        Route::put('content-plans/{content_plan}/status', [\App\Http\Controllers\ContentPlanController::class, 'updateStatus'])->middleware('menu:content-plans')->name('content-plans.status');
        Route::post('content-plans/{content_plan}/publish', [\App\Http\Controllers\ContentPlanController::class, 'publishNow'])->middleware('menu:content-plans')->name('content-plans.publish');
        Route::resource('content-plans', \App\Http\Controllers\ContentPlanController::class)->except(['create', 'edit', 'show'])->middleware('menu:content-plans');
        Route::resource('news', \App\Http\Controllers\NewsController::class)->except(['create', 'edit', 'show'])->middleware('menu:news');
        Route::resource('portfolios', \App\Http\Controllers\PortfolioController::class)->except(['create', 'edit', 'show'])->middleware('menu:portfolios');
        Route::get('calendar', [\App\Http\Controllers\CalendarController::class, 'index'])->middleware('menu:calendar')->name('calendar.index');
    });

    // Akses ditentukan hak akses menu (diatur direktur utama), bukan daftar role tetap
    Route::middleware('menu:invoices')->group(function () {
        Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
        Route::put('invoices/{invoice}/status', [\App\Http\Controllers\InvoiceController::class, 'updateStatus'])->name('invoices.status');
        Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
        Route::get('invoices/{invoice}/kwitansi', [\App\Http\Controllers\InvoiceController::class, 'downloadKwitansi'])->name('invoices.kwitansi');
    });

    Route::middleware('menu:app-subscriptions')->group(function () {
        Route::resource('app-subscriptions', \App\Http\Controllers\AppSubscriptionController::class)->except(['create', 'edit', 'show']);

        // Pencatatan pembayaran — sumber angka "sudah dibayar"
        Route::post('app-subscriptions/{app_subscription}/payments', [\App\Http\Controllers\AppSubscriptionController::class, 'recordPayment'])->name('app-subscriptions.payments.store');
        Route::delete('app-subscriptions/{app_subscription}/payments/{payment}', [\App\Http\Controllers\AppSubscriptionController::class, 'destroyPayment'])->name('app-subscriptions.payments.destroy');

        // Kelola kategori aplikasi (POS App, Photobooth App, dst.)
        Route::post('app-categories', [\App\Http\Controllers\AppSubscriptionController::class, 'storeCategory'])->name('app-categories.store');
        Route::put('app-categories/{category}', [\App\Http\Controllers\AppSubscriptionController::class, 'updateCategory'])->name('app-categories.update');
        Route::delete('app-categories/{category}', [\App\Http\Controllers\AppSubscriptionController::class, 'destroyCategory'])->name('app-categories.destroy');
    });

    Route::middleware('menu:letters')->group(function () {
        Route::resource('letters', \App\Http\Controllers\LetterController::class);
        Route::get('letters/{letter}/preview', [\App\Http\Controllers\LetterController::class, 'previewPdf'])->name('letters.preview');
        Route::get('letters/{letter}/pdf', [\App\Http\Controllers\LetterController::class, 'downloadPdf'])->name('letters.pdf');
    });

    Route::middleware('menu:incoming-letters')->group(function () {
        Route::resource('incoming-letters', \App\Http\Controllers\IncomingLetterController::class)->except(['create', 'edit']);
        Route::get('incoming-letters/{incoming_letter}/download', [\App\Http\Controllers\IncomingLetterController::class, 'downloadAttachment'])->name('incoming-letters.download');
    });

    Route::resource('documents', \App\Http\Controllers\DocumentController::class)->middleware('menu:documents');

    Route::middleware('menu:files')->group(function () {
        Route::resource('files', \App\Http\Controllers\FileController::class)->except(['create', 'edit', 'update', 'show']);
        Route::get('files/{file}/download', [\App\Http\Controllers\FileController::class, 'download'])->name('files.download');
        Route::get('files/{file}/preview', [\App\Http\Controllers\FileController::class, 'preview'])->name('files.preview');
    });

    // Monitoring KPI seluruh role
    Route::middleware('menu:kpi')->group(function () {
        Route::get('kpi', [\App\Http\Controllers\KpiController::class, 'index'])->name('kpi.index');
        Route::put('kpi/target', [\App\Http\Controllers\KpiController::class, 'updateTarget'])->name('kpi.target.update');
        Route::delete('kpi/target', [\App\Http\Controllers\KpiController::class, 'resetTarget'])->name('kpi.target.reset');
    });

    // Pengaturan akun media sosial untuk posting otomatis
    Route::middleware('menu:social-accounts')->group(function () {
        Route::get('social-accounts', [\App\Http\Controllers\SocialAccountController::class, 'index'])->name('social-accounts.index');
        Route::put('social-accounts/{platform}', [\App\Http\Controllers\SocialAccountController::class, 'update'])->name('social-accounts.update');
        Route::delete('social-accounts/{platform}', [\App\Http\Controllers\SocialAccountController::class, 'disconnect'])->name('social-accounts.disconnect');
    });

    Route::resource('users', \App\Http\Controllers\UserController::class)->middleware('menu:users');
    // Sebelumnya hanya direktur utama, padahal sidebar menampilkannya ke operation & marketing
    Route::resource('clients', \App\Http\Controllers\ClientController::class)->middleware('menu:clients');
    Route::get('activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->middleware('menu:activity-logs')->name('activity-logs.index');

    // Pengaturan hak akses menu — hanya direktur utama, agar tidak bisa dialihkan ke role lain
    Route::middleware('role:' . \App\Support\MenuRegistry::SUPER_ROLE)->group(function () {
        Route::get('role-permissions', [\App\Http\Controllers\RolePermissionController::class, 'index'])->name('role-permissions.index');
        Route::put('role-permissions', [\App\Http\Controllers\RolePermissionController::class, 'update'])->name('role-permissions.update');
    });

    // Daily Reports UI
    Route::get('/daily-reports', function () {
        return inertia('daily-reports/index', [
            'users' => \App\Models\User::all(),
            'projects' => \App\Models\Project::where('status', '!=', 'Completed')->get()
        ]);
    })->middleware('menu:daily-reports')->name('daily-reports.index');

    // API-like endpoints for stateful fetch (with session auth)
    // Semua endpoint /api/v1/* WAJIB di sini, bukan di routes/api.php:
    // grup middleware "api" stateless sehingga session tidak terbaca dan request dibalas 401.
    Route::get('/api/v1/projects/{project}/activities', [\App\Http\Controllers\Api\V1\ProjectActivityController::class, 'index']);

    // Milestones
    Route::post('/api/v1/projects/{project}/milestones', [\App\Http\Controllers\Api\V1\ProjectMilestoneController::class, 'store']);
    Route::put('/api/v1/milestones/{milestone}', [\App\Http\Controllers\Api\V1\ProjectMilestoneController::class, 'update']);
    Route::put('/api/v1/milestones/{milestone}/progress', [\App\Http\Controllers\Api\V1\ProjectMilestoneController::class, 'updateProgress']);
    Route::post('/api/v1/milestones/{milestone}/calculate-progress', [\App\Http\Controllers\Api\V1\ProjectMilestoneController::class, 'calculateProgress']);
    Route::delete('/api/v1/milestones/{milestone}', [\App\Http\Controllers\Api\V1\ProjectMilestoneController::class, 'destroy']);

    // Project documents
    Route::get('/api/v1/projects/{project}/documents', [\App\Http\Controllers\Api\V1\ProjectDocumentController::class, 'index']);
    Route::post('/api/v1/projects/{project}/document-folders', [\App\Http\Controllers\Api\V1\ProjectDocumentController::class, 'storeFolder']);
    Route::post('/api/v1/projects/{project}/documents', [\App\Http\Controllers\Api\V1\ProjectDocumentController::class, 'storeDocument']);
    Route::get('/api/v1/documents/{document}/download', [\App\Http\Controllers\Api\V1\ProjectDocumentController::class, 'download']);
    Route::delete('/api/v1/documents/{document}', [\App\Http\Controllers\Api\V1\ProjectDocumentController::class, 'destroy']);

    // Meetings
    Route::get('/api/v1/projects/{project}/meetings', [\App\Http\Controllers\Api\V1\ProjectMeetingController::class, 'index']);
    Route::post('/api/v1/projects/{project}/meetings', [\App\Http\Controllers\Api\V1\ProjectMeetingController::class, 'store']);
    Route::put('/api/v1/meetings/{meeting}/minutes', [\App\Http\Controllers\Api\V1\ProjectMeetingController::class, 'updateMinutes']);
    Route::post('/api/v1/meetings/{meeting}/action-items', [\App\Http\Controllers\Api\V1\ProjectMeetingController::class, 'storeActionItem']);


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
