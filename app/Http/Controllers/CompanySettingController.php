<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CompanySettingController extends Controller
{
    use LogsActivity;

    /** @var array<string, string> Jenis aset → kolom company_settings */
    private const SIGNATURE_ASSETS = [
        'signature' => 'signature_image',
        'stamp' => 'stamp_image',
    ];

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

    /**
     * Unggah gambar tanda tangan Direktur Utama atau cap perusahaan untuk tanda tangan elektronik.
     * Disimpan di disk privat; PDF yang sudah ditandatangani tidak ikut berubah.
     */
    public function storeSignatureAsset(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'asset' => ['required', 'in:signature,stamp'],
            'file' => ['required', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
        ]);

        $column = self::SIGNATURE_ASSETS[$validated['asset']];
        $settings = CompanySetting::firstOrCreate([]);

        if ($settings->{$column}) {
            Storage::disk('local')->delete($settings->{$column});
        }

        $settings->forceFill([$column => $request->file('file')->store('signature-assets', 'local')])->save();

        $this->logActivity('updated', 'CompanySetting', $settings->id, $validated['asset'] === 'signature'
            ? 'Mengganti gambar tanda tangan Direktur Utama'
            : 'Mengganti gambar cap perusahaan');

        return redirect()->back()->with('success', $validated['asset'] === 'signature' ? 'Tanda tangan disimpan.' : 'Cap perusahaan disimpan.');
    }

    public function showSignatureAsset(string $asset): StreamedResponse
    {
        $path = CompanySetting::first()?->{self::SIGNATURE_ASSETS[$asset]};

        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, ['Cache-Control' => 'private, no-store']);
    }

    public function destroySignatureAsset(string $asset): RedirectResponse
    {
        $settings = CompanySetting::first();
        $column = self::SIGNATURE_ASSETS[$asset];

        if ($settings?->{$column}) {
            Storage::disk('local')->delete($settings->{$column});
            $settings->forceFill([$column => null])->save();

            $this->logActivity('updated', 'CompanySetting', $settings->id, $asset === 'signature'
                ? 'Menghapus gambar tanda tangan Direktur Utama'
                : 'Menghapus gambar cap perusahaan');
        }

        return redirect()->back()->with('success', 'Gambar dihapus.');
    }
}
