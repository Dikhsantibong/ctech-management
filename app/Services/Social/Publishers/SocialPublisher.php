<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;

interface SocialPublisher
{
    /**
     * Kirim satu content plan ke platform terkait.
     *
     * @param string|null $mediaUrl URL publik gambar/video, null bila tidak ada.
     */
    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult;
}
