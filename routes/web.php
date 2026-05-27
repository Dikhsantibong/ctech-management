<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return inertia('dashboard', [
            'stats' => [
                'active_projects' => \App\Models\Project::where('status', '!=', 'Completed')->count(),
                'pending_tasks' => \App\Models\Task::where('status', '!=', 'Done')->count(),
                'unpaid_invoices' => \App\Models\Invoice::where('status', '!=', 'Paid')->count(),
                'team_members' => \App\Models\User::count(),
            ],
            'upcoming_tasks' => \App\Models\Task::with('project')->where('status', '!=', 'Done')->whereNotNull('deadline')->orderBy('deadline')->take(5)->get(),
            // task counts grouped by status for dashboard charts
            'task_status_counts' => DB::table('tasks')
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status'),
            // tasks created per day for last 7 days (time-series)
            'tasks_last_7_days' => (function () {
                $rows = DB::table('tasks')
                    ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                    ->where('created_at', '>=', now()->subDays(6))
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->orderBy(DB::raw('DATE(created_at)'))
                    ->get()
                    ->pluck('count', 'date')
                    ->toArray();

                $labels = [];
                $data = [];
                for ($i = 6; $i >= 0; $i--) {
                    $d = now()->subDays($i)->format('Y-m-d');
                    $labels[] = now()->subDays($i)->format('M j');
                    $data[] = isset($rows[$d]) ? (int) $rows[$d] : 0;
                }

                return ['labels' => $labels, 'data' => $data];
            })(),
        ]);
    })->name('dashboard');
    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('projects', \App\Http\Controllers\ProjectController::class);
    Route::resource('tasks', \App\Http\Controllers\TaskController::class);
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
    Route::put('invoices/{invoice}/status', [\App\Http\Controllers\InvoiceController::class, 'updateStatus'])->name('invoices.status');
    Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
    Route::resource('letters', \App\Http\Controllers\LetterController::class);
    Route::get('letters/{letter}/pdf', [\App\Http\Controllers\LetterController::class, 'downloadPdf'])->name('letters.pdf');
    Route::resource('documents', \App\Http\Controllers\DocumentController::class);
    Route::resource('files', \App\Http\Controllers\FileController::class)->except(['create', 'edit', 'update', 'show']);
    Route::get('files/{file}/download', [\App\Http\Controllers\FileController::class, 'download'])->name('files.download');
    Route::get('activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::resource('content-plans', \App\Http\Controllers\ContentPlanController::class)->except(['create', 'edit', 'show']);
    Route::resource('clients', \App\Http\Controllers\ClientController::class);
    Route::get('calendar', function () {
        return inertia('calendar/index', [
            // Dapat diperluas dengan data dari backend nanti
        ]);
    })->name('calendar.index');
});

require __DIR__.'/settings.php';
