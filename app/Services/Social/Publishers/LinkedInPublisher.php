<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;
use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * LinkedIn Page — Posts API.
 *
 * Butuh produk Community Management API dan izin w_organization_social.
 * Versi ini memposting teks; gambar disertakan sebagai tautan artikel karena
 * unggah biner LinkedIn memerlukan alur registerUpload tersendiri.
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 */
class LinkedInPublisher implements SocialPublisher
{
    private const API = 'https://api.linkedin.com/rest/posts';

    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult
    {
        $organizationId = $account->credentials['organization_id'] ?? null;
        $token = $account->credentials['access_token'] ?? null;

        if (! $organizationId || ! $token) {
            return PublishResult::failure('Kredensial LinkedIn belum lengkap.', retryable: false);
        }

        $author = "urn:li:organization:{$organizationId}";

        $payload = [
            'author' => $author,
            'commentary' => $this->caption($plan),
            'visibility' => 'PUBLIC',
            'distribution' => [
                'feedDistribution' => 'MAIN_FEED',
                'targetEntities' => [],
                'thirdPartyDistributionChannels' => [],
            ],
            'lifecycleState' => 'PUBLISHED',
            'isReshareDisabledByAuthor' => false,
        ];

        if ($mediaUrl) {
            $payload['content'] = [
                'article' => [
                    'source' => $mediaUrl,
                    'title' => mb_substr($plan->title, 0, 100),
                ],
            ];
        }

        try {
            $response = Http::timeout(config('social.timeout'))
                ->withToken($token)
                ->withHeaders([
                    'LinkedIn-Version' => '202405',
                    'X-Restli-Protocol-Version' => '2.0.0',
                ])
                ->post(self::API, $payload);
        } catch (Throwable $e) {
            return PublishResult::failure('Gagal menghubungi LinkedIn: ' . $e->getMessage());
        }

        if ($response->failed()) {
            $message = $response->json('message') ?? "HTTP {$response->status()}: " . mb_substr($response->body(), 0, 300);
            $permanent = in_array($response->status(), [400, 401, 403, 422], true);

            return PublishResult::failure($message, retryable: ! $permanent);
        }

        // ID post dikembalikan lewat header, bukan body
        $id = $response->header('x-restli-id') ?: $response->json('id');

        return PublishResult::success(
            externalId: $id,
            permalink: $id ? "https://www.linkedin.com/feed/update/{$id}" : null,
        );
    }

    private function caption(ContentPlan $plan): string
    {
        return trim(implode("\n\n", array_filter([
            $plan->title,
            $plan->description,
            $plan->keywords,
        ])));
    }
}
