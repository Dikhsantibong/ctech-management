<?php

namespace App\Models;

use App\Services\Documents\SignableDocument;
use App\Traits\HasDocumentSignatures;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Tanda tangan elektronik pada invoice berlaku untuk kwitansinya (bukti penerimaan pembayaran).
 */
class Invoice extends Model implements SignableDocument
{
    use HasDocumentSignatures;

    protected $fillable = [
        'invoice_number',
        'client_name',
        'issue_date',
        'due_date',
        'kwitansi_date',
        'kwitansi_signatory',
        'subtotal',
        'tax',
        'total',
        'status',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function kwitansiNumber(): string
    {
        return str_replace('CTECH', 'KWT', (string) $this->invoice_number);
    }

    public function signatureDocumentType(): string
    {
        return 'kwitansi';
    }

    public function signatureDocumentLabel(): string
    {
        return 'Kwitansi';
    }

    public function signatureDocumentNumber(): string
    {
        return $this->kwitansiNumber();
    }

    public function signatureSummary(): array
    {
        return [
            'subject' => 'Pembayaran Invoice '.$this->invoice_number,
            'counterpart_label' => 'Diterima dari',
            'counterpart' => $this->client_name,
            'date' => $this->kwitansi_date ? Carbon::parse($this->kwitansi_date)->toDateString() : null,
            'amount' => (float) $this->total,
        ];
    }

    public function signatureBlocker(): ?string
    {
        return $this->status === 'Paid' ? null : 'Kwitansi hanya dapat ditandatangani setelah invoice berstatus Paid.';
    }

    public function markSigned(User $signer): void
    {
        // Kwitansi tidak punya status pengesahan sendiri; jejaknya ada di document_signatures.
    }

    public function markUnsigned(): void {}

    public function getTerbilangAttribute()
    {
        return ucwords(trim($this->penyebut($this->total))).' Rupiah';
    }

    private function penyebut($nilai)
    {
        $nilai = abs((float) $nilai);
        $huruf = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
        $temp = '';

        if ($nilai < 12) {
            $temp = ' '.$huruf[$nilai];
        } elseif ($nilai < 20) {
            $temp = $this->penyebut($nilai - 10).' belas';
        } elseif ($nilai < 100) {
            $temp = $this->penyebut($nilai / 10).' puluh'.$this->penyebut($nilai % 10);
        } elseif ($nilai < 200) {
            $temp = ' seratus'.$this->penyebut($nilai - 100);
        } elseif ($nilai < 1000) {
            $temp = $this->penyebut($nilai / 100).' ratus'.$this->penyebut($nilai % 100);
        } elseif ($nilai < 2000) {
            $temp = ' seribu'.$this->penyebut($nilai - 1000);
        } elseif ($nilai < 1000000) {
            $temp = $this->penyebut($nilai / 1000).' ribu'.$this->penyebut($nilai % 1000);
        } elseif ($nilai < 1000000000) {
            $temp = $this->penyebut($nilai / 1000000).' juta'.$this->penyebut(fmod($nilai, 1000000));
        } elseif ($nilai < 1000000000000) {
            $temp = $this->penyebut($nilai / 1000000000).' milyar'.$this->penyebut(fmod($nilai, 1000000000));
        } elseif ($nilai < 1000000000000000) {
            $temp = $this->penyebut($nilai / 1000000000000).' trilyun'.$this->penyebut(fmod($nilai, 1000000000000));
        }

        return $temp;
    }
}
