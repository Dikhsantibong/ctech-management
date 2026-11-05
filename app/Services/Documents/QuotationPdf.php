<?php

namespace App\Services\Documents;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Quotation;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;

/**
 * Perakit PDF penawaran / RAB (resources/views/pdf/quotation.blade.php).
 */
class QuotationPdf
{
    public function __construct(private SignatureStamp $stamp) {}

    /**
     * @param  bool  $forWetSignature  Versi cetak resmi untuk ditandatangani basah & distempel (tanpa TTD elektronik/QR).
     */
    public function build(Quotation $quotation, ?DocumentSignature $signature = null, bool $forWetSignature = false): DomPdf
    {
        // Model transien (pratinjau) sudah punya relasi yang di-set manual;
        // hanya muat ulang dari DB bila record memang sudah tersimpan.
        if ($quotation->exists) {
            $quotation->load('items', 'creator', 'verifier');
        }

        $settings = CompanySetting::first();

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'settings' => $settings,
            'logo' => $this->stamp->logo(),
            'documentCode' => $this->documentCode($quotation),
            'printedAt' => now()->locale('id')->translatedFormat('d M Y H:i'),
            'isVerified' => $forWetSignature || ! empty($quotation->verified_at),
            'forWetSignature' => $forWetSignature,
            'verifierName' => $forWetSignature ? null : $quotation->verifier?->name,
            'verifiedAt' => $quotation->verified_at ? $quotation->verified_at->locale('id')->translatedFormat('d F Y') : null,
            'signature' => $signature && ! $forWetSignature ? $this->stamp->forPdf($signature, $settings) : null,
        ]);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isFontSubsettingEnabled', true);

        return $pdf;
    }

    /**
     * Kode dokumen deterministik untuk referensi arsip internal (bukan TTE).
     */
    public function documentCode(Quotation $quotation): string
    {
        $seed = implode('|', [
            $quotation->quotation_number ?? '',
            $quotation->id ?? 'preview',
            optional($quotation->quotation_date)->format('Y-m-d') ?? '',
        ]);

        return implode('-', str_split(strtoupper(substr(hash('sha256', $seed), 0, 12)), 4));
    }
}
