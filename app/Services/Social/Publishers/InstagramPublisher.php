<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Instagram Business — Content Publishing API (dua langkah).
 *
 * 1. Buat container media, 2. publikasikan container tersebut.
 * Gambar/video WAJIB dapat diakses publik oleh server Meta.
 * @see https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */
class InstagramPublisher implements SocialPublisher
{
    private const GRAPH = 'https://graph.facebook.com/v21.0';

    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult
    {
        $igUserId = $account->credentials['ig_user_id'] ?? null;
        $token = $account->credentials['access_token'] ?? null;

        if (! $igUserId || ! $token) {
            return PublishResult::failure('Kredensial Instagram belum lengkap.', retryable: false);
        }

        if (! $mediaUrl) {
            return PublishResult::failure('Instagram mewajibkan gambar atau video.', retryable: false);
        }

        $isVideo = $this->isVideo($plan->media_mime);

        try {
            // Langkah 1 — container
            $create = Http::timeout(config('social.timeout'))->asForm()->post(
                self::GRAPH . "/{$igUserId}/media",
                array_filter([
                    $isVideo ? 'video_url' : 'image_url' => $mediaUrl,
                    'media_type' => $isVideo ? 'REELS' : null,
                    'caption' => $this->caption($plan),
                    'access_token' => $token,
                ]),
            );

            if ($create->failed()) {
                return $this->mapError($create->json('error') ?? [], $create->status(), $create->body());
            }

            $containerId = $create->json('id');

            if (! $containerId) {
                return PublishResult::failure('Instagram tidak mengembalikan ID container media.');
            }

            // Langkah 2 — publikasikan
            $publish = Http::timeout(config('social.timeout'))->asForm()->post(
                self::GRAPH . "/{$igUserId}/media_publish",
                ['creation_id' => $containerId, 'access_token' => $token],
            );

            if ($publish->failed()) {
                return $this->mapError($publish->json('error') ?? [], $publish->status(), $publish->body());
            }

            $id = $publish->json('id');

            return PublishResult::success(externalId: $id);
        } catch (Throwable $e) {
            return PublishResult::failure('Gagal menghubungi Instagram: ' . $e->getMessage());
        }
    }

    private function isVideo(?string $mime): bool
    {
        return $mime !== null && str_starts_with($mime, 'video/');
    }

    private function caption(ContentPlan $plan): string
    {
        return trim(implode("\n\n", array_filter([
            $plan->description ?: $plan->title,
            $plan->keywords,
        ])));
    }

    private function mapError(array $error, int $status, string $body): PublishResult
    {
        $message = $error['message'] ?? "HTTP {$status}: " . mb_substr($body, 0, 300);
        $code = (int) ($error['code'] ?? 0);
        $permanent = in_array($code, [100, 190, 200, 10], true) || in_array($status, [400, 401, 403], true);

        return PublishResult::failure($message, retryable: ! $permanent);
    }
}
