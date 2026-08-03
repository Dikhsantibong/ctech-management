<?php

namespace App\Services\Social;

use App\Jobs\PublishContentPlanJob;
use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Models\SocialPost;
use App\Services\Social\Publishers\SimulationPublisher;
use App\Services\Social\Publishers\SocialPublisher;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SocialPublishingService
{
    public function isEnabled(): bool
    {
        return (bool) config('social.enabled');
    }

    public function platforms(): array
    {
        return config('social.platforms', []);
    }

    /** Akun yang siap dikirimi konten. */
    public function readyAccounts()
    {
        return SocialAccount::whereIn('platform', array_keys($this->platforms()))
            ->where('is_enabled', true)
            ->get()
            ->filter(fn (SocialAccount $a) => $this->simulateGlobally() || $a->hasCompleteCredentials());
    }

    public function simulateGlobally(): bool
    {
        return (bool) config('social.simulate');
    }

    /**
     * Antrekan pengiriman satu content plan ke platform terpilih.
     *
     * Dirancang agar tidak pernah melempar keluar: dipanggil dari alur simpan
     * content plan, jadi kegagalan apa pun di sini tidak boleh menggagalkan
     * penyimpanan konten itu sendiri.
     *
     * @return array{queued: int, skipped: array<string>}
     */
    public function dispatchFor(ContentPlan $plan, ?array $platforms = null): array
    {
        $queued = 0;
        $skipped = [];

        try {
            if (! $this->isEnabled()) {
                return ['queued' => 0, 'skipped' => ['Fitur posting otomatis sedang dimatikan.']];
            }

            $targets = $platforms ?? $plan->publish_targets ?? [];
            $accounts = $this->readyAccounts()->keyBy('platform');

            if ($targets === []) {
                $targets = $accounts->keys()->all();
            }

            foreach ($targets as $platform) {
                $account = $accounts->get($platform);

                if (! $account) {
                    $skipped[] = $this->label($platform) . ': akun belum aktif atau kredensial belum lengkap.';
                    continue;
                }

                $post = SocialPost::updateOrCreate(
                    ['content_plan_id' => $plan->id, 'platform' => $platform],
                    [
                        'status' => SocialPost::STATUS_PENDING,
                        'message' => null,
                        'attempts' => 0,
                        'simulated' => false,
                    ],
                );

                PublishContentPlanJob::dispatch($post->id);
                $queued++;
            }
        } catch (Throwable $e) {
            // Kegagalan penjadwalan dicatat, bukan dilempar — konten tetap tersimpan
            Log::error('Gagal mengantrekan posting media sosial', [
                'content_plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);

            $skipped[] = 'Terjadi kendala saat menjadwalkan pengiriman. Konten tetap tersimpan.';
        }

        return ['queued' => $queued, 'skipped' => $skipped];
    }

    /** Jalankan pengiriman sesungguhnya untuk satu baris social_posts. */
    public function execute(SocialPost $post): PublishResult
    {
        $plan = $post->contentPlan;
        $account = SocialAccount::where('platform', $post->platform)->first();

        if (! $plan) {
            return PublishResult::failure('Content plan sudah tidak ada.', retryable: false);
        }

        if (! $account || ! $account->is_enabled) {
            return PublishResult::failure('Akun platform ini sedang tidak aktif.', retryable: false);
        }

        $publisher = $this->resolvePublisher($account);
        $mediaUrl = $this->mediaUrlFor($plan);

        return $publisher->publish($account, $plan, $mediaUrl);
    }

    /**
     * Pilih publisher sungguhan atau simulasi.
     * Kredensial tidak lengkap selalu jatuh ke simulasi agar tidak ada
     * panggilan API yang pasti gagal.
     */
    public function resolvePublisher(SocialAccount $account): SocialPublisher
    {
        if ($this->simulateGlobally() || ! $account->hasCompleteCredentials()) {
            return app(SimulationPublisher::class);
        }

        $class = config("social.platforms.{$account->platform}.publisher");

        if (! $class || ! class_exists($class)) {
            return app(SimulationPublisher::class);
        }

        return app($class);
    }

    /** URL publik media konten; null bila tidak ada yang bisa dipakai. */
    public function mediaUrlFor(ContentPlan $plan): ?string
    {
        if ($plan->media_path && Storage::disk('public')->exists($plan->media_path)) {
            return rtrim(config('app.url'), '/') . Storage::disk('public')->url($plan->media_path);
        }

        // Link manual hanya dipakai bila benar-benar berupa URL http(s)
        if ($plan->visual_assets_url && str_starts_with($plan->visual_assets_url, 'http')) {
            return $plan->visual_assets_url;
        }

        return null;
    }

    public function label(string $platform): string
    {
        return config("social.platforms.{$platform}.label", $platform);
    }
}
