<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\Letter;
use App\Services\Documents\DocumentSigner;
use App\Services\Documents\LetterPdf;
use App\Support\MenuRegistry;
use App\Traits\LogsActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class LetterController extends Controller
{
    use LogsActivity;

    public function __construct(private LetterPdf $pdf, private DocumentSigner $signer) {}

    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $query = Letter::with('creator')->withExists(['signatures as is_signed' => fn ($query) => $query->whereNull('revoked_at')]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $letters = $query->latest()->get();

        return Inertia::render('letters/index', [
            'letters' => $letters,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'letter_date' => 'required|date',
            'sifat' => 'required|string|max:255',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'nullable|string', // kosong = hanya reservasi nomor surat
            'margin_top' => 'nullable|integer|min:5|max:60',
            'margin_right' => 'nullable|integer|min:5|max:60',
            'margin_bottom' => 'nullable|integer|min:5|max:60',
            'margin_left' => 'nullable|integer|min:5|max:60',
            'line_spacing' => 'nullable|in:1,1.15,1.5,2',
        ]);

        // Generate proper type code based on the letter type
        $codeMap = [
            'Surat Keputusan' => 'SK',
            'Surat Tugas' => 'ST',
            'Surat Keterangan' => 'SKET',
            'Surat Penawaran' => 'SPNW',
            'Surat Peringatan' => 'SP',
            'Surat Undangan' => 'SUND',
            'Surat Izin' => 'SI',
            'Surat Keterangan Kerja' => 'SKK',
            'Surat Pengantar' => 'SPG',
            'Surat Pemberitahuan' => 'SPMB',
            'Surat Rekomendasi' => 'SREK',
            'Surat Permohonan' => 'SPRM',
            'Surat Kontrak' => 'SKTR',
            'Surat Pernyataan' => 'SPER',
            'Berita Acara' => 'BA',
            'Berita Acara Serah Terima Pekerjaan' => 'BAST',
            'Berita Acara Pemeriksaan Pekerjaan' => 'BAPP',
            'Berita Acara Kesepakatan' => 'BAK',
            'Berita Acara Pembayaran' => 'BAP',
            'Berita Acara Rapat' => 'BAR',
            'Berita Acara Kejadian' => 'BAKJ',
        ];

        $typeCode = $codeMap[$validated['type']] ?? 'SRT';

        $parsedDate = Carbon::parse($validated['letter_date']);
        $year = $parsedDate->format('Y');
        $month = $parsedDate->format('m');
        $romanMonths = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
            '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII',
        ];
        $monthRoman = $romanMonths[$month];

        // Get the latest sequence based on the letter suffix format
        $suffix = "/{$typeCode}/CTECH/{$monthRoman}/{$year}";

        $latestLetter = Letter::where('reference_number', 'like', "%{$suffix}")
            ->orderBy('reference_number', 'desc')
            ->first();

        if ($latestLetter) {
            $lastSequence = (int) explode('/', $latestLetter->reference_number)[0];
            $nextId = $lastSequence + 1;
        } else {
            $nextId = 1;
        }

        $refNumber = str_pad($nextId, 3, '0', STR_PAD_LEFT).$suffix;

        $isNumberOnly = empty($validated['content']);

        $letter = Letter::create([
            'reference_number' => $refNumber,
            'type' => $validated['type'],
            'letter_date' => $validated['letter_date'],
            'sifat' => $validated['sifat'],
            'recipient' => $validated['recipient'],
            'subject' => $validated['subject'],
            'content' => $validated['content'] ?? null,
            'status' => 'Draft',
            'created_by' => Auth::id(),
            'margin_top' => $validated['margin_top'] ?? null,
            'margin_right' => $validated['margin_right'] ?? null,
            'margin_bottom' => $validated['margin_bottom'] ?? null,
            'margin_left' => $validated['margin_left'] ?? null,
            'line_spacing' => $validated['line_spacing'] ?? null,
        ]);

        $this->logActivity('created', 'Letter', $letter->id, $isNumberOnly
            ? "Generate nomor surat: {$letter->reference_number}"
            : "Membuat surat baru: {$letter->reference_number}");

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $isNumberOnly
                ? "Nomor surat berhasil digenerate: {$letter->reference_number}"
                : "Surat berhasil dibuat: {$letter->reference_number}",
        ]);

        return redirect()->route('letters.index')->with('success', 'Letter created successfully.');
    }

    public function show(Letter $letter)
    {
        $letter->load('creator', 'verifier', 'activeSignature');
        $signature = $letter->activeSignature;

        return Inertia::render('letters/show', [
            'letter' => $letter,
            'verification_code' => $letter->content ? $this->pdf->verificationCode($letter) : null,
            'settings' => CompanySetting::first(),
            'can_verify' => Auth::user()?->role === MenuRegistry::SUPER_ROLE,
            'signature' => $signature?->toPanel(),
            'has_signature_image' => (bool) CompanySetting::first()?->has_signature_image,
        ]);
    }

    public function create()
    {
        return Inertia::render('letters/form', [
            'letter' => null,
            'settings' => CompanySetting::first(),
        ]);
    }

    public function update(Request $request, Letter $letter)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'letter_date' => 'required|date',
            'sifat' => 'required|string|max:255',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'nullable|string',
            'margin_top' => 'nullable|integer|min:5|max:60',
            'margin_right' => 'nullable|integer|min:5|max:60',
            'margin_bottom' => 'nullable|integer|min:5|max:60',
            'margin_left' => 'nullable|integer|min:5|max:60',
            'line_spacing' => 'nullable|in:1,1.15,1.5,2',
        ]);

        $this->ensureNotSigned($letter);

        // Status/pengesahan tidak diubah di sini — hanya lewat verifikasi Direktur Utama
        $letter->update($validated);

        $this->logActivity('updated', 'Letter', $letter->id, "Mengupdate surat: {$letter->reference_number}");

        return redirect()->route('letters.index')->with('success', 'Letter updated successfully.');
    }

    public function edit(Letter $letter)
    {
        $this->ensureNotSigned($letter);

        $letter->load('creator');

        return Inertia::render('letters/form', [
            'letter' => $letter,
            'settings' => CompanySetting::first(),
        ]);
    }

    public function destroy(Letter $letter)
    {
        $this->ensureNotSigned($letter);

        $this->logActivity('deleted', 'Letter', $letter->id, "Menghapus surat: {$letter->reference_number}");
        $letter->delete();

        return redirect()->back()->with('success', 'Letter deleted.');
    }

    public function downloadPdf(Letter $letter): HttpResponse
    {
        return $this->pdfResponse($letter, 'attachment');
    }

    public function previewPdf(Letter $letter): HttpResponse
    {
        return $this->pdfResponse($letter, 'inline');
    }

    /**
     * Surat yang sudah ditandatangani selalu dikirim dari file PDF beku (byte identik,
     * sehingga sidik digitalnya cocok); surat lain dirender ulang.
     */
    private function pdfResponse(Letter $letter, string $disposition): HttpResponse
    {
        $filename = str_replace('/', '-', $letter->reference_number).'.pdf';

        if ($signed = $this->signer->signedPdfResponse($letter, $filename, $disposition)) {
            return $signed;
        }

        $pdf = $this->pdf->build($letter);

        return $disposition === 'attachment' ? $pdf->download($filename) : $pdf->stream($filename);
    }

    /**
     * Pratinjau PDF dari data form sebelum surat benar-benar disimpan.
     * Selalu diberi watermark DRAFT karena dokumennya belum resmi.
     */
    public function previewDraft(Request $request)
    {
        // Pratinjau bersifat longgar: hanya isi surat yang wajib agar draft
        // setengah jadi tetap bisa dilihat. Field lain diberi nilai default.
        $validated = $request->validate([
            'type' => 'nullable|string|max:255',
            'letter_date' => 'nullable|date',
            'sifat' => 'nullable|string|max:255',
            'recipient' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'reference_number' => 'nullable|string|max:255',
            'margin_top' => 'nullable|integer|min:5|max:60',
            'margin_right' => 'nullable|integer|min:5|max:60',
            'margin_bottom' => 'nullable|integer|min:5|max:60',
            'margin_left' => 'nullable|integer|min:5|max:60',
            'line_spacing' => 'nullable|in:1,1.15,1.5,2',
        ]);

        $letter = new Letter([
            'type' => $validated['type'] ?? 'Surat',
            'letter_date' => $validated['letter_date'] ?? now()->toDateString(),
            'sifat' => $validated['sifat'] ?? 'Biasa',
            'recipient' => $validated['recipient'] ?? '-',
            'subject' => $validated['subject'] ?? '-',
            'content' => $validated['content'],
            'margin_top' => $validated['margin_top'] ?? null,
            'margin_right' => $validated['margin_right'] ?? null,
            'margin_bottom' => $validated['margin_bottom'] ?? null,
            'margin_left' => $validated['margin_left'] ?? null,
            'line_spacing' => $validated['line_spacing'] ?? null,
        ]);
        $letter->reference_number = $validated['reference_number'] ?? 'XXX/DRAFT/CTECH';

        // Pratinjau selalu Draft agar tidak menghasilkan dokumen yang tampak resmi
        return $this->pdf->buildDraft($letter)->stream('pratinjau-surat.pdf');
    }

    /**
     * Halaman verifikasi internal: mencocokkan Kode Dokumen ke arsip surat.
     * Bukan verifikasi TTE tersertifikasi — hanya konfirmasi keaslian arsip
     * internal untuk staf yang sudah login.
     */
    public function verify(Request $request)
    {
        $input = (string) $request->input('code', '');
        $normalized = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $input));

        $result = null;

        if ($normalized !== '') {
            $match = Letter::with('creator')->get()->first(
                fn (Letter $letter) => str_replace('-', '', $this->pdf->verificationCode($letter)) === $normalized
            );

            if ($match) {
                $result = [
                    'found' => true,
                    'reference_number' => $match->reference_number,
                    'type' => $match->type,
                    'subject' => $match->subject,
                    'recipient' => $match->recipient,
                    'letter_date' => optional($match->letter_date)->toDateString(),
                    'status' => $match->status,
                    'issuer' => CompanySetting::first()?->company_name,
                    'creator' => $match->creator?->name,
                    'code' => $this->pdf->verificationCode($match),
                ];
            } else {
                $result = ['found' => false];
            }
        }

        return Inertia::render('letters/verify', [
            'code' => $input,
            'result' => $result,
        ]);
    }

    /**
     * Surat yang sudah ditandatangani tidak boleh diubah/dihapus sebelum tanda tangannya dicabut.
     */
    private function ensureNotSigned(Letter $letter): void
    {
        abort_if(
            $letter->isSigned(),
            423,
            'Surat sudah ditandatangani. Cabut pengesahan terlebih dahulu untuk mengubah atau menghapus.'
        );
    }
}
