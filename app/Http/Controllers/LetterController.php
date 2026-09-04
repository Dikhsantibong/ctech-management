<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\Letter;
use App\Traits\LogsActivity;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LetterController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $query = Letter::with('creator');

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
        $letter->load('creator');

        return Inertia::render('letters/show', [
            'letter' => $letter,
            'verification_code' => $letter->content ? $this->verificationCode($letter) : null,
            'settings' => CompanySetting::first(),
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
            'status' => 'required|in:Draft,Final',
            'margin_top' => 'nullable|integer|min:5|max:60',
            'margin_right' => 'nullable|integer|min:5|max:60',
            'margin_bottom' => 'nullable|integer|min:5|max:60',
            'margin_left' => 'nullable|integer|min:5|max:60',
            'line_spacing' => 'nullable|in:1,1.15,1.5,2',
        ]);

        $letter->update($validated);

        $this->logActivity('updated', 'Letter', $letter->id, "Mengupdate surat: {$letter->reference_number}");

        return redirect()->route('letters.index')->with('success', 'Letter updated successfully.');
    }

    public function edit(Letter $letter)
    {
        $letter->load('creator');

        return Inertia::render('letters/form', [
            'letter' => $letter,
            'settings' => CompanySetting::first(),
        ]);
    }

    public function destroy(Letter $letter)
    {
        $this->logActivity('deleted', 'Letter', $letter->id, "Menghapus surat: {$letter->reference_number}");
        $letter->delete();

        return redirect()->back()->with('success', 'Letter deleted.');
    }

    public function downloadPdf(Letter $letter)
    {
        $pdf = $this->buildPdf($letter);

        return $pdf->download(str_replace('/', '-', $letter->reference_number).'.pdf');
    }

    public function previewPdf(Letter $letter)
    {
        $pdf = $this->buildPdf($letter);

        return $pdf->stream(str_replace('/', '-', $letter->reference_number).'.pdf');
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
        $letter->status = 'Draft';
        $letter->setRelation('creator', Auth::user());

        $pdf = $this->buildPdf($letter, isPreview: true);

        return $pdf->stream('pratinjau-surat.pdf');
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
                fn (Letter $letter) => str_replace('-', '', $this->verificationCode($letter)) === $normalized
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
                    'code' => $this->verificationCode($match),
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

    private function buildPdf(Letter $letter, bool $isPreview = false)
    {
        abort_if(empty($letter->content), 404, 'Surat ini hanya reservasi nomor, tidak memiliki isi untuk dicetak.');

        // Model transien (pratinjau) belum punya relasi tersimpan; hanya load bila sudah ada di DB
        if ($letter->exists && ! $letter->relationLoaded('creator')) {
            $letter->load('creator');
        }

        $settings = CompanySetting::first();

        // Konten hasil paste dari Word/PDF sering penuh non-breaking space sehingga
        // dompdf tidak bisa memotong baris dan teks keluar dari halaman
        $letter->content = preg_replace('/(&nbsp;|\x{00A0})/u', ' ', $letter->content);

        // Dompdf butuh ekstensi GD untuk merender PNG; tanpa guard ini server tanpa GD akan 500
        $logo = null;
        $logoPath = public_path('letter/main-logo.png');
        if (is_file($logoPath) && extension_loaded('gd')) {
            $logo = 'data:image/png;base64,'.base64_encode(file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.letter', [
            'letter' => $letter,
            'settings' => $settings,
            'logo' => $logo,
            'verificationCode' => $this->verificationCode($letter),
            'printedAt' => now()->locale('id')->translatedFormat('d M Y H:i'),
            'isPreview' => $isPreview,
        ]);
        $pdf->setPaper('a4', 'portrait');
        // Panel verifikasi memakai glyph centang dari DejaVu Sans; subsetting menjaga
        // ukuran PDF tetap kecil (hanya glyph terpakai yang di-embed, bukan seluruh font)
        $pdf->setOption('isFontSubsettingEnabled', true);

        return $pdf;
    }

    /**
     * Kode dokumen deterministik untuk kebutuhan penomoran arsip internal.
     * Bukan tanda tangan/verifikasi elektronik tersertifikasi (TTE) — hanya
     * referensi pengecekan keaslian arsip di sistem perusahaan.
     * Format: XXXX-XXXX-XXXX (12 karakter heksadesimal huruf besar).
     */
    private function verificationCode(Letter $letter): string
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
