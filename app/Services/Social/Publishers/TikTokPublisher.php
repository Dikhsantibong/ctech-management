<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * TikTok — Content Posting API (PULL_FROM_URL).
 *
 * TikTok mengunduh video dari URL yang kita berikan, jadi URL harus publik dan
 * domainnya sudah diverifikasi di TikTok for Developers.
 * @see https://developers.tiktok.com/doc/content-posting-api-get-started
 */
class TikTokPublisher implements SocialPublisher
{
    private const API = 'https://open.tiktokapis.com/v2/post/publish/video/init/';

    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult
    {
        $token = $account->credentials['access_token'] ?? null;

        if (! $token) {
            return PublishResult::failure('Kredensial TikTok belum lengkap.', retryable: false);
        }

        if (! $mediaUrl) {
            return PublishResult::failure('TikTok hanya menerima video, dan konten ini belum punya media.', retryable: false);
        }

        if ($plan->media_mime && ! str_starts_with($plan->media_mime, 'video/')) {
            return PublishResult::failure('TikTok hanya menerima video, sedangkan media konten ini bukan video.', retryable: false);
        }

        try {
            $response = Http::timeout(config('social.timeout'))
                ->withToken($token)
                ->post(self::API, [
                    'post_info' => [
                        'title' => mb_substr($this->caption($plan), 0, 2200),
                        'privacy_level' => 'PUBLIC_TO_EVERYONE',
                        'disable_comment' => false,
                    ],
                    'source_info' => [
                        'source' => 'PULL_FROM_URL',
                        'video_url' => $mediaUrl,
                    ],
                ]);
        } catch (Throwable $e) {
            return PublishResult::failure('Gagal menghubungi TikTok: ' . $e->getMessage());
        }

        $error = $response->json('error') ?? [];
        $code = $error['code'] ?? 'ok';

        if ($response->failed() || ($code !== 'ok' && $code !== null)) {
            $message = $error['message'] ?? "HTTP {$response->status()}: " . mb_substr($response->body(), 0, 300);
            $permanent = in_array($response->status(), [400, 401, 403], true)
                || in_array($code, ['access_token_invalid', 'scope_not_authorized', 'url_ownership_unverified'], true);

            return PublishResult::failure($message, retryable: ! $permanent);
        }

        // Unggahan TikTok bersifat asinkron — yang dikembalikan adalah ID publikasi
        return PublishResult::success(
            externalId: $response->json('data.publish_id'),
            message: 'Video dikirim ke TikTok dan sedang diproses di sisi mereka.',
        );
    }

    private function caption(ContentPlan $plan): string
    {
        return trim(implode(' ', array_filter([
            $plan->description ?: $plan->title,
            $plan->keywords,
        ])));
    }
}
