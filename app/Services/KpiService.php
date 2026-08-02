<?php

namespace App\Services;

use App\Models\Client;
use App\Models\ContentPlan;
use App\Models\IncomingLetter;
use App\Models\Invoice;
use App\Models\KpiTarget;
use App\Models\Letter;
use App\Models\News;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\Task;
use Carbon\CarbonImmutable;

/**
 * Perhitungan KPI per role.
 *
 * Semua angka dihitung dari data operasional yang sudah ada — tidak ada input
 * manual — sehingga capaian tidak bisa "dipoles". Target per role/bulan disimpan
 * di tabel kpi_targets dan hanya bisa diubah direktur utama.
 */
class KpiService
{
    public const ROLES = ['direktur_utama', 'operation', 'marketing', 'administrasi'];

    public const ROLE_LABELS = [
        'direktur_utama' => 'Direktur Utama',
        'operation' => 'Operasional',
        'marketing' => 'Marketing',
        'administrasi' => 'Administrasi',
    ];

    /**
     * Definisi metrik per role.
     *
     * unit      : number | percent | currency
     * direction : up   = makin besar makin baik
     *             down = makin kecil makin baik (mis. task telat)
     * default   : target bawaan bila direktur utama belum menetapkan
     */
    public static function definitions(): array
    {
        return [
            'direktur_utama' => [
                'revenue' => [
                    'label' => 'Pendapatan Tertagih',
                    'description' => 'Total nilai invoice berstatus Lunas pada periode ini.',
                    'unit' => 'currency',
                    'direction' => 'up',
                    'default' => 50000000,
                ],
                'projects_completed' => [
                    'label' => 'Project Selesai',
                    'description' => 'Jumlah project yang berstatus Selesai pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 2,
                ],
                'project_health' => [
                    'label' => 'Kesehatan Project',
                    'description' => 'Persentase project aktif yang tidak memiliki milestone terlambat.',
                    'unit' => 'percent',
                    'direction' => 'up',
                    'default' => 90,
                ],
                'overdue_invoices' => [
                    'label' => 'Invoice Jatuh Tempo',
                    'description' => 'Invoice belum lunas yang sudah melewati tanggal jatuh tempo.',
                    'unit' => 'number',
                    'direction' => 'down',
                    'default' => 0,
                ],
            ],

            'operation' => [
                'tasks_completed' => [
                    'label' => 'Task Diselesaikan',
                    'description' => 'Jumlah task yang diselesaikan pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 20,
                ],
                'on_time_rate' => [
                    'label' => 'Ketepatan Waktu',
                    'description' => 'Persentase task bertenggat yang selesai sebelum atau tepat pada tenggatnya.',
                    'unit' => 'percent',
                    'direction' => 'up',
                    'default' => 85,
                ],
                'milestones_completed' => [
                    'label' => 'Milestone Selesai',
                    'description' => 'Jumlah milestone project yang dituntaskan pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 3,
                ],
                'overdue_tasks' => [
                    'label' => 'Task Lewat Tenggat',
                    'description' => 'Task yang belum selesai dan sudah melewati tenggat (kondisi saat ini).',
                    'unit' => 'number',
                    'direction' => 'down',
                    'default' => 0,
                ],
            ],

            'marketing' => [
                'content_published' => [
                    'label' => 'Konten Tayang',
                    'description' => 'Jumlah konten yang dipublikasikan pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 12,
                ],
                'content_on_schedule' => [
                    'label' => 'Ketepatan Jadwal Tayang',
                    'description' => 'Persentase konten yang tayang tidak melewati tanggal jadwalnya.',
                    'unit' => 'percent',
                    'direction' => 'up',
                    'default' => 90,
                ],
                'news_published' => [
                    'label' => 'Berita Terbit',
                    'description' => 'Jumlah berita berstatus Published pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 4,
                ],
                'new_clients' => [
                    'label' => 'Klien Baru',
                    'description' => 'Jumlah klien baru yang tercatat pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 2,
                ],
            ],

            'administrasi' => [
                'invoices_issued' => [
                    'label' => 'Invoice Diterbitkan',
                    'description' => 'Jumlah invoice yang dibuat pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 10,
                ],
                'collection_rate' => [
                    'label' => 'Tingkat Penagihan',
                    'description' => 'Persentase nilai invoice periode ini yang sudah lunas.',
                    'unit' => 'percent',
                    'direction' => 'up',
                    'default' => 80,
                ],
                'letters_processed' => [
                    'label' => 'Surat Diproses',
                    'description' => 'Total surat masuk dan surat keluar yang tercatat pada periode ini.',
                    'unit' => 'number',
                    'direction' => 'up',
                    'default' => 15,
                ],
                'overdue_invoices' => [
                    'label' => 'Invoice Jatuh Tempo',
                    'description' => 'Invoice belum lunas yang sudah melewati tanggal jatuh tempo.',
                    'unit' => 'number',
                    'direction' => 'down',
                    'default' => 0,
                ],
            ],
        ];
    }

