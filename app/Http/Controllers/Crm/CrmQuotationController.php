<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use App\Services\MenuAccess;
use App\Support\MenuRegistry;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Menu "Penawaran" di dalam CRM. Menggunakan kembali modul Quotation existing
 * (tidak ada tabel/penomoran baru) dan menampilkannya dalam konteks CRM,
 * menekankan penawaran yang terhubung ke prospek.
 */
class CrmQuotationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $seesAll = $user->role === MenuRegistry::SUPER_ROLE;

        $quotations = Quotation::query()
            ->with(['creator:id,name', 'prospect:id,company_name,stage,status'])
            ->when(! $seesAll, function ($q) use ($user) {
                $q->where(function ($sub) use ($user) {
                    $sub->where('created_by', $user->id)
                        ->orWhereHas('prospect', fn ($p) => $p->where('sales_id', $user->id));
                });
            })
            ->latest()
            ->get();

        return Inertia::render('crm/penawaran/index', [
            'quotations' => $quotations,
            'canCreateQuotation' => app(MenuAccess::class)->allows($user->role, 'quotations'),
        ]);
    }
}
