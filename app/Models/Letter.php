<?php

namespace App\Models;

use App\Services\Documents\SignableDocument;
use App\Traits\HasDocumentSignatures;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Letter extends Model implements SignableDocument
{
    use HasDocumentSignatures;

    protected $fillable = [
        'reference_number',
        'type',
        'letter_date',
        'sifat',
        'recipient',
        'subject',
        'content',
        'status',
        'created_by',
        'margin_top',
        'margin_right',
        'margin_bottom',
        'margin_left',
        'line_spacing',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'letter_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function signatureDocumentType(): string
    {
        return 'letter';
    }

    public function signatureDocumentLabel(): string
    {
        return 'Surat Keluar';
    }

    public function signatureDocumentNumber(): string
    {
        return (string) $this->reference_number;
    }

    public function signatureSummary(): array
    {
        return [
            'subject' => $this->subject,
            'counterpart_label' => 'Kepada',
            'counterpart' => $this->recipient,
            'date' => optional($this->letter_date)->toDateString(),
            'amount' => null,
        ];
    }

    public function signatureBlocker(): ?string
    {
        return empty($this->content) ? 'Surat tanpa isi (reservasi nomor) tidak dapat ditandatangani.' : null;
    }

    public function markSigned(User $signer): void
    {
        $this->forceFill(['status' => 'Final', 'verified_at' => now(), 'verified_by' => $signer->id])->save();
    }

    public function markUnsigned(): void
    {
        $this->forceFill(['status' => 'Draft', 'verified_at' => null, 'verified_by' => null])->save();
    }
}
