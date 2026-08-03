<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\SocialPost;
use App\Services\Social\SocialPublishingService;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SocialAccountController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly SocialPublishingService $service)
    {
    }

    public function index()
    {
        $accounts = SocialAccount::all()->keyBy('platform');

        $platforms = collect($this->service->platforms())
            ->map(function (array $config, string $platform) use ($accounts) {
                $account = $accounts->get($platform);

                return [
                    'platform' => $platform,
                    'label' => $config['label'],
                    'media' => $config['media'],
                    'docs' => $config['docs'] ?? null,
                    'setup_hint' => $config['setup_hint'] ?? null,
                    'credential_fields' => $config['credentials'] ?? [],
                    'is_enabled' => (bool) $account?->is_enabled,
                    'display_name' => $account?->display_name,
                    // Nilai kredensial tidak pernah dikirim, hanya status terisi/belum
                    'filled' => collect(array_keys($config['credentials'] ?? []))
                        ->mapWithKeys(fn ($key) => [$key => filled($account?->credentials[$key] ?? null)])
                        ->all(),
                    'has_credentials' => (bool) $account?->hasCompleteCredentials(),
                    'last_error' => $account?->last_error,
                    'updated_at' => $account?->updated_at?->toDateTimeString(),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('social/index', [
            'platforms' => $platforms,
            'featureEnabled' => $this->service->isEnabled(),
            'simulationMode' => $this->service->simulateGlobally(),
            'recentPosts' => SocialPost::with('contentPlan:id,title')
                ->latest()
                ->take(20)
                ->get()
                ->map(fn (SocialPost $post) => [
                    'id' => $post->id,
                    'platform' => $post->platform,
                    'platform_label' => $this->service->label($post->platform),
                    'title' => $post->contentPlan?->title ?? '(konten dihapus)',
                    'status' => $post->status,
                    'simulated' => $post->simulated,
                    'message' => $post->message,
                    'permalink' => $post->permalink,
                    'attempts' => $post->attempts,
                    'published_at' => $post->published_at?->toDateTimeString(),
                    'created_at' => $post->created_at?->toDateTimeString(),
                ]),
        ]);
    }

    public function update(Request $request, string $platform)
    {
        $config = $this->service->platforms()[$platform] ?? null;
        abort_unless($config, 404, 'Platform tidak dikenal.');

        $validated = $request->validate([
            'is_enabled' => 'required|boolean',
            'display_name' => 'nullable|string|max:255',
            'credentials' => 'nullable|array',
            'credentials.*' => 'nullable|string|max:2000',
        ]);

        $account = SocialAccount::firstOrNew(['platform' => $platform]);

        // Kolom yang dikirim kosong dianggap "tidak diubah", supaya token lama
        // tidak terhapus hanya karena formnya tidak diisi ulang.
        $credentials = $account->credentials ?? [];
        foreach (array_keys($config['credentials']) as $key) {
            $incoming = $validated['credentials'][$key] ?? null;
            if (filled($incoming)) {
                $credentials[$key] = $incoming;
            }
        }

        $account->fill([
            'display_name' => $validated['display_name'] ?? $config['label'],
            'is_enabled' => $validated['is_enabled'],
            'credentials' => $credentials,
            'updated_by' => Auth::id(),
        ])->save();

        $this->logActivity('updated', 'SocialAccount', $account->id, "Mengubah pengaturan akun {$config['label']}");

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Pengaturan {$config['label']} disimpan.",
        ]);

        return redirect()->back();
    }

    /** Hapus kredensial satu platform tanpa menghapus riwayat postingnya. */
    public function disconnect(string $platform)
    {
        abort_unless(isset($this->service->platforms()[$platform]), 404);

        SocialAccount::where('platform', $platform)->update([
            'credentials' => null,
            'is_enabled' => false,
            'last_error' => null,
            'updated_by' => Auth::id(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Koneksi diputus dan kredensial dihapus.']);

        return redirect()->back();
    }
}
