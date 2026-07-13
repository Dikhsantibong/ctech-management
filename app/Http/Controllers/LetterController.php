<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

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
            'search' => $search
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
        ];

        $typeCode = $codeMap[$validated['type']] ?? 'SRT';
        
        $year = date('Y');
        $month = date('m');
        $romanMonths = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
            '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII'
        ];
        $monthRoman = $romanMonths[$month];
        
        // Count specific to the letter type, year, and month for a cleaner sequence
        $count = Letter::where('type', $validated['type'])
                       ->whereYear('created_at', $year)
                       ->whereMonth('created_at', $month)
                       ->count() + 1;
                       
        $refNumber = str_pad($count, 3, '0', STR_PAD_LEFT) . '/' . $typeCode . '/CTECH/' . $monthRoman . '/' . $year;

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

        \Inertia\Inertia::flash('toast', [
            'type' => 'success',
            'message' => $isNumberOnly
                ? "Nomor surat berhasil digenerate: {$letter->reference_number}"
                : "Surat berhasil dibuat: {$letter->reference_number}",
        ]);

        return redirect()->back()->with('success', 'Letter created successfully.');
    }

    public function show(Letter $letter)
    {
        $letter->load('creator');
        return Inertia::render('letters/show', [
            'letter' => $letter
        ]);
    }

    public function create()
    {
        return Inertia::render('letters/form', [
            'letter' => null,
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

        return redirect()->back()->with('success', 'Letter updated successfully.');
    }

    public function edit(Letter $letter)
    {
        $letter->load('creator');
        return Inertia::render('letters/form', [
            'letter' => $letter,
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
        return $pdf->download(str_replace('/', '-', $letter->reference_number) . '.pdf');
    }

    public function previewPdf(Letter $letter)
    {
        $pdf = $this->buildPdf($letter);
        return $pdf->stream(str_replace('/', '-', $letter->reference_number) . '.pdf');
    }

    private function buildPdf(Letter $letter)
    {
        abort_if(empty($letter->content), 404, 'Surat ini hanya reservasi nomor, tidak memiliki isi untuk dicetak.');

        $letter->load('creator');
        $settings = \App\Models\CompanySetting::first();

        // Konten hasil paste dari Word/PDF sering penuh non-breaking space sehingga
        // dompdf tidak bisa memotong baris dan teks keluar dari halaman
        $letter->content = preg_replace('/(&nbsp;|\x{00A0})/u', ' ', $letter->content);

        // Dompdf butuh ekstensi GD untuk merender PNG; tanpa guard ini server tanpa GD akan 500
        $logo = null;
        $logoPath = public_path('letter/main-logo.png');
        if (is_file($logoPath) && extension_loaded('gd')) {
            $logo = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.letter', [
            'letter' => $letter,
            'settings' => $settings,
            'logo' => $logo,
        ]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}
