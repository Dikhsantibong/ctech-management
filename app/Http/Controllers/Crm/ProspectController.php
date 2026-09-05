<?php

namespace App\Http\Controllers\Crm;

use App\Exports\ProspectsDataExport;
use App\Http\Controllers\Controller;
use App\Models\Prospect;
use App\Models\User;
use App\Services\ProspectService;
use App\Support\Crm;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ProspectController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $prospects = $this->filteredQuery($request)
            ->with('sales')
            ->latest('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('crm/prospects/index', [
            'prospects' => $prospects,
            'filters' => $request->only([
                'search', 'sales_id', 'industry', 'source', 'stage',
                'priority', 'status', 'city', 'product', 'follow_up',
                'date_from', 'date_to',
            ]),
            'options' => $this->filterOptions(),
        ]);
    }

    public function export(Request $request)
    {
        $prospects = $this->filteredQuery($request)->with('sales')->latest('updated_at')->get();

        return Excel::download(new ProspectsDataExport($prospects), 'prospek-'.now()->format('Ymd-His').'.xlsx');
    }

    public function show(Prospect $prospect)
    {
        $prospect->load([
            'sales', 'creator', 'client',
            'activities.user',
            'stageHistories.changedBy',
            'quotations' => fn ($q) => $q->latest(),
        ]);

        return Inertia::render('crm/prospects/show', [
            'prospect' => $prospect,
            'options' => $this->filterOptions(),
            'activityTypes' => Crm::activityTypes(),
            'needFields' => Crm::needFields(),
        ]);
    }

    public function store(Request $request, ProspectService $service)
    {
        $validated = $this->validateBasic($request);

        $prospect = Prospect::create([
            ...$validated,
            'sales_id' => $validated['sales_id'] ?? Auth::id(),
            'stage' => 'Prospek Baru',
            'status' => 'Aktif',
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'Prospect', $prospect->id, "Menambah prospek baru: {$prospect->company_name}");

        return redirect()->route('crm.prospek.show', $prospect)->with('success', 'Prospek berhasil ditambahkan.');
    }

    public function update(Request $request, Prospect $prospect)
    {
        $validated = $this->validateFull($request);

        $prospect->update($validated);

        $this->logActivity('updated', 'Prospect', $prospect->id, "Memperbarui prospek: {$prospect->company_name}");

        return redirect()->back()->with('success', 'Prospek berhasil diperbarui.');
    }

    public function updateStage(Request $request, Prospect $prospect, ProspectService $service)
    {
        $validated = $request->validate([
            'stage' => ['required', 'string', 'in:'.implode(',', Crm::stages())],
            'note' => ['nullable', 'string'],
        ]);

        $service->moveStage($prospect, $validated['stage'], $validated['note'] ?? null, Auth::id());

        $this->logActivity('updated', 'Prospect', $prospect->id, "Memindahkan {$prospect->company_name} ke tahap {$validated['stage']}");

        return redirect()->back()->with('success', 'Tahap pipeline diperbarui.');
    }

    public function convert(Prospect $prospect, ProspectService $service)
    {
        $client = $service->convertToClient($prospect);

        $this->logActivity('converted', 'Prospect', $prospect->id, "Konversi prospek {$prospect->company_name} menjadi Customer #{$client->id}");

        return redirect()->back()->with('success', "Prospek dikonversi ke Customer: {$client->name}.");
    }

    public function destroy(Prospect $prospect)
    {
        $this->logActivity('deleted', 'Prospect', $prospect->id, "Menghapus prospek: {$prospect->company_name}");
        $prospect->delete();

        return redirect()->route('crm.prospek.index')->with('success', 'Prospek dihapus.');
    }

    private function filteredQuery(Request $request)
    {
        return Prospect::query()
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where(function ($sub) use ($term) {
                    $sub->where('company_name', 'like', $term)
                        ->orWhere('brand_name', 'like', $term)
                        ->orWhere('pic_name', 'like', $term)
                        ->orWhere('company_email', 'like', $term)
                        ->orWhere('pic_email', 'like', $term);
                });
            })
            ->when($request->filled('sales_id'), fn ($q) => $q->where('sales_id', $request->integer('sales_id')))
            ->when($request->filled('industry'), fn ($q) => $q->where('industry', $request->string('industry')))
            ->when($request->filled('source'), fn ($q) => $q->where('source', $request->string('source')))
            ->when($request->filled('stage'), fn ($q) => $q->where('stage', $request->string('stage')))
            ->when($request->filled('priority'), fn ($q) => $q->where('priority', $request->string('priority')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('city'), fn ($q) => $q->where('city', 'like', '%'.$request->string('city').'%'))
            ->when($request->filled('product'), fn ($q) => $q->where('products_interest', 'like', '%'.$request->string('product').'%'))
            ->when($request->input('follow_up') === 'overdue', fn ($q) => $q->overdueFollowUp())
            ->when($request->input('follow_up') === 'today', fn ($q) => $q->whereDate('next_follow_up_at', today()))
            ->when($request->input('follow_up') === 'none', fn ($q) => $q->whereNull('next_follow_up_at')->where('status', 'Aktif'))
            ->when($request->filled('date_from'), fn ($q) => $q->whereDate('created_at', '>=', $request->date('date_from')))
            ->when($request->filled('date_to'), fn ($q) => $q->whereDate('created_at', '<=', $request->date('date_to')));
    }

    /**
     * @return array<string, mixed>
     */
    private function filterOptions(): array
    {
        return [
            'sales' => User::orderBy('name')->get(['id', 'name']),
            'stages' => Crm::stages(),
            'openStages' => Crm::openStages(),
            'sources' => Crm::sources(),
            'priorities' => Crm::priorities(),
            'statuses' => Crm::statuses(),
            'industries' => Crm::industries(),
            'companyTypes' => Crm::companyTypes(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validateBasic(Request $request): array
    {
        return $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'pic_name' => ['nullable', 'string', 'max:255'],
            'pic_position' => ['nullable', 'string', 'max:255'],
            'pic_phone' => ['nullable', 'string', 'max:50'],
            'pic_whatsapp' => ['nullable', 'string', 'max:50'],
            'pic_email' => ['nullable', 'email', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'sales_id' => ['nullable', 'exists:users,id'],
            'priority' => ['nullable', 'in:'.implode(',', Crm::priorities())],
            'products_interest' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateFull(Request $request): array
    {
        return $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'company_type' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:50'],
            'company_whatsapp' => ['nullable', 'string', 'max:50'],
            'pic_name' => ['nullable', 'string', 'max:255'],
            'pic_position' => ['nullable', 'string', 'max:255'],
            'pic_email' => ['nullable', 'email', 'max:255'],
            'pic_phone' => ['nullable', 'string', 'max:50'],
            'pic_whatsapp' => ['nullable', 'string', 'max:50'],
            'pic_linkedin' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'sales_id' => ['nullable', 'exists:users,id'],
            'priority' => ['nullable', 'in:'.implode(',', Crm::priorities())],
            'products_interest' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'expected_close_date' => ['nullable', 'date'],
            'next_action' => ['nullable', 'string', 'max:255'],
            'next_follow_up_at' => ['nullable', 'date'],
            'needs' => ['nullable', 'array'],
        ]);
    }
}
