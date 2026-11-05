<?php

namespace App\Services\Documents;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Invoice;
use App\Models\Letter;
use App\Models\Quotation;
use App\Models\User;
use Barryvdh\DomPDF\PDF as DomPdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tanda tangan elektronik internal (TTE tidak tersertifikasi) untuk seluruh dokumen
 * bertanda tangan: penandatangan terautentikasi ulang, PDF final dibekukan di disk
 * privat, dan sidik digital SHA-256-nya dicatat agar perubahan file dapat dideteksi.
 */
class DocumentSigner
{
    public const SIGNER_TITLE = 'Direktur Utama';

    public function __construct(
        private LetterPdf $letters,
        private QuotationPdf $quotations,
        private KwitansiPdf $kwitansi,
    ) {}

    public function sign(SignableDocument $document, User $signer, ?string $ipAddress = null, ?string $userAgent = null): DocumentSignature
    {
        if ($blocker = $document->signatureBlocker()) {
            throw ValidationException::withMessages(['document' => $blocker]);
        }

        if ($document->activeSignature()->exists()) {
            throw ValidationException::withMessages(['document' => 'Dokumen ini sudah ditandatangani.']);
        }

        $settings = CompanySetting::first();

        if (! $settings?->signature_image || ! Storage::disk('local')->exists($settings->signature_image)) {
            throw ValidationException::withMessages([
                'document' => 'Unggah gambar tanda tangan Direktur Utama di Pengaturan Perusahaan sebelum menandatangani dokumen.',
            ]);
        }

        return DB::transaction(function () use ($document, $signer, $settings, $ipAddress, $userAgent) {
            $token = Str::random(40);
            $path = "signed-documents/{$document->signatureDocumentType()}/{$token}.pdf";

            $document->markSigned($signer);

            $signature = $document->signatures()->create([
                'document_type' => $document->signatureDocumentType(),
                'signer_id' => $signer->id,
                'signer_name' => $settings->leader_name ?: $signer->name,
                'signer_title' => self::SIGNER_TITLE,
                'token' => $token,
                'pdf_path' => $path,
                'pdf_hash' => str_repeat('0', 64),
                'signed_at' => now(),
                'ip_address' => $ipAddress,
                'user_agent' => Str::limit((string) $userAgent, 250, ''),
            ]);

            $output = $this->renderer($document->fresh(), $signature)->output();
            Storage::disk('local')->put($path, $output);

            $signature->update(['pdf_hash' => hash('sha256', $output)]);

            return $signature;
        });
    }

    /**
     * Cabut tanda tangan aktif. File PDF lama tetap disimpan sebagai arsip;
     * halaman verifikasi akan menampilkan status "Dicabut".
     */
    public function revoke(SignableDocument $document, User $revoker): void
    {
        DB::transaction(function () use ($document, $revoker) {
            $document->activeSignature()->first()?->update([
                'revoked_at' => now(),
                'revoked_by' => $revoker->id,
            ]);

            $document->markUnsigned();
        });
    }

    /**
     * Respons PDF beku untuk dokumen yang sudah ditandatangani (byte identik sehingga
     * sidik digitalnya cocok), atau null bila dokumen belum ditandatangani.
     */
    public function signedPdfResponse(SignableDocument $document, string $filename, string $disposition = 'inline'): ?Response
    {
        $signature = $document->activeSignature()->first();

        if (! $signature || ! Storage::disk('local')->exists($signature->pdf_path)) {
            return null;
        }

        return response(Storage::disk('local')->get($signature->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "{$disposition}; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Cocokkan file yang diunggah dengan PDF resmi yang dibekukan saat penandatanganan.
     */
    public function matches(DocumentSignature $signature, string $fileContents): bool
    {
        return hash_equals($signature->pdf_hash, hash('sha256', $fileContents));
    }

    /**
     * Versi cetak untuk tanda tangan basah & stempel (tanpa TTD elektronik/QR).
     */
    public function wetSignaturePdf(SignableDocument $document): DomPdf
    {
        return $this->renderer($document, null, forWetSignature: true);
    }

    private function renderer(SignableDocument $document, ?DocumentSignature $signature, bool $forWetSignature = false): DomPdf
    {
        return match (true) {
            $document instanceof Letter => $this->letters->build($document, signature: $signature, forWetSignature: $forWetSignature),
            $document instanceof Quotation => $this->quotations->build($document, $signature, $forWetSignature),
            $document instanceof Invoice => $this->kwitansi->build($document, $signature, $forWetSignature),
            default => throw new InvalidArgumentException('Jenis dokumen tidak mendukung tanda tangan elektronik.'),
        };
    }
}
