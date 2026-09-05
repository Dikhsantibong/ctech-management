<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Prospect;
use App\Support\Crm;
use App\Support\MenuRegistry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PipelineController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $seesAll = $user->role === MenuRegistry::SUPER_ROLE;

        $prospects = Prospect::query()
            ->with('sales:id,name')
            ->when(! $seesAll, fn ($q) => $q->where('sales_id', $user->id))
            ->orderByDesc('updated_at')
            ->get();

        $columns = collect(Crm::stages())->map(function ($stage) use ($prospects) {
            $items = $prospects->where('stage', $stage)->values();

            return [
                'stage' => $stage,
                'count' => $items->count(),
                'value' => (float) $items->sum('estimated_value'),
                'prospects' => $items,
            ];
        })->values();

        return Inertia::render('crm/pipeline/index', [
            'columns' => $columns,
            'stages' => Crm::stages(),
        ]);
    }
}
