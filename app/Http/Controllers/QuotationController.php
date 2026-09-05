<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\CompanySetting;
use App\Models\Prospect;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Support\MenuRegistry;
use App\Traits\LogsActivity;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuotationController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $quotations = Quotation::with('creator')->latest()->get();

        return Inertia::render('quotations/index', [
            'quotations' => $quotations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateData($request);

        $number = $this->generateNumber($validated['quotation_date']);
        $totals = $this->calculateTotals($validated);

        $quotation = Quotation::create([
            'quotation_number' => $number,
            'client_name' => $validated['client_name'],
            'client_pic' => $validated['client_pic'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'quotation_date' => $validated['quotation_date'],
            'valid_until' => $validated['valid_until'] ?? null,
            'subject' => $validated['subject'],
            'intro' => $validated['intro'] ?? null,
            'terms' => $validated['terms'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'use_tax' => $validated['use_tax'],
            'tax_rate' => $validated['use_tax'] ? (float) $validated['tax_rate'] : 0,
            'discount' => $totals['discount'],
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'status' => 'Draft',
            'created_by' => Auth::id(),
            'prospect_id' => $validated['prospect_id'] ?? null,
        ]);

        $this->syncItems($quotation, $validated['items']);

        $this->logActivity('created', 'Quotation', $quotation->id, "Membuat penawaran baru: {$quotation->quotation_number}");

        return redirect()->route('quotations.index')->with('success', 'Penawaran berhasil dibuat.');
    }

    public function create(Request $request)
    {
        // Prefill dari prospek CRM bila datang lewat aksi "Buat Penawaran".
        $prospect = $request->filled('prospect_id')
            ? Prospect::with('client')->find($request->integer('prospect_id'))
            : null;

        return Inertia::render('quotations/form', [
            'quotation' => null,
            'clients' => Client::orderBy('name')->get(['name', 'pic', 'contact', 'email']),
            'settings' => CompanySetting::first(),
            'prospectId' => $prospect?->id,
            'prefill' => $prospect ? [
                'client_name' => $prospect->client?->name ?? $prospect->company_name,
                'client_pic' => $prospect->pic_name,
                'client_address' => $prospect->address,
                'subject' => $prospect->products_interest ? 'Penawaran '.$prospect->products_interest : '',
            ] : null,
        ]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load('items', 'creator');

        return Inertia::render('quotations/form', [
            'quotation' => $quotation,
            'clients' => Client::orderBy('name')->get(['name', 'pic', 'contact', 'email']),
            'settings' => CompanySetting::first(),
        ]);
    }

    public function show(Quotation $quotation)
    {
        $quotation->load('items', 'creator', 'verifier');

        return Inertia::render('quotations/show', [
            'quotation' => $quotation,
            'settings' => CompanySetting::first(),
            'can_verify' => Auth::user()?->role === MenuRegistry::SUPER_ROLE,
        ]);
    }

    /**
     * Verifikasi/pengesahan penawaran (RAB) — hanya Direktur Utama.
     */
    public function verifyDocument(Quotation $quotation)
    {
        $this->authorizeVerifier();

        $quotation->update([
            'verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);

        $this->logActivity('verified', 'Quotation', $quotation->id, "Memverifikasi penawaran: {$quotation->quotation_number}");

        return redirect()->back()->with('success', 'Penawaran berhasil diverifikasi.');
    }

    /**
     * Batalkan verifikasi penawaran — hanya Direktur Utama.
     */
    public function unverifyDocument(Quotation $quotation)
    {
        $this->authorizeVerifier();

        $quotation->update([
            'verified_at' => null,
            'verified_by' => null,
        ]);

        $this->logActivity('unverified', 'Quotation', $quotation->id, "Membatalkan verifikasi penawaran: {$quotation->quotation_number}");

        return redirect()->back()->with('success', 'Verifikasi penawaran dibatalkan.');
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $this->validateData($request, true);

        $totals = $this->calculateTotals($validated);

        $quotation->update([
            'client_name' => $validated['client_name'],
            'client_pic' => $validated['client_pic'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'quotation_date' => $validated['quotation_date'],
            'valid_until' => $validated['valid_until'] ?? null,
            'subject' => $validated['subject'],
            'intro' => $validated['intro'] ?? null,
            'terms' => $validated['terms'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'use_tax' => $validated['use_tax'],
            'tax_rate' => $validated['use_tax'] ? (float) $validated['tax_rate'] : 0,
            'discount' => $totals['discount'],
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
        ]);

        $this->syncItems($quotation, $validated['items']);

        $this->logActivity('updated', 'Quotation', $quotation->id, "Mengupdate penawaran: {$quotation->quotation_number}");

        return redirect()->route('quotations.index')->with('success', 'Penawaran berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'status' => 'required|in:Draft,Terkirim,Diterima,Ditolak',
        ]);

        $quotation->update(['status' => $validated['status']]);

        $this->logActivity('updated', 'Quotation', $quotation->id, "Mengubah status penawaran {$quotation->quotation_number} menjadi {$validated['status']}");

        return redirect()->back()->with('success', 'Status penawaran diperbarui.');
    }

    public function destroy(Quotation $quotation)
    {
        $this->logActivity('deleted', 'Quotation', $quotation->id, "Menghapus penawaran: {$quotation->quotation_number}");
        $quotation->delete();

        return redirect()->back()->with('success', 'Penawaran dihapus.');
    }

    public function downloadPdf(Quotation $quotation)
    {
        return $this->buildPdf($quotation)->download(str_replace('/', '-', $quotation->quotation_number).'.pdf');
    }

    public function previewPdf(Quotation $quotation)
    {
        return $this->buildPdf($quotation)->stream(str_replace('/', '-', $quotation->quotation_number).'.pdf');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'client_name' => 'required|string|max:255',
            'client_pic' => 'nullable|string|max:255',
            'client_address' => 'nullable|string',
            'prospect_id' => 'nullable|exists:crm_prospects,id',
            'quotation_date' => 'required|date',
            'valid_until' => 'nullable|date',
            'subject' => 'required|string|max:255',
            'intro' => 'nullable|string',
            'terms' => 'nullable|string',
            'notes' => 'nullable|string',
            'use_tax' => 'required|boolean',
            'tax_rate' => 'nullable|required_if:use_tax,true|numeric|min:0|max:100',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => $isUpdate ? 'nullable' : 'prohibited',
            'items.*.category' => 'nullable|string|max:255',
            'items.*.description' => 'required|string',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.price' => 'required|numeric|min:0',
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array{subtotal: float, discount: float, tax: float, total: float}
     */
    private function calculateTotals(array $validated): array
    {
        $subtotal = 0.0;
        foreach ($validated['items'] as $item) {
            $subtotal += (float) $item['quantity'] * (float) $item['price'];
        }

        // Diskon nominal, tidak boleh melebihi subtotal
        $discount = min((float) ($validated['discount'] ?? 0), $subtotal);
        $afterDiscount = $subtotal - $discount;

        $taxRate = $validated['use_tax'] ? (float) $validated['tax_rate'] : 0;
        $tax = $afterDiscount * ($taxRate / 100);
        $total = $afterDiscount + $tax;

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncItems(Quotation $quotation, array $items): void
    {
        $keepIds = [];

        foreach (array_values($items) as $index => $item) {
            $payload = [
                'category' => $item['category'] ?? null,
                'description' => $item['description'],
                'unit' => $item['unit'] ?? null,
                'quantity' => (float) $item['quantity'],
                'price' => (float) $item['price'],
                'total' => (float) $item['quantity'] * (float) $item['price'],
                'sort_order' => $index,
            ];

            if (! empty($item['id'])) {
                $quotation->items()->where('id', $item['id'])->update($payload);
                $keepIds[] = $item['id'];
            } else {
                $created = $quotation->items()->create($payload);
                $keepIds[] = $created->id;
            }
        }

        $quotation->items()->whereNotIn('id', $keepIds)->delete();
    }

    private function generateNumber(string $date): string
    {
        $parsed = Carbon::parse($date);
        $year = $parsed->format('Y');
        $romanMonths = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
            '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII',
        ];
        $monthRoman = $romanMonths[$parsed->format('m')];

        $suffix = "/PNW/CTECH/{$monthRoman}/{$year}";

        $latest = Quotation::where('quotation_number', 'like', "%{$suffix}")
            ->orderBy('quotation_number', 'desc')
            ->first();

        $nextId = $latest ? ((int) explode('/', $latest->quotation_number)[0]) + 1 : 1;

        return str_pad((string) $nextId, 3, '0', STR_PAD_LEFT).$suffix;
    }

    /**
     * Pratinjau PDF dari data form sebelum penawaran disimpan.
     * Selalu diberi watermark DRAFT karena dokumennya belum final.
     */
    public function previewDraft(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'nullable|string|max:255',
            'client_pic' => 'nullable|string|max:255',
            'client_address' => 'nullable|string',
            'quotation_date' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'subject' => 'nullable|string|max:255',
            'intro' => 'nullable|string',
            'terms' => 'nullable|string',
            'notes' => 'nullable|string',
            'use_tax' => 'required|boolean',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.category' => 'nullable|string|max:255',
            'items.*.description' => 'required|string',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $totals = $this->calculateTotals($validated);

        $quotation = new Quotation([
            'client_name' => $validated['client_name'] ?? '-',
            'client_pic' => $validated['client_pic'] ?? null,
            'client_address' => $validated['client_address'] ?? null,
            'quotation_date' => $validated['quotation_date'] ?? now()->toDateString(),
            'valid_until' => $validated['valid_until'] ?? null,
            'subject' => $validated['subject'] ?? '-',
            'intro' => $validated['intro'] ?? null,
            'terms' => $validated['terms'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'use_tax' => $validated['use_tax'],
            'tax_rate' => $validated['use_tax'] ? (float) ($validated['tax_rate'] ?? 0) : 0,
            'discount' => $totals['discount'],
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'status' => 'Draft',
        ]);
        $quotation->quotation_number = $request->input('quotation_number') ?: 'XXX/PNW/CTECH';

        $items = collect(array_values($validated['items']))->map(fn ($item, $index) => new QuotationItem([
            'category' => $item['category'] ?? null,
            'description' => $item['description'],
            'unit' => $item['unit'] ?? null,
            'quantity' => (float) $item['quantity'],
            'price' => (float) $item['price'],
            'total' => (float) $item['quantity'] * (float) $item['price'],
            'sort_order' => $index,
        ]));

        $quotation->setRelation('items', $items);
        $quotation->setRelation('creator', Auth::user());

        return $this->buildPdf($quotation)->stream('pratinjau-penawaran.pdf');
    }

    private function buildPdf(Quotation $quotation)
    {
        // Model transien (pratinjau) sudah punya relasi yang di-set manual;
        // hanya muat ulang dari DB bila record memang sudah tersimpan.
        if ($quotation->exists) {
            $quotation->load('items', 'creator', 'verifier');
        }

        $settings = CompanySetting::first();

        $logo = null;
        $logoPath = public_path('letter/main-logo.png');
        if (is_file($logoPath) && extension_loaded('gd')) {
            $logo = 'data:image/png;base64,'.base64_encode(file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'settings' => $settings,
            'logo' => $logo,
            'documentCode' => $this->documentCode($quotation),
            'printedAt' => now()->locale('id')->translatedFormat('d M Y H:i'),
            'isVerified' => ! empty($quotation->verified_at),
            'verifierName' => $quotation->verifier?->name,
            'verifiedAt' => $quotation->verified_at ? $quotation->verified_at->locale('id')->translatedFormat('d F Y') : null,
        ]);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isFontSubsettingEnabled', true);

        return $pdf;
    }

    /**
     * Kode dokumen deterministik untuk referensi arsip internal (bukan TTE).
     */
    private function documentCode(Quotation $quotation): string
    {
        $seed = implode('|', [
            $quotation->quotation_number ?? '',
            $quotation->id ?? 'preview',
            optional($quotation->quotation_date)->format('Y-m-d') ?? '',
        ]);

        return implode('-', str_split(strtoupper(substr(hash('sha256', $seed), 0, 12)), 4));
    }

    /**
     * Pastikan hanya Direktur Utama yang dapat memverifikasi/membatalkan verifikasi.
     */
    private function authorizeVerifier(): void
    {
        abort_unless(
            Auth::user()?->role === MenuRegistry::SUPER_ROLE,
            403,
            'Hanya Direktur Utama yang dapat memverifikasi dokumen.'
        );
    }
}
