<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Invoice;
use App\Models\Letter;
use App\Models\Quotation;
use App\Services\Documents\DocumentSigner;
use App\Services\Documents\SignableDocument;
use App\Support\MenuRegistry;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

/**
 * Pengesahan elektronik, pencabutan, cetak untuk tanda tangan basah (khusus Direktur Utama),
 * dan halaman verifikasi publik dari QR code untuk surat, penawaran/RAB, dan kwitansi.
 */
class DocumentSignatureController extends Controller
{
    use LogsActivity;

    /** @var array<string, class-string<SignableDocument>> */
    private const DOCUMENTS = [
        'letter' => Letter::class,
        'quotation' => Quotation::class,
        'kwitansi' => Invoice::class,
    ];

    public function __construct(private DocumentSigner $signer) {}

    public function sign(Request $request, string $documentType, int $documentId): RedirectResponse
    {
        $document = $this->authorizedDocument($documentType, $documentId);

        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ], [
            'password.required' => 'Masukkan password untuk mengonfirmasi tanda tangan.',
            'password.current_password' => 'Password tidak sesuai.',
        ]);

        $this->signer->sign($document, $request->user(), $request->ip(), $request->userAgent());

        $this->logActivity('signed', class_basename($document), $document->getKey(),
            "Mengesahkan & menandatangani {$document->signatureDocumentLabel()}: {$document->signatureDocumentNumber()}");

        return redirect()->back()->with('success', "{$document->signatureDocumentLabel()} berhasil disahkan dan ditandatangani.");
    }

    public function revoke(string $documentType, int $documentId): RedirectResponse
    {
        $document = $this->authorizedDocument($documentType, $documentId);

        $this->signer->revoke($document, Auth::user());

        $this->logActivity('unverified', class_basename($document), $document->getKey(),
            "Mencabut pengesahan & tanda tangan {$document->signatureDocumentLabel()}: {$document->signatureDocumentNumber()}");

        return redirect()->back()->with('success', 'Pengesahan dan tanda tangan dicabut.');
    }

    /**
     * Versi cetak tanpa tanda tangan elektronik, cap, dan QR — untuk tanda tangan basah & stempel.
     */
    public function printForWetSignature(string $documentType, int $documentId): HttpResponse
    {
        $document = $this->authorizedDocument($documentType, $documentId);

        $this->logActivity('printed', class_basename($document), $document->getKey(),
            "Mencetak {$document->signatureDocumentLabel()} untuk tanda tangan basah: {$document->signatureDocumentNumber()}");

        $filename = str_replace('/', '-', $document->signatureDocumentNumber()).'-ttd-basah.pdf';

        return $this->signer->wetSignaturePdf($document)->stream($filename);
    }

    /**
     * Halaman verifikasi publik dari QR code. Hanya identitas dokumen & penandatangan, bukan isinya.
     */
    public function verify(string $token): Response
    {
        return Inertia::render('public/document-verification', [
            'token' => $token,
            'document' => $this->publicDocument($token),
            'match' => null,
        ]);
    }

    /**
     * Cocokkan PDF yang diterima dengan PDF resmi (sidik digital SHA-256).
     */
    public function verifyFile(Request $request, string $token): Response
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:20480'],
        ]);

        $signature = DocumentSignature::where('token', $token)->first();

        return Inertia::render('public/document-verification', [
            'token' => $token,
            'document' => $this->publicDocument($token),
            'match' => $signature ? $this->signer->matches($signature, $request->file('file')->get()) : false,
        ]);
    }

    private function authorizedDocument(string $documentType, int $documentId): SignableDocument
    {
        abort_unless(
            Auth::user()?->role === MenuRegistry::SUPER_ROLE,
            403,
            'Hanya Direktur Utama yang dapat menandatangani atau mencetak dokumen untuk tanda tangan basah.'
        );

        $class = self::DOCUMENTS[$documentType] ?? abort(404);

        return $class::findOrFail($documentId);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function publicDocument(string $token): ?array
    {
        $signature = DocumentSignature::with('signable')->where('token', $token)->first();
        $document = $signature?->signable;

        if (! $document instanceof SignableDocument) {
            return null;
        }

        return [
            'label' => $document->signatureDocumentLabel(),
            'number' => $document->signatureDocumentNumber(),
            ...$document->signatureSummary(),
            'issuer' => CompanySetting::first()?->company_name,
            'signer_name' => $signature->signer_name,
            'signer_title' => $signature->signer_title,
            'signed_at' => $signature->signed_at->toIso8601String(),
            'revoked_at' => $signature->revoked_at?->toIso8601String(),
            'pdf_hash' => $signature->pdf_hash,
        ];
    }
}