    /** Periode dinormalkan ke format YYYY-MM; default bulan berjalan. */
    public static function normalizePeriod(?string $period): string
    {
        if ($period && preg_match('/^\d{4}-\d{2}$/', $period)) {
            return $period;
        }

        return CarbonImmutable::now()->format('Y-m');
    }

    /** Daftar 12 periode terakhir untuk pemilih bulan. */
    public static function availablePeriods(int $months = 12): array
    {
        $now = CarbonImmutable::now()->startOfMonth();

        return collect(range(0, $months - 1))
            ->map(fn ($i) => [
                'value' => $now->subMonths($i)->format('Y-m'),
                'label' => $now->subMonths($i)->locale('id')->translatedFormat('F Y'),
            ])
            ->all();
    }

    /** Hitung seluruh metrik satu role untuk satu periode. */
    public function forRole(string $role, ?string $period = null): array
    {
        $period = self::normalizePeriod($period);
        $definitions = self::definitions()[$role] ?? [];

        if ($definitions === []) {
            return [
                'role' => $role,
                'role_label' => self::ROLE_LABELS[$role] ?? $role,
                'period' => $period,
                'score' => null,
                'metrics' => [],
            ];
        }

        $start = CarbonImmutable::createFromFormat('Y-m', $period)->startOfMonth();
        $end = $start->endOfMonth();

        $targets = KpiTarget::where('role', $role)->where('period', $period)->pluck('target_value', 'metric_key');

        $metrics = [];
        $achievementSum = 0;

        foreach ($definitions as $key => $definition) {
            $actual = $this->measure($role, $key, $start, $end);
            $target = (float) ($targets[$key] ?? $definition['default']);
            $achievement = $this->achievement($actual, $target, $definition['direction']);

            $achievementSum += $achievement;

            $metrics[] = [
                'key' => $key,
                'label' => $definition['label'],
                'description' => $definition['description'],
                'unit' => $definition['unit'],
                'direction' => $definition['direction'],
                'actual' => $actual,
                'target' => $target,
                'achievement' => $achievement,
                'is_custom_target' => isset($targets[$key]),
            ];
        }

        return [
            'role' => $role,
            'role_label' => self::ROLE_LABELS[$role] ?? $role,
            'period' => $period,
            'score' => (int) round($achievementSum / count($definitions)),
            'metrics' => $metrics,
        ];
    }

    /** Hitung KPI seluruh role sekaligus (tampilan direktur utama). */
    public function forAllRoles(?string $period = null): array
    {
        return collect(self::ROLES)
            ->map(fn ($role) => $this->forRole($role, $period))
            ->all();
    }

    /**
     * Capaian dalam persen, dibatasi 0–150 agar satu metrik yang melonjak
     * tidak menutupi metrik lain yang tertinggal saat skor dirata-rata.
     */
    private function achievement(float $actual, float $target, string $direction): int
    {
        if ($direction === 'down') {
            // Target 0 dan realisasi 0 berarti sempurna
            if ($target <= 0) {
                return $actual <= 0 ? 100 : 0;
            }

            return (int) round(max(0, min(150, ($target / max($actual, 0.0001)) * 100)));
        }

        if ($target <= 0) {
            return 100;
        }

        return (int) round(max(0, min(150, ($actual / $target) * 100)));
    }

