<?php

namespace App\Services\Documents;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Letter;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;
use Illuminate\Support\Facades\Auth;

/**
 * Perakit PDF surat keluar (resources/views/pdf/letter.blade.php).
 * Dipakai untuk pratinjau, unduhan surat yang belum ditandatangani, PDF final
 * saat pengesahan elektronik, dan versi cetak tanda tangan basah.
 */
class LetterPdf
{
    public function __construct(private SignatureStamp $stamp) {}

    /**
     * @param  bool  $forWetSignature  Versi cetak resmi untuk ditandatangani basah & distempel (tanpa TTD elektronik/QR).
     */
    public function build(Letter $letter, bool $isPreview = false, ?DocumentSignature $signature = null, bool $forWetSignature = false): DomPdf
    {
        abort_if(empty($letter->content), 404, 'Surat ini hanya reservasi nomor, tidak memiliki isi untuk dicetak.');

        // Model transien (pratinjau) belum punya relasi tersimpan; hanya load bila sudah ada di DB
        if ($letter->exists && ! $letter->relationLoaded('creator')) {
            $letter->load('creator', 'verifier');
        }

        $settings = CompanySetting::first();

        // Konten hasil paste dari Word/PDF sering penuh non-breaking space sehingga
        // dompdf tidak bisa memotong baris dan teks keluar dari halaman
        $letter->content = preg_replace('/(&nbsp;|\x{00A0})/u', ' ', $letter->content);

        $pdf = Pdf::loadView('pdf.letter', [
            'letter' => $letter,
            'settings' => $settings,
            'logo' => $this->stamp->logo(),
            'verificationCode' => $this->verificationCode($letter),
            'printedAt' => now()->locale('id')->translatedFormat('d M Y H:i'),
            'isPreview' => $isPreview,
            'isVerified' => $forWetSignature || (! $isPreview && ! empty($letter->verified_at)),
            'forWetSignature' => $forWetSignature,
            'verifierName' => $forWetSignature ? null : $letter->verifier?->name,
            'verifiedAt' => $letter->verified_at ? $letter->verified_at->locale('id')->translatedFormat('d F Y') : null,
            'signature' => $signature && ! $isPreview && ! $forWetSignature ? $this->stamp->forPdf($signature, $settings) : null,
        ]);
        $pdf->setPaper('a4', 'portrait');
        // Panel verifikasi memakai glyph centang dari DejaVu Sans; subsetting menjaga
        // ukuran PDF tetap kecil (hanya glyph terpakai yang di-embed, bukan seluruh font)
        $pdf->setOption('isFontSubsettingEnabled', true);

        return $pdf;
    }

    /**
     * Pratinjau dari data form yang belum disimpan, selalu berstatus Draft.
     */
    public function buildDraft(Letter $letter): DomPdf
    {
        $letter->status = 'Draft';
        $letter->setRelation('creator', Auth::user());

        return $this->build($letter, isPreview: true);
    }

    /**
     * Kode dokumen deterministik untuk kebutuhan penomoran arsip internal.
     * Format: XXXX-XXXX-XXXX (12 karakter heksadesimal huruf besar).
     */
    public function verificationCode(Letter $letter): string
    {
        $seed = implode('|', [
            $letter->reference_number ?? '',
            $letter->id ?? 'preview',
            optional($letter->letter_date)->format('Y-m-d') ?? '',
        ]);

        $hash = strtoupper(substr(hash('sha256', $seed), 0, 12));

        return implode('-', str_split($hash, 4));
    }
}
