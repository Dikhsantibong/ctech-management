<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Satu kali pengesahan elektronik sebuah dokumen (surat, penawaran/RAB, kwitansi).
 * PDF final disimpan apa adanya sehingga sidik digitalnya (SHA-256) dapat
 * dicocokkan dengan file yang beredar.
 */
class DocumentSignature extends Model
{
    protected $fillable = [
        'document_type',
        'signer_id',
        'signer_name',
        'signer_title',
        'token',
        'pdf_path',
        'pdf_hash',
        'signed_at',
        'ip_address',
        'user_agent',
        'revoked_at',
        'revoked_by',
    ];

    protected $hidden = [
        'pdf_path',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function signable(): MorphTo
    {
        return $this->morphTo();
    }

    public function signer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signer_id');
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    public function verificationUrl(): string
    {
        return rtrim(config('app.url'), '/').route('public.documents.verify', $this->token, false);
    }

    /**
     * Ringkasan untuk panel tanda tangan di halaman detail dokumen.
     *
     * @return array{signer_name: string, signer_title: string, signed_at: string, pdf_hash: string, verification_url: string}
     */
    public function toPanel(): array
    {
        return [
            'signer_name' => $this->signer_name,
            'signer_title' => $this->signer_title,
            'signed_at' => $this->signed_at->toIso8601String(),
            'pdf_hash' => $this->pdf_hash,
            'verification_url' => $this->verificationUrl(),
        ];
    }
}
