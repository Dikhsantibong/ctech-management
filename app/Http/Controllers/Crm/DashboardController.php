<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\CrmActivity;
use App\Models\Prospect;
use App\Models\Quotation;
use App\Models\User;
use App\Support\Crm;
use App\Support\MenuRegistry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $seesAll = $user->role === MenuRegistry::SUPER_ROLE;

        // Sales hanya melihat prospek miliknya; manajemen/direktur melihat semua.
        $scope = fn ($query) => $seesAll ? $query : $query->where('sales_id', $user->id);

        $baseProspects = fn () => $scope(Prospect::query());

        $stageBreakdown = collect(Crm::stages())->map(function ($stage) use ($baseProspects) {
            $rows = (clone $baseProspects())->where('stage', $stage);

            return [
                'stage' => $stage,
                'count' => (clone $rows)->count(),
                'value' => (float) (clone $rows)->sum('estimated_value'),
            ];
        })->values();

        $todayActivities = CrmActivity::query()
            ->with(['prospect:id,company_name,pic_name', 'user:id,name'])
            ->when(! $seesAll, fn ($q) => $q->where('user_id', $user->id))
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $overdue = (clone $baseProspects())
            ->overdueFollowUp()
            ->with('sales:id,name')
            ->orderBy('next_follow_up_at')
            ->limit(20)
            ->get();

        return Inertia::render('crm/dashboard', [
            'stats' => [
                'total_prospects' => (clone $baseProspects())->count(),
                'active_prospects' => (clone $baseProspects())->where('status', 'Aktif')->count(),
                'today_activities' => CrmActivity::query()
                    ->when(! $seesAll, fn ($q) => $q->where('user_id', $user->id))
                    ->whereDate('scheduled_at', today())->where('status', 'Terjadwal')->count(),
                'overdue_followups' => (clone $baseProspects())->overdueFollowUp()->count(),
                'active_pipeline' => (clone $baseProspects())->where('status', 'Aktif')->whereIn('stage', Crm::openStages())->count(),
                'active_quotations' => $this->quotationQuery($seesAll, $user)->whereIn('status', ['Draft', 'Terkirim'])->count(),
                'won' => (clone $baseProspects())->whereIn('status', ['Berhasil', 'Dikonversi'])->count(),
                'lost' => (clone $baseProspects())->where('status', 'Tidak Berhasil')->count(),
                'pipeline_value' => (float) (clone $baseProspects())->where('status', 'Aktif')->sum('estimated_value'),
                'quotation_value' => (float) $this->quotationQuery($seesAll, $user)->whereIn('status', ['Draft', 'Terkirim'])->sum('total'),
                'closing_value' => (float) (clone $baseProspects())->whereIn('status', ['Berhasil', 'Dikonversi'])->sum('estimated_value'),
            ],
            'pipeline' => $stageBreakdown,
            'todayActivities' => $todayActivities,
            'overdueFollowUps' => $overdue,
            'sourceBreakdown' => (clone $baseProspects())
                ->selectRaw('source, count(*) as count')
                ->whereNotNull('source')
                ->groupBy('source')
                ->orderByDesc('count')
                ->get(),
        ]);
    }

    /**
     * Penawaran yang terhubung ke prospek dalam cakupan sales terkait.
     */
    private function quotationQuery(bool $seesAll, User $user)
    {
        return Quotation::query()
            ->whereNotNull('prospect_id')
            ->when(! $seesAll, function ($q) use ($user) {
                $q->whereHas('prospect', fn ($p) => $p->where('sales_id', $user->id));
            });
    }
}
