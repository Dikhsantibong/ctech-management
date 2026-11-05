<?php

namespace App\Services\Documents;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;

/**
 * Perakit PDF kwitansi (resources/views/pdf/kwitansi.blade.php) dari sebuah invoice.
 */
class KwitansiPdf
{
    public function __construct(private SignatureStamp $stamp) {}

    /**
     * @param  bool  $forWetSignature  Versi cetak untuk ditandatangani basah & distempel (tanpa TTD elektronik/QR).
     */
    public function build(Invoice $invoice, ?DocumentSignature $signature = null, bool $forWetSignature = false): DomPdf
    {
        $invoice->load('items');
        $settings = CompanySetting::first();

        return Pdf::loadView('pdf.kwitansi', [
            'invoice' => $invoice,
            'settings' => $settings,
            'logo' => $this->stamp->logo(),
            'kwitansi_number' => $invoice->kwitansiNumber(),
            'forWetSignature' => $forWetSignature,
            'signature' => $signature && ! $forWetSignature ? $this->stamp->forPdf($signature, $settings) : null,
        ])->setPaper('a5', 'landscape');
    }
}
