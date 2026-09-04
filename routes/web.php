<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Api\V1\ClientFeedbackController;
use App\Http\Controllers\Api\V1\DailyReportController;
use App\Http\Controllers\Api\V1\ProjectActivityController;
use App\Http\Controllers\Api\V1\ProjectDocumentController;
use App\Http\Controllers\Api\V1\ProjectMeetingController;
use App\Http\Controllers\Api\V1\ProjectMilestoneController;
use App\Http\Controllers\Api\V1\ProjectRevisionController;
use App\Http\Controllers\AppSubscriptionController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContentPlanController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\IncomingLetterController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SocialAccountController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkController;
use App\Models\ActivityLog;
use App\Models\Announcement;
use App\Models\Client;
use App\Models\ContentPlan;
use App\Models\Document;
use App\Models\IncomingLetter;
use App\Models\Invoice;
use App\Models\Letter;
use App\Models\News;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\ProjectFinancial;
use App\Models\ProjectMilestone;
use App\Models\Task;
use App\Models\User;
use App\Services\KpiService;
use App\Support\MenuRegistry;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/berita', [PublicController::class, 'newsIndex'])->name('public.news.index');
Route::get('/berita/{slug}', [PublicController::class, 'newsShow'])->name('public.news.show');

Route::get('/tentang', [PublicController::class, 'about'])->name('public.about');

Route::get('/layanan', [PublicController::class, 'services'])->name('public.services');

Route::get('/kontak', [PublicController::class, 'contact'])->name('public.contact');

Route::prefix('solusi')->group(function () {
    Route::get('/photobooth', function () {
        return inertia('public/solutions/photobooth');
    })->name('public.solutions.photobooth');
});

Route::get('/industri', function () {
    $portfolios = Portfolio::latest()->take(6)->get();

    return inertia('public/industries/index', ['portfolios' => $portfolios]);
})->name('public.industries');
Route::get('/proses', function () {
    return inertia('public/process/index');
})->name('public.process');
Route::get('/case-studi', function () {
    $category = request()->input('category');
    $portfolios = Portfolio::when($category, function ($query, $category) {
        return $query->where('category', $category);
    })
        ->latest()
        ->get();
    $categories = Portfolio::select('category')->distinct()->pluck('category');

    return inertia('public/case-studies/index', [
        'portfolios' => $portfolios,
        'categories' => $categories,
        'filters' => ['category' => $category],
    ]);
})->name('public.case-studies');

Route::get('/produk', function () {
    return inertia('public/products/index');
})->name('public.products');

Route::get('/produk/{product}', function ($product) {
    $validProducts = ['paylo', 'booth'];
    if (! in_array($product, $validProducts)) {
        abort(404);
    }

    return inertia("public/products/{$product}");
})->name('public.products.show');

