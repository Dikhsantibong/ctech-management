<?php

namespace App\Services\Social\Publishers;

use App\Models\ContentPlan;
use App\Models\SocialAccount;
use App\Services\Social\PublishResult;
use Illuminate\Support\Str;

/**
 * Menjalankan seluruh alur tanpa memanggil API mana pun.
 *
 * Dipakai ketika mode simulasi aktif atau kredensial platform belum lengkap,
 * sehingga sistem bisa diuji dengan aman sebelum akun sungguhan tersambung.
 */
class SimulationPublisher implements SocialPublisher
{
    public function publish(SocialAccount $account, ContentPlan $plan, ?string $mediaUrl): PublishResult
    {
        $requirement = config("social.platforms.{$account->platform}.media", 'optional');

        // Aturan media tetap diuji agar hasil simulasi mencerminkan kondisi nyata
        if ($requirement === 'required' && ! $mediaUrl) {
            return PublishResult::failure(
                'Simulasi: ' . ($account->display_name ?: $account->platform) . ' mewajibkan gambar/video, tetapi konten ini belum punya media.',
                retryable: false,
            );
        }

        if ($requirement === 'video' && ! $mediaUrl) {
            return PublishResult::failure('Simulasi: platform ini hanya menerima video, tetapi konten ini belum punya media.', retryable: false);
        }

        return PublishResult::success(
            externalId: 'sim_' . Str::lower(Str::random(12)),
            permalink: null,
            message: 'Mode simulasi — tidak ada data yang benar-benar dikirim ke ' . ($account->display_name ?: $account->platform) . '.',
            simulated: true,
        );
    }
}
