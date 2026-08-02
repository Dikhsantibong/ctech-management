<?php

namespace App\Http\Controllers;

use App\Models\KpiTarget;
use App\Services\KpiService;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KpiController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly KpiService $kpi)
    {
    }

    /** Monitoring seluruh role — hanya direktur utama. */
    public function index(Request $request)
    {
        $period = KpiService::normalizePeriod($request->query('period'));

        return Inertia::render('kpi/index', [
            'period' => $period,
            'periods' => KpiService::availablePeriods(),
            'roles' => $this->kpi->forAllRoles($period),
        ]);
    }

    public function updateTarget(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|in:' . implode(',', KpiService::ROLES),
            'metric_key' => 'required|string|max:64',
            'period' => 'required|date_format:Y-m',
            'target_value' => 'required|numeric|min:0',
        ]);

        // Pastikan metrik memang milik role tersebut, bukan kiriman sembarangan
        $definitions = KpiService::definitions()[$validated['role']] ?? [];
        abort_unless(array_key_exists($validated['metric_key'], $definitions), 422, 'Metrik tidak dikenal untuk role ini.');

        KpiTarget::updateOrCreate(
            [
                'role' => $validated['role'],
                'metric_key' => $validated['metric_key'],
                'period' => $validated['period'],
            ],
            [
                'target_value' => $validated['target_value'],
                'updated_by' => Auth::id(),
            ],
        );

        $label = $definitions[$validated['metric_key']]['label'];
        $roleLabel = KpiService::ROLE_LABELS[$validated['role']];

        $this->logActivity('updated', 'KpiTarget', 0, "Mengubah target KPI {$label} ({$roleLabel}) periode {$validated['period']}");

        Inertia::flash('toast', ['type' => 'success', 'message' => "Target {$label} diperbarui."]);

        return redirect()->back();
    }

    public function resetTarget(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|in:' . implode(',', KpiService::ROLES),
            'metric_key' => 'required|string|max:64',
            'period' => 'required|date_format:Y-m',
        ]);

        KpiTarget::where($validated)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Target dikembalikan ke nilai bawaan.']);

        return redirect()->back();
    }
}
