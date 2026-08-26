<?php

namespace App\Http\Controllers;

use App\Models\AppSubscription;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppSubscriptionController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $subscriptions = AppSubscription::latest()->get();
        return Inertia::render('app-subscriptions/index', [
            'subscriptions' => $subscriptions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'app_name' => 'required|string|max:255',
            'billing_amount' => 'required|numeric|min:0',
            'siklus_tagihan' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after_or_equal:start_date',
        ]);

        $subscription = AppSubscription::create($validated);

        $this->logActivity('created', 'AppSubscription', $subscription->id, "Menambah langganan aplikasi {$subscription->app_name} untuk {$subscription->client_name}");

        return redirect()->back()->with('success', 'Langganan aplikasi berhasil ditambahkan.');
    }

    public function update(Request $request, AppSubscription $app_subscription)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'app_name' => 'required|string|max:255',
            'billing_amount' => 'required|numeric|min:0',
            'siklus_tagihan' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after_or_equal:start_date',
            'is_invoiced' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $app_subscription->update($validated);

        $this->logActivity('updated', 'AppSubscription', $app_subscription->id, "Memperbarui langganan aplikasi {$app_subscription->app_name} untuk {$app_subscription->client_name}");

        return redirect()->back()->with('success', 'Langganan aplikasi berhasil diperbarui.');
    }

    public function destroy(AppSubscription $app_subscription)
    {
        $this->logActivity('deleted', 'AppSubscription', $app_subscription->id, "Menghapus langganan aplikasi {$app_subscription->app_name} untuk {$app_subscription->client_name}");
        
        $app_subscription->delete();

        return redirect()->back()->with('success', 'Langganan aplikasi berhasil dihapus.');
    }
}