    private function measure(string $role, string $key, CarbonImmutable $start, CarbonImmutable $end): float
    {
        return match ($key) {
            // ===== Direktur utama =====
            'revenue' => (float) Invoice::where('status', 'Paid')
                ->whereBetween('updated_at', [$start, $end])->sum('total'),

            'projects_completed' => (float) Project::where('status', 'Completed')
                ->whereBetween('updated_at', [$start, $end])->count(),

            'project_health' => $this->projectHealth(),

            // ===== Operasional =====
            'tasks_completed' => (float) Task::where('status', 'Done')
                ->whereBetween('completed_at', [$start, $end])->count(),

            'on_time_rate' => $this->onTimeRate($start, $end),

            'milestones_completed' => (float) ProjectMilestone::where('status', 'Completed')
                ->whereBetween('completed_at', [$start, $end])->count(),

            'overdue_tasks' => (float) Task::where('status', '!=', 'Done')
                ->whereNotNull('deadline')
                ->whereDate('deadline', '<', CarbonImmutable::now()->toDateString())
                ->count(),

            // ===== Marketing =====
            'content_published' => (float) ContentPlan::whereNotNull('published_date')
                ->whereBetween('published_date', [$start->toDateString(), $end->toDateString()])
                ->count(),

            'content_on_schedule' => $this->contentOnSchedule($start, $end),

            'news_published' => (float) News::where('status', 'Published')
                ->whereBetween('created_at', [$start, $end])->count(),

            'new_clients' => (float) Client::whereBetween('created_at', [$start, $end])->count(),

            // ===== Administrasi =====
            'invoices_issued' => (float) Invoice::whereBetween('created_at', [$start, $end])->count(),

            'collection_rate' => $this->collectionRate($start, $end),

            'letters_processed' => (float) (
                IncomingLetter::whereBetween('created_at', [$start, $end])->count()
                + Letter::whereBetween('created_at', [$start, $end])->count()
            ),

            'overdue_invoices' => (float) Invoice::where('status', '!=', 'Paid')
                ->whereNotNull('due_date')
                ->whereDate('due_date', '<', CarbonImmutable::now()->toDateString())
                ->count(),

            default => 0.0,
        };
    }

    private function projectHealth(): float
    {
        $active = Project::where('status', '!=', 'Completed')->count();

        if ($active === 0) {
            return 100.0;
        }

        $delayed = Project::where('status', '!=', 'Completed')
            ->whereHas('milestones', fn ($q) => $q->where('status', 'Delayed'))
            ->count();

        return round((($active - $delayed) / $active) * 100, 1);
    }

    private function onTimeRate(CarbonImmutable $start, CarbonImmutable $end): float
    {
        $completed = Task::where('status', 'Done')
            ->whereNotNull('deadline')
            ->whereBetween('completed_at', [$start, $end])
            ->get(['deadline', 'completed_at']);

        if ($completed->isEmpty()) {
            return 0.0;
        }

        $onTime = $completed->filter(
            fn ($task) => $task->completed_at && $task->completed_at->startOfDay()->lte(CarbonImmutable::parse($task->deadline)->endOfDay()),
        )->count();

        return round(($onTime / $completed->count()) * 100, 1);
    }

    private function contentOnSchedule(CarbonImmutable $start, CarbonImmutable $end): float
    {
        $published = ContentPlan::whereNotNull('published_date')
            ->whereNotNull('scheduled_date')
            ->whereBetween('published_date', [$start->toDateString(), $end->toDateString()])
            ->get(['scheduled_date', 'published_date']);

        if ($published->isEmpty()) {
            return 0.0;
        }

        $onTime = $published->filter(
            fn ($c) => CarbonImmutable::parse($c->published_date)->lte(CarbonImmutable::parse($c->scheduled_date)),
        )->count();

        return round(($onTime / $published->count()) * 100, 1);
    }

    private function collectionRate(CarbonImmutable $start, CarbonImmutable $end): float
    {
        $total = (float) Invoice::whereBetween('created_at', [$start, $end])->sum('total');

        if ($total <= 0) {
            return 0.0;
        }

        $paid = (float) Invoice::whereBetween('created_at', [$start, $end])
            ->where('status', 'Paid')->sum('total');

        return round(($paid / $total) * 100, 1);
    }
}
