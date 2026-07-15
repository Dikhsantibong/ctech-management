<?php

namespace App\Http\Controllers;

use App\Models\IncomingLetter;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IncomingLetterController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        $query = IncomingLetter::with('creator');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('agenda_number', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%")
                  ->orWhere('sender', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $incomingLetters = $query->latest()->get();

        return Inertia::render('incoming-letters/index', [
            'incomingLetters' => $incomingLetters,
            'search' => $search,
            'statusFilter' => $status,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference_number' => 'required|string|max:255',
            'sender' => 'required|string|max:255',
            'letter_date' => 'required|date',
            'received_date' => 'required|date',
            'subject' => 'required|string|max:255',
            'sifat' => 'required|string|max:255',
            'disposition' => 'nullable|string',
            'notes' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        // Generate agenda number: AGD-001/SM/VII/2026
        $year = date('Y');
        $month = date('m');
        $romanMonths = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
            '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII'
        ];
        $monthRoman = $romanMonths[$month];

        $count = IncomingLetter::whereYear('created_at', $year)
                               ->whereMonth('created_at', $month)
                               ->count() + 1;

        $agendaNumber = 'AGD-' . str_pad($count, 3, '0', STR_PAD_LEFT) . '/SM/' . $monthRoman . '/' . $year;

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('incoming-letters', 'public');
        }

        $letter = IncomingLetter::create([
            'agenda_number' => $agendaNumber,
            'reference_number' => $validated['reference_number'],
            'sender' => $validated['sender'],
            'letter_date' => $validated['letter_date'],
            'received_date' => $validated['received_date'],
            'subject' => $validated['subject'],
            'sifat' => $validated['sifat'],
            'disposition' => $validated['disposition'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'attachment_path' => $attachmentPath,
            'status' => 'Diterima',
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'IncomingLetter', $letter->id, "Mencatat surat masuk: {$letter->agenda_number}");

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Surat masuk berhasil dicatat: {$letter->agenda_number}",
        ]);

        return redirect()->back()->with('success', 'Surat masuk berhasil dicatat.');
    }

    public function show(IncomingLetter $incoming_letter)
    {
        $incoming_letter->load('creator');
        return Inertia::render('incoming-letters/show', [
            'incomingLetter' => $incoming_letter,
        ]);
    }

    public function update(Request $request, IncomingLetter $incoming_letter)
    {
        $validated = $request->validate([
            'reference_number' => 'required|string|max:255',
            'sender' => 'required|string|max:255',
            'letter_date' => 'required|date',
            'received_date' => 'required|date',
            'subject' => 'required|string|max:255',
            'sifat' => 'required|string|max:255',
            'disposition' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:Diterima,Diproses,Selesai,Diarsipkan',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($incoming_letter->attachment_path) {
                Storage::disk('public')->delete($incoming_letter->attachment_path);
            }
            $validated['attachment_path'] = $request->file('attachment')->store('incoming-letters', 'public');
        }

        unset($validated['attachment']);

        $incoming_letter->update($validated);

        $this->logActivity('updated', 'IncomingLetter', $incoming_letter->id, "Mengupdate surat masuk: {$incoming_letter->agenda_number}");

        return redirect()->back()->with('success', 'Surat masuk berhasil diupdate.');
    }

    public function destroy(IncomingLetter $incoming_letter)
    {
        // Delete attachment file if exists
        if ($incoming_letter->attachment_path) {
            Storage::disk('public')->delete($incoming_letter->attachment_path);
        }

        $this->logActivity('deleted', 'IncomingLetter', $incoming_letter->id, "Menghapus surat masuk: {$incoming_letter->agenda_number}");

        $incoming_letter->delete();

        return redirect()->back()->with('success', 'Surat masuk berhasil dihapus.');
    }

    public function downloadAttachment(IncomingLetter $incoming_letter)
    {
        abort_if(empty($incoming_letter->attachment_path), 404, 'Surat ini tidak memiliki lampiran.');

        return Storage::disk('public')->download($incoming_letter->attachment_path);
    }
}
