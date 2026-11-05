<?php

namespace App\Services\Documents;

use App\Models\DocumentSignature;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * Dokumen yang dapat disahkan dengan tanda tangan elektronik Direktur Utama.
 * Implementasi relasi ada di trait App\Traits\HasDocumentSignatures.
 */
interface SignableDocument
{
    /** Kunci jenis dokumen: letter | quotation | kwitansi. */
    public function signatureDocumentType(): string;

    /** Nama jenis dokumen untuk ditampilkan, mis. "Surat Keluar". */
    public function signatureDocumentLabel(): string;

    public function signatureDocumentNumber(): string;

    /**
     * Identitas dokumen yang aman ditampilkan di halaman verifikasi publik (tanpa isi dokumen).
     *
     * @return array{subject: ?string, counterpart_label: string, counterpart: ?string, date: ?string, amount: ?float}
     */
    public function signatureSummary(): array;

    /** Pesan bila dokumen belum boleh ditandatangani, atau null bila boleh. */
    public function signatureBlocker(): ?string;

    /** Tandai dokumen sah setelah ditandatangani. */
    public function markSigned(User $signer): void;

    /** Kembalikan status dokumen setelah tanda tangan dicabut. */
    public function markUnsigned(): void;

    /** @return MorphMany<DocumentSignature, $this> */
    public function signatures(): MorphMany;

    /** @return MorphOne<DocumentSignature, $this> */
    public function activeSignature(): MorphOne;
}
