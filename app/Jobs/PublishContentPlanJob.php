<?php

namespace App\Jobs;

use App\Models\SocialPost;
use App\Services\Social\SocialPublishingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Mengirim satu content plan ke satu platform.
 *
 * Dijalankan di antrean supaya proses simpan konten tidak pernah menunggu API
 * media sosial, dan kegagalan platform mana pun tidak menjatuhkan yang lain.
 */
class PublishContentPlanJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public readonly int $socialPostId)
    {
    }

    public function tries(): int
    {
        return (int) config('social.max_attempts', 3);
    }

    /** Jeda bertingkat antar percobaan. */
    public function backoff(): array
    {
        return config('social.retry_backoff', [60, 300, 900]);
    }

    public function handle(SocialPublishingService $service): void
    {
        $post = SocialPost::with('contentPlan')->find($this->socialPostId);

        if (! $post || $post->status === SocialPost::STATUS_PUBLISHED) {
            return; // sudah terkirim atau datanya dihapus
        }

        $post->update([
            'status' => SocialPost::STATUS_PROCESSING,
            'attempts' => $post->attempts + 1,
        ]);

        try {
            $result = $service->execute($post);
        } catch (Throwable $e) {
            // Pengaman terakhir: apa pun yang terjadi, tercatat sebagai gagal
            Log::error('Posting media sosial melempar exception', [
                'social_post_id' => $post->id,
                'platform' => $post->platform,
                'error' => $e->getMessage(),
            ]);

            $post->update([
                'status' => SocialPost::STATUS_FAILED,
                'message' => 'Kesalahan tak terduga: ' . $e->getMessage(),
            ]);

            return;
        }

        if ($result->success) {
            $post->update([
                'status' => SocialPost::STATUS_PUBLISHED,
                'simulated' => $result->simulated,
                'external_post_id' => $result->externalId,
                'permalink' => $result->permalink,
                'message' => $result->message,
                'published_at' => now(),
            ]);

            return;
        }

        $shouldRetry = $result->retryable && $post->attempts < $this->tries();

        $post->update([
            'status' => $shouldRetry ? SocialPost::STATUS_PENDING : SocialPost::STATUS_FAILED,
            'message' => $result->message,
        ]);

        if ($shouldRetry) {
            $this->release($this->backoff()[$post->attempts - 1] ?? 900);
        }
    }

    public function failed(Throwable $e): void
    {
        SocialPost::where('id', $this->socialPostId)->update([
            'status' => SocialPost::STATUS_FAILED,
            'message' => 'Job gagal: ' . $e->getMessage(),
        ]);
    }
}
