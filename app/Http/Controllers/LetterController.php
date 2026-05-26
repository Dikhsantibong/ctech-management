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
    public function index()
    {
        $letters = Letter::with('creator')->latest()->get();
        return Inertia::render('letters/index', [
            'letters' => $letters
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
            'content' => 'required|string',
        ]);

        // Generate reference number e.g. 001/CT/ST/2026
        $count = Letter::whereYear('created_at', date('Y'))->count() + 1;
        $typeCode = strtoupper(substr($validated['type'], 0, 2));
        $refNumber = str_pad($count, 3, '0', STR_PAD_LEFT) . '/CT/' . $typeCode . '/' . date('Y');

        $letter = Letter::create([
            'reference_number' => $refNumber,
            'type' => $validated['type'],
            'letter_date' => $validated['letter_date'],
            'sifat' => $validated['sifat'],
            'recipient' => $validated['recipient'],
            'subject' => $validated['subject'],
            'content' => $validated['content'],
            'status' => 'Draft',
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'Letter', $letter->id, "Membuat surat baru: {$letter->reference_number}");

        return redirect()->back()->with('success', 'Letter created successfully.');
    }

    public function show(Letter $letter)
    {
        $letter->load('creator');
        return Inertia::render('letters/show', [
            'letter' => $letter
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
            'content' => 'required|string',
            'status' => 'required|in:Draft,Final',
        ]);

        $letter->update($validated);

        $this->logActivity('updated', 'Letter', $letter->id, "Mengupdate surat: {$letter->reference_number}");

        return redirect()->back()->with('success', 'Letter updated successfully.');
    }

    public function destroy(Letter $letter)
    {
        $this->logActivity('deleted', 'Letter', $letter->id, "Menghapus surat: {$letter->reference_number}");
        $letter->delete();
        return redirect()->back()->with('success', 'Letter deleted.');
    }

    public function downloadPdf(Letter $letter)
    {
        $letter->load('creator');
        $pdf = Pdf::loadView('pdf.letter', ['letter' => $letter]);
        return $pdf->download(str_replace('/', '-', $letter->reference_number) . '.pdf');
    }
}
