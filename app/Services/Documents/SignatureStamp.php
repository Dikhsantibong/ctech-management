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
     * @return array{name: string, title: string, signed_at: string, url: string, qr: string, hash_hint: string, signature_image: ?string, stamp_image: ?string}
     */
    public function forPdf(DocumentSignature $signature, ?CompanySetting $settings): array
    {
        $url = $signature->verificationUrl();

        return [
            'name' => $signature->signer_name,
            'title' => $signature->signer_title,
            'signed_at' => $signature->signed_at->locale('id')->translatedFormat('d F Y H:i').' WIB',
            'url' => $url,
            'qr' => 'data:image/svg+xml;base64,'.base64_encode($this->qrSvg($url)),
            'hash_hint' => strtoupper(substr($signature->token, 0, 8)),
            'signature_image' => $this->privateImageDataUri($settings?->signature_image),
            'stamp_image' => $this->privateImageDataUri($settings?->stamp_image),
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

    private function privateImageDataUri(?string $path): ?string
    {
        $disk = Storage::disk('local');

        if (! $path || ! $disk->exists($path) || ! extension_loaded('gd')) {
            return null;
        }

        return 'data:'.($disk->mimeType($path) ?: 'image/png').';base64,'.base64_encode($disk->get($path));
    }
}
