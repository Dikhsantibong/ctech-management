<?php

namespace App\Traits;

use App\Models\DocumentSignature;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * Relasi tanda tangan elektronik untuk model yang mengimplementasikan
 * App\Services\Documents\SignableDocument.
 */
trait HasDocumentSignatures
{
    /** @return MorphMany<DocumentSignature, $this> */
    public function signatures(): MorphMany
    {
        return $this->morphMany(DocumentSignature::class, 'signable');
    }

    /**
     * Tanda tangan yang masih berlaku (belum dicabut).
     *
     * @return MorphOne<DocumentSignature, $this>
     */
    public function activeSignature(): MorphOne
    {
        return $this->morphOne(DocumentSignature::class, 'signable')
            ->ofMany(['id' => 'max'], fn ($query) => $query->whereNull('revoked_at'));
    }

    public function isSigned(): bool
    {
        return $this->activeSignature()->exists();
    }
}
