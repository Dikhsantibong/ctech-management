<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanySettingController extends Controller
{
    use LogsActivity;

    public function edit()
    {
        // Get the first setting row or an empty one
        $settings = CompanySetting::first() ?? new CompanySetting;

        return Inertia::render('company-settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'leader_name' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:255',
            'bank_account_name' => 'nullable|string|max:255',
            'bank_accounts' => 'nullable|array',
            'bank_accounts.*.bank_name' => 'nullable|string|max:255',
            'bank_accounts.*.account_number' => 'nullable|string|max:255',
            'bank_accounts.*.account_name' => 'nullable|string|max:255',
            'bank_accounts.*.is_active' => 'nullable|boolean',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        // Kolom tunggal lama selalu diselaraskan dengan rekening utama, supaya
        // bagian mana pun yang masih membacanya tidak mencetak rekening yang usang.
        if (array_key_exists('bank_accounts', $validated)) {
            $validated['bank_accounts'] = CompanySetting::normalizeBankAccounts($validated['bank_accounts'] ?? []);
            $active = collect($validated['bank_accounts'])->firstWhere('is_active', true);

            $validated['bank_name'] = $active['bank_name'] ?? null;
            $validated['bank_account_number'] = $active['account_number'] ?? null;
            $validated['bank_account_name'] = $active['account_name'] ?? null;
        }

        $settings = CompanySetting::first();

        if ($settings) {
            $settings->update($validated);
        } else {
            $settings = CompanySetting::create($validated);
        }

        $this->logActivity('updated', 'CompanySetting', $settings->id, 'Mengupdate pengaturan perusahaan');

        return redirect()->back()->with('success', 'Company settings updated successfully.');
    }
}
