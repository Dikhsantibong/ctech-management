<?php

namespace App\Services\Documents;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Storage;

/**
 * Data blok tanda tangan elektronik untuk template PDF
 * (resources/views/pdf/partials/e-signature.blade.php).
 */
class SignatureStamp
{
    /**
     * @return array{name: string, title: string, signed_at: string, url: string, qr: string, hash_hint: string, signature_image: ?string, signature_ratio: float, stamp_image: ?string, stamp_ratio: float}
     */
    public function forPdf(DocumentSignature $signature, ?CompanySetting $settings): array
    {
        $url = $signature->verificationUrl();
        $signatureImage = $this->privateImage($settings?->signature_image);
        $stampImage = $this->privateImage($settings?->stamp_image);

        return [
            'name' => $signature->signer_name,
            'title' => $signature->signer_title,
            'signed_at' => $signature->signed_at->locale('id')->translatedFormat('d F Y H:i').' WIB',
            'url' => $url,
            'qr' => 'data:image/svg+xml;base64,'.base64_encode($this->qrSvg($url)),
            'hash_hint' => strtoupper(substr($signature->token, 0, 8)),
            'signature_image' => $signatureImage['uri'] ?? null,
            'signature_ratio' => $signatureImage['ratio'] ?? 1.0,
            'stamp_image' => $stampImage['uri'] ?? null,
            'stamp_ratio' => $stampImage['ratio'] ?? 1.0,
        ];
    }

    /**
     * Logo kop dokumen. Dompdf butuh ekstensi GD untuk PNG; tanpa guard ini server tanpa GD akan 500.
     */
    public function logo(): ?string
    {
        $path = public_path('letter/main-logo.png');

        if (! is_file($path) || ! extension_loaded('gd')) {
            return null;
        }

        return 'data:image/png;base64,'.base64_encode(file_get_contents($path));
    }

    private function qrSvg(string $content): string
    {
        $renderer = new ImageRenderer(new RendererStyle(240, 1), new SvgImageBackEnd);

        return (new Writer($renderer))->writeString($content);
    }

    /**
     * Gambar privat sebagai data URI + rasio lebar/tinggi, agar template dapat menghitung
     * ukuran yang muat di kotak tanpa mengubah proporsi.
     *
     * @return array{uri: string, ratio: float}|null
     */
    private function privateImage(?string $path): ?array
    {
        $disk = Storage::disk('local');

        if (! $path || ! $disk->exists($path) || ! extension_loaded('gd')) {
            return null;
        }

        $contents = $disk->get($path);
        $trimmed = $this->trimEmptyMargins($contents);
        $size = @getimagesizefromstring($trimmed ?? $contents);

        return [
            'uri' => $trimmed
                ? 'data:image/png;base64,'.base64_encode($trimmed)
                : 'data:'.($disk->mimeType($path) ?: 'image/png').';base64,'.base64_encode($contents),
            'ratio' => $size && $size[1] > 0 ? $size[0] / $size[1] : 1.0,
        ];
    }

    /**
     * Buang tepi kosong (transparan atau putih) di sekitar TTD/cap. Ukuran di PDF dikunci
     * lewat tinggi, jadi tepi kosong membuat cap/TTD tercetak jauh lebih kecil dari seharusnya.
     *
     * @return string|null PNG hasil pangkas, atau null bila tidak ada yang perlu dipangkas.
     */
    private function trimEmptyMargins(string $contents): ?string
    {
        $image = @imagecreatefromstring($contents);

        if (! $image) {
            return null;
        }

        imagesavealpha($image, true);

        // SIDES memakai warna sudut (transparan maupun putih). TRANSPARENT di GD tidak gagal
        // walau tidak memotong apa pun, jadi tiap mode dicek apakah benar-benar memperkecil gambar.
        foreach ([IMG_CROP_SIDES, IMG_CROP_TRANSPARENT, IMG_CROP_WHITE] as $mode) {
            $cropped = @imagecropauto($image, $mode);

            if ($cropped && (imagesx($cropped) < imagesx($image) || imagesy($cropped) < imagesy($image))) {
                imagesavealpha($cropped, true);
                ob_start();
                imagepng($cropped);

                return ob_get_clean();
            }
        }

        return null;
    }
}
