<?php

namespace App\Http\Controllers;

use App\Models\AppCategory;
use App\Models\AppSubscription;
use App\Models\SubscriptionPayment;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppSubscriptionController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $subscriptions = AppSubscription::with(['category', 'payments'])
            ->orderBy('client_name')
            ->get();

        return Inertia::render('app-subscriptions/index', [
            'subscriptions' => $subscriptions,
            'categories' => AppCategory::withCount('subscriptions')->orderBy('name')->get(),
            'billingCycles' => AppSubscription::BILLING_CYCLES,
            'summary' => $this->summary($subscriptions),
        ]);
    }

    /**
     * Rekap keseluruhan.
     *
     * "Terbayar" berasal dari pembayaran yang tercatat, sedangkan "terakru"
     * adalah nilai yang seharusnya sudah dibayar. Keduanya sengaja dipisah agar
     * tunggakan terlihat, bukan tersamarkan.
     */
    private function summary($subscriptions): array
    {
        $active = $subscriptions->where('status', AppSubscription::STATUS_ACTIVE);

        return [
            'total_subscriptions' => $subscriptions->count(),
            'active_subscriptions' => $active->count(),
            'monthly_recurring' => round($active->sum(fn ($s) => (float) $s->monthly_price), 2),
            'total_paid' => round($subscriptions->sum(fn ($s) => $s->total_paid), 2),
            'total_accrued' => round($subscriptions->sum(fn ($s) => $s->accrued_amount), 2),
            'total_outstanding' => round($subscriptions->sum(fn ($s) => $s->outstanding_amount), 2),
            'due_soon' => $subscriptions->filter(fn ($s) => in_array($s->payment_state, ['jatuh_tempo', 'menunggak'], true))->count(),
        ];
    }

    private function rules(): array
    {
        return [
            'app_category_id' => 'required|exists:app_categories,id',
            'client_name' => 'required|string|max:255',
            'app_name' => 'required|string|max:255',
            'monthly_price' => 'required|numeric|min:0',
            'billing_cycle_months' => 'required|integer|in:' . implode(',', AppSubscription::BILLING_CYCLES),
            'start_date' => 'required|date',
            'status' => 'required|in:' . implode(',', AppSubscription::STATUSES),
            'ended_at' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string|max:2000',
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate(array_merge($this->rules(), [
            // Untuk langganan yang sudah berjalan sebelum dicatat di sistem
            'prepaid_months' => 'nullable|integer|min:0|max:120',
        ]));

        $prepaidMonths = (int) ($validated['prepaid_months'] ?? 0);
        unset($validated['prepaid_months']);

        // Kolom lama tetap diisi agar bagian lain yang masih membacanya konsisten
        $validated['deadline'] = $validated['start_date'];
        $validated['is_active'] = $validated['status'] === AppSubscription::STATUS_ACTIVE;

        $subscription = AppSubscription::create($validated);

        // Bulan yang sudah dibayar sebelum tercatat di sistem
        if ($prepaidMonths > 0) {
            $subscription->recordPayment($prepaidMonths, null, $validated['start_date'], [
                'method' => 'saldo awal',
                'note' => 'Pembayaran yang sudah berjalan sebelum dicatat di sistem.',
                'recorded_by' => Auth::id(),
            ]);
        }

        $this->logActivity('created', 'AppSubscription', $subscription->id, "Menambah langganan {$subscription->app_name} untuk {$subscription->client_name}");

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Langganan berhasil ditambahkan.']);

        return redirect()->back();
    }

    public function update(Request $request, AppSubscription $app_subscription)
    {
        $validated = $request->validate($this->rules());

        $validated['is_active'] = $validated['status'] === AppSubscription::STATUS_ACTIVE;

        $app_subscription->update($validated);

        $this->logActivity('updated', 'AppSubscription', $app_subscription->id, "Memperbarui langganan {$app_subscription->app_name} untuk {$app_subscription->client_name}");

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Langganan berhasil diperbarui.']);

        return redirect()->back();
    }

    /** Catat pembayaran dan majukan masa aktif. */
    public function recordPayment(Request $request, AppSubscription $app_subscription)
    {
        $validated = $request->validate([
            'months' => 'required|integer|min:1|max:60',
            'amount' => 'nullable|numeric|min:0',
            'paid_at' => 'required|date',
            'method' => 'nullable|string|max:40',
            'reference' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:1000',
        ]);

        $payment = $app_subscription->recordPayment(
            $validated['months'],
            isset($validated['amount']) ? (float) $validated['amount'] : null,
            $validated['paid_at'],
            [
                'method' => $validated['method'] ?? null,
                'reference' => $validated['reference'] ?? null,
                'note' => $validated['note'] ?? null,
                'recorded_by' => Auth::id(),
            ],
        );

        $this->logActivity('created', 'SubscriptionPayment', $payment->id, "Mencatat pembayaran {$validated['months']} bulan untuk {$app_subscription->client_name}");

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Pembayaran {$validated['months']} bulan tercatat. Masa aktif diperpanjang sampai " .
                $payment->period_end->translatedFormat('d F Y') . '.',
        ]);

        return redirect()->back();
    }

    public function destroyPayment(AppSubscription $app_subscription, SubscriptionPayment $payment)
    {
        abort_unless($payment->app_subscription_id === $app_subscription->id, 404);

        $payment->delete();

        // Masa aktif dihitung ulang dari pembayaran yang tersisa
        $app_subscription->refresh();
        $app_subscription->forceFill([
            'deadline' => $app_subscription->paid_through ?? $app_subscription->start_date,
        ])->save();

        $this->logActivity('deleted', 'SubscriptionPayment', $payment->id, "Menghapus catatan pembayaran langganan {$app_subscription->client_name}");

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Catatan pembayaran dihapus dan masa aktif dihitung ulang.']);

        return redirect()->back();
    }

    public function destroy(AppSubscription $app_subscription)
    {
        $this->logActivity('deleted', 'AppSubscription', $app_subscription->id, "Menghapus langganan {$app_subscription->app_name} untuk {$app_subscription->client_name}");

        $app_subscription->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Langganan dihapus beserta riwayat pembayarannya.']);

        return redirect()->back();
    }

    /* ===================== Kategori aplikasi ===================== */

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:app_categories,name',
            'description' => 'nullable|string|max:500',
            'default_monthly_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $category = AppCategory::create($validated);

        $this->logActivity('created', 'AppCategory', $category->id, "Menambah kategori aplikasi {$category->name}");

        Inertia::flash('toast', ['type' => 'success', 'message' => "Kategori {$category->name} ditambahkan."]);

        return redirect()->back();
    }

    public function updateCategory(Request $request, AppCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:app_categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
            'default_monthly_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        $this->logActivity('updated', 'AppCategory', $category->id, "Memperbarui kategori aplikasi {$category->name}");

        Inertia::flash('toast', ['type' => 'success', 'message' => "Kategori {$category->name} diperbarui."]);

        return redirect()->back();
    }

    public function destroyCategory(AppCategory $category)
    {
        // Kategori yang masih dipakai tidak boleh dihapus agar data langganan
        // tidak kehilangan jenis aplikasinya
        if ($category->subscriptions()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "Kategori {$category->name} masih dipakai langganan aktif. Nonaktifkan saja bila tidak ingin dipilih lagi.",
            ]);

            return redirect()->back();
        }

        $this->logActivity('deleted', 'AppCategory', $category->id, "Menghapus kategori aplikasi {$category->name}");

        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori dihapus.']);

        return redirect()->back();
    }
}
