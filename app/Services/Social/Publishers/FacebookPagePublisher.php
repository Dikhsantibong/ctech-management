<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Facebook Page — Graph API.
 *
 * Butuh Page Access Token berumur panjang dengan izin pages_manage_posts.
 * @see https://developers.facebook.com/docs/pages-api/posts
 */
class FacebookPagePublisher implements SocialPublisher
{
    private const GRAPH = 'https://graph.facebook.com/v21.0';

    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult
    {
        $pageId = $account->credentials['page_id'] ?? null;
        $token = $account->credentials['access_token'] ?? null;

        if (! $pageId || ! $token) {
            return PublishResult::failure('Kredensial Facebook belum lengkap.', retryable: false);
        }

        $caption = $this->caption($plan);

        try {
            // Ada gambar → unggah ke /photos; tanpa gambar → status teks di /feed
            $endpoint = $mediaUrl ? "/{$pageId}/photos" : "/{$pageId}/feed";
            $payload = $mediaUrl
                ? ['url' => $mediaUrl, 'caption' => $caption, 'access_token' => $token]
                : ['message' => $caption, 'access_token' => $token];

            $response = Http::timeout(config('social.timeout'))
                ->asForm()
                ->post(self::GRAPH . $endpoint, $payload);
        } catch (Throwable $e) {
            return PublishResult::failure('Gagal menghubungi Facebook: ' . $e->getMessage());
        }

        if ($response->failed()) {
            return $this->mapError($response->json('error') ?? [], $response->status(), $response->body());
        }

        $id = $response->json('post_id') ?? $response->json('id');

        return PublishResult::success(
            externalId: $id,
            permalink: $id ? "https://www.facebook.com/{$id}" : null,
        );
    }

    private function caption(ContentPlan $plan): string
    {
        return trim(implode("\n\n", array_filter([
            $plan->description ?: $plan->title,
            $plan->keywords,
        ])));
    }

    /** Kode error Meta yang tidak akan membaik meski diulang. */
    private function mapError(array $error, int $status, string $body): PublishResult
    {
        $message = $error['message'] ?? "HTTP {$status}: " . mb_substr($body, 0, 300);
        $code = (int) ($error['code'] ?? 0);

        // 190 token invalid, 200/10 izin kurang, 100 parameter salah
        $permanent = in_array($code, [100, 190, 200, 10], true) || in_array($status, [400, 401, 403], true);

        return PublishResult::failure($message, retryable: ! $permanent);
    }
}