Route::get('/portfolio', [PublicController::class, 'portfolioIndex'])->name('public.portfolio.index');
Route::get('/portfolio/{id}', [PublicController::class, 'portfolioShow'])->name('public.portfolio.show');

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
                'announcements' => Announcement::active()->forRole($role)->latest()->take(3)->get(),
                'activity_logs' => ActivityLog::with('user')->latest()->take(8)->get(),
            ];

            // direktur_utama (CEO)
            if ($role === 'direktur_utama') {
                $active_projects = Project::whereNotIn('status', ['Completed'])->count();
                $delayed_projects = Project::whereHas('milestones', function ($q) {
                    $q->where('status', 'Delayed');
                })->count();
                $project_health = $active_projects > 0 ? round((($active_projects - $delayed_projects) / $active_projects) * 100) : 100;

                $data['stats'] = [
                    'active_projects' => $active_projects,
                    'completed_projects' => Project::where('status', 'Completed')->count(),
                    'delayed_projects' => $delayed_projects,
                    'team_members' => User::count(),
                    'project_health' => $project_health, // percentage
                    'active_clients' => Client::count(),
                    // "Unpaid" bukan status yang valid (Draft/Sent/Paid/Overdue), jadi nilainya selalu 0
                    'unpaid_invoices' => Invoice::where('status', '!=', 'Paid')->sum('total'),
                    'paid_invoices' => Invoice::where('status', 'Paid')->sum('total'),
                ];

                // Team workload
                $data['team_workload'] = User::withCount(['tasks' => function ($query) {
                    $query->whereNotIn('status', ['Done']);
                }])->orderBy('tasks_count', 'desc')->take(5)->get();

                // Client overview (clients with most active projects)
                $data['client_overview'] = Project::selectRaw('client_name, count(*) as count')
                    ->whereNotIn('status', ['Completed'])
                    ->groupBy('client_name')
                    ->orderBy('count', 'desc')
                    ->take(5)->get();

                $data['financials'] = ProjectFinancial::selectRaw('SUM(contract_value) as total_revenue, SUM(cost) as total_cost, SUM(profit) as total_profit')->first();

                $data['upcoming_deadlines'] = Project::whereNotNull('deadline')
                    ->where('status', '!=', 'Completed')
                    ->orderBy('deadline')
                    ->take(5)->get();

                // Chart Data
                $data['project_status_chart'] = Project::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');

                // Real revenue trend (Paid invoices over the last 7 months)
                $months = collect(range(6, 0))->map(function ($i) {
                    return now()->subMonths($i)->format('M');
                })->values()->toArray();

                $revenueData = [];
                for ($i = 6; $i >= 0; $i--) {
                    $monthStart = now()->subMonths($i)->startOfMonth();
                    $monthEnd = now()->subMonths($i)->endOfMonth();

                    $sum = Invoice::where('status', 'Paid')
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
                    'project_assigned' => Project::whereHas('tasks', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })->count(),
                    'pending_tasks' => Task::where('user_id', $user->id)->where('status', '!=', 'Done')->count(),
                    'today_tasks' => Task::where('user_id', $user->id)->whereDate('deadline', now()->format('Y-m-d'))->count(),
                ];
                $data['milestones_progress'] = ProjectMilestone::with('project')
                    ->where('status', 'In Progress')
                    ->latest()
                    ->take(5)->get();
                $data['my_tasks'] = Task::with('project')
                    ->where('user_id', $user->id)
                    ->where('status', '!=', 'Done')
                    ->orderBy('deadline')
                    ->take(5)->get();

                // Chart Data
                $data['task_status_chart'] = Task::where('user_id', $user->id)->selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');
            }

            // marketing
            if ($role === 'marketing') {
                $data['stats'] = [
                    'active_portfolios' => Portfolio::count(),
                    'published_news' => News::where('status', 'Published')->count(),
                    'content_plans' => ContentPlan::where('status', 'Scheduled')->count(),
                    'total_clients' => Client::count(),
                ];
                // Kolomnya bernama scheduled_date; scheduled_at milik tabel meetings
                $data['recent_contents'] = ContentPlan::orderBy('scheduled_date', 'desc')->take(5)->get();
                $data['recent_clients'] = Client::latest()->take(5)->get();

                // Chart Data
                $data['content_platform_chart'] = ContentPlan::selectRaw('platform, count(*) as count')->groupBy('platform')->pluck('count', 'platform');
                $data['portfolio_category_chart'] = Portfolio::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category');
            }

            // administrasi
            if ($role === 'administrasi') {
                // Surat masuk = IncomingLetter, surat keluar = Letter.
                // Model SuratMasuk/SuratKeluar tidak pernah ada sehingga dashboard role ini selalu fatal.
                $suratMasuk = IncomingLetter::count();
                $suratKeluar = Letter::count();

                $data['stats'] = [
                    'surat_masuk' => $suratMasuk,
                    'surat_keluar' => $suratKeluar,
                    // Status invoice yang valid: Draft, Sent, Paid, Overdue — tidak ada "Unpaid"
                    'invoices_pending' => Invoice::where('status', '!=', 'Paid')->count(),
                    'total_documents' => Document::count(),
                ];

                // Invoice tidak punya relasi project (hanya menyimpan client_name)
                $data['recent_invoices'] = Invoice::where('status', '!=', 'Paid')
                    ->latest()->take(5)->get();

                // Chart Data
                $data['invoice_status_chart'] = Invoice::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status');

                // Manual build of document categories since there's no single column for type
                $data['document_category_chart'] = [
                    'Surat Masuk' => $suratMasuk,
                    'Surat Keluar' => $suratKeluar,
                    'Dokumen Internal' => Document::count(),
                ];
            }

            // Setiap role melihat capaian KPI-nya sendiri di dashboard
            $data['kpi'] = app(KpiService::class)->forRole($role);

            return inertia('dashboard', $data);
        })->name('dashboard');

        Route::middleware('menu:projects')->group(function () {
            Route::resource('projects', ProjectController::class);

            Route::put('/projects/{project}/metadata', [ProjectController::class, 'updateMetadata'])->name('projects.metadata.update');
            Route::post('/projects/{project}/revisions', [ProjectController::class, 'storeRevision'])->name('projects.revisions.store');
            Route::put('/projects/{project}/revisions/{revision}/status', [ProjectController::class, 'updateRevisionStatus'])->name('projects.revisions.status');
            Route::post('/projects/{project}/feedbacks', [ProjectController::class, 'storeFeedback'])->name('projects.feedbacks.store');
            Route::put('/projects/{project}/feedbacks/{feedback}/status', [ProjectController::class, 'updateFeedbackStatus'])->name('projects.feedbacks.status');
            Route::post('/projects/{project}/feedbacks/{feedback}/convert-to-task', [ProjectController::class, 'convertFeedbackToTask'])->name('projects.feedbacks.convert');
        });

        Route::resource('tasks', TaskController::class)->middleware('menu:tasks');
        Route::get('works/report', [WorkController::class, 'report'])->middleware('menu:works')->name('works.report');
        Route::resource('works', WorkController::class)->middleware('menu:works');
        Route::get('content-plans/report', [ContentPlanController::class, 'report'])->middleware('menu:content-plans')->name('content-plans.report');
        Route::put('content-plans/{content_plan}/status', [ContentPlanController::class, 'updateStatus'])->middleware('menu:content-plans')->name('content-plans.status');
        Route::post('content-plans/{content_plan}/publish', [ContentPlanController::class, 'publishNow'])->middleware('menu:content-plans')->name('content-plans.publish');
        Route::resource('content-plans', ContentPlanController::class)->except(['create', 'edit', 'show'])->middleware('menu:content-plans');
        Route::resource('news', NewsController::class)->except(['create', 'edit', 'show'])->middleware('menu:news');
        Route::resource('portfolios', PortfolioController::class)->except(['create', 'edit', 'show'])->middleware('menu:portfolios');
        Route::get('calendar', [CalendarController::class, 'index'])->middleware('menu:calendar')->name('calendar.index');
    });

    // Akses ditentukan hak akses menu (diatur direktur utama), bukan daftar role tetap
    Route::middleware('menu:invoices')->group(function () {
        Route::post('invoices/preview-draft', [InvoiceController::class, 'previewDraft'])->name('invoices.preview-draft');
        Route::resource('invoices', InvoiceController::class);
        Route::put('invoices/{invoice}/status', [InvoiceController::class, 'updateStatus'])->name('invoices.status');
        Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
        Route::get('invoices/{invoice}/kwitansi', [InvoiceController::class, 'downloadKwitansi'])->name('invoices.kwitansi');
    });

    Route::middleware('menu:quotations')->group(function () {
        Route::post('quotations/preview-draft', [QuotationController::class, 'previewDraft'])->name('quotations.preview-draft');
        Route::resource('quotations', QuotationController::class);
        Route::put('quotations/{quotation}/status', [QuotationController::class, 'updateStatus'])->name('quotations.status');
        Route::put('quotations/{quotation}/verify', [QuotationController::class, 'verifyDocument'])->name('quotations.verify');
        Route::put('quotations/{quotation}/unverify', [QuotationController::class, 'unverifyDocument'])->name('quotations.unverify');
        Route::get('quotations/{quotation}/pdf', [QuotationController::class, 'downloadPdf'])->name('quotations.pdf');
        Route::get('quotations/{quotation}/preview', [QuotationController::class, 'previewPdf'])->name('quotations.preview');
    });

    Route::middleware('menu:app-subscriptions')->group(function () {
        Route::resource('app-subscriptions', AppSubscriptionController::class)->except(['create', 'edit', 'show']);

        // Pencatatan pembayaran — sumber angka "sudah dibayar"
        Route::post('app-subscriptions/{app_subscription}/payments', [AppSubscriptionController::class, 'recordPayment'])->name('app-subscriptions.payments.store');
        Route::delete('app-subscriptions/{app_subscription}/payments/{payment}', [AppSubscriptionController::class, 'destroyPayment'])->name('app-subscriptions.payments.destroy');

        // Kelola kategori aplikasi (POS App, Photobooth App, dst.)
        Route::post('app-categories', [AppSubscriptionController::class, 'storeCategory'])->name('app-categories.store');
        Route::put('app-categories/{category}', [AppSubscriptionController::class, 'updateCategory'])->name('app-categories.update');
        Route::delete('app-categories/{category}', [AppSubscriptionController::class, 'destroyCategory'])->name('app-categories.destroy');
    });

    Route::middleware('menu:letters')->group(function () {
        Route::post('letters/preview-draft', [LetterController::class, 'previewDraft'])->name('letters.preview-draft');
        Route::get('letters/verify', [LetterController::class, 'verify'])->name('letters.verify');
        Route::post('letters/verify', [LetterController::class, 'verify'])->name('letters.verify.check');
        Route::resource('letters', LetterController::class);
        Route::put('letters/{letter}/verify', [LetterController::class, 'verifyDocument'])->name('letters.verify-document');
        Route::put('letters/{letter}/unverify', [LetterController::class, 'unverifyDocument'])->name('letters.unverify-document');
        Route::get('letters/{letter}/preview', [LetterController::class, 'previewPdf'])->name('letters.preview');
        Route::get('letters/{letter}/pdf', [LetterController::class, 'downloadPdf'])->name('letters.pdf');
    });

    Route::middleware('menu:incoming-letters')->group(function () {
        Route::resource('incoming-letters', IncomingLetterController::class)->except(['create', 'edit']);
        Route::get('incoming-letters/{incoming_letter}/download', [IncomingLetterController::class, 'downloadAttachment'])->name('incoming-letters.download');
    });

    Route::resource('documents', DocumentController::class)->middleware('menu:documents');

    Route::middleware('menu:files')->group(function () {
        Route::resource('files', FileController::class)->except(['create', 'edit', 'update', 'show']);
        Route::get('files/{file}/download', [FileController::class, 'download'])->name('files.download');
        Route::get('files/{file}/preview', [FileController::class, 'preview'])->name('files.preview');
    });

    // Monitoring KPI seluruh role
    Route::middleware('menu:kpi')->group(function () {
        Route::get('kpi', [KpiController::class, 'index'])->name('kpi.index');
        Route::put('kpi/target', [KpiController::class, 'updateTarget'])->name('kpi.target.update');
        Route::delete('kpi/target', [KpiController::class, 'resetTarget'])->name('kpi.target.reset');
    });

    // Pengaturan akun media sosial untuk posting otomatis
    Route::middleware('menu:social-accounts')->group(function () {
        Route::get('social-accounts', [SocialAccountController::class, 'index'])->name('social-accounts.index');
        Route::put('social-accounts/{platform}', [SocialAccountController::class, 'update'])->name('social-accounts.update');
        Route::delete('social-accounts/{platform}', [SocialAccountController::class, 'disconnect'])->name('social-accounts.disconnect');
    });

    Route::resource('users', UserController::class)->middleware('menu:users');
    // Sebelumnya hanya direktur utama, padahal sidebar menampilkannya ke operation & marketing
    Route::resource('clients', ClientController::class)->middleware('menu:clients');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->middleware('menu:activity-logs')->name('activity-logs.index');

    // Pengaturan hak akses menu — hanya direktur utama, agar tidak bisa dialihkan ke role lain
    Route::middleware('role:'.MenuRegistry::SUPER_ROLE)->group(function () {
        Route::get('role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
        Route::put('role-permissions', [RolePermissionController::class, 'update'])->name('role-permissions.update');
    });

    // Daily Reports UI
    Route::get('/daily-reports', function () {
        return inertia('daily-reports/index', [
            'users' => User::all(),
            'projects' => Project::where('status', '!=', 'Completed')->get(),
        ]);
    })->middleware('menu:daily-reports')->name('daily-reports.index');

    // API-like endpoints for stateful fetch (with session auth)
    // Semua endpoint /api/v1/* WAJIB di sini, bukan di routes/api.php:
    // grup middleware "api" stateless sehingga session tidak terbaca dan request dibalas 401.
    Route::get('/api/v1/projects/{project}/activities', [ProjectActivityController::class, 'index']);

    // Milestones
    Route::post('/api/v1/projects/{project}/milestones', [ProjectMilestoneController::class, 'store']);
    Route::put('/api/v1/milestones/{milestone}', [ProjectMilestoneController::class, 'update']);
    Route::put('/api/v1/milestones/{milestone}/progress', [ProjectMilestoneController::class, 'updateProgress']);
    Route::post('/api/v1/milestones/{milestone}/calculate-progress', [ProjectMilestoneController::class, 'calculateProgress']);
    Route::delete('/api/v1/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy']);

    // Project documents
    Route::get('/api/v1/projects/{project}/documents', [ProjectDocumentController::class, 'index']);
    Route::post('/api/v1/projects/{project}/document-folders', [ProjectDocumentController::class, 'storeFolder']);
    Route::post('/api/v1/projects/{project}/documents', [ProjectDocumentController::class, 'storeDocument']);
    Route::get('/api/v1/documents/{document}/download', [ProjectDocumentController::class, 'download']);
    Route::delete('/api/v1/documents/{document}', [ProjectDocumentController::class, 'destroy']);

    // Meetings
    Route::get('/api/v1/projects/{project}/meetings', [ProjectMeetingController::class, 'index']);
    Route::post('/api/v1/projects/{project}/meetings', [ProjectMeetingController::class, 'store']);
    Route::put('/api/v1/meetings/{meeting}/minutes', [ProjectMeetingController::class, 'updateMinutes']);
    Route::post('/api/v1/meetings/{meeting}/action-items', [ProjectMeetingController::class, 'storeActionItem']);

    Route::get('/api/v1/daily-reports', [DailyReportController::class, 'index']);
    Route::post('/api/v1/daily-reports', [DailyReportController::class, 'store']);

    Route::get('/api/v1/projects/{project}/revisions', [ProjectRevisionController::class, 'index']);
    Route::post('/api/v1/projects/{project}/revisions', [ProjectRevisionController::class, 'store']);
    Route::put('/api/v1/revisions/{revision}/status', [ProjectRevisionController::class, 'update']);

    Route::get('/api/v1/projects/{project}/feedbacks', [ClientFeedbackController::class, 'index']);
    Route::post('/api/v1/projects/{project}/feedbacks', [ClientFeedbackController::class, 'store']);
    Route::put('/api/v1/feedbacks/{feedback}/status', [ClientFeedbackController::class, 'update']);

    // Dashboard routes - CRUD for direktur utama, read-only for others
    Route::middleware('role:direktur_utama')->group(function () {
        Route::resource('announcements', AnnouncementController::class)->except(['index', 'show']);
    });
    Route::get('announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('announcements/{announcement}', [AnnouncementController::class, 'show'])->name('announcements.show');
});

require __DIR__.'/settings.php';
