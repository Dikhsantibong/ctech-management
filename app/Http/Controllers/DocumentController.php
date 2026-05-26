<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    use LogsActivity;
    public function index()
    {
        $documents = Document::with('creator')->latest()->get();
        return Inertia::render('documents/index', [
            'documents' => $documents
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $document = Document::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'Document', $document->id, "Membuat dokumen baru: {$document->title}");

        return redirect()->back()->with('success', 'Document created successfully.');
    }

    public function show(Document $document)
    {
        $document->load('creator');
        return Inertia::render('documents/show', [
            'document' => $document
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $document->update($validated);

        $this->logActivity('updated', 'Document', $document->id, "Mengupdate dokumen: {$document->title}");

        return redirect()->back()->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        $this->logActivity('deleted', 'Document', $document->id, "Menghapus dokumen: {$document->title}");
        $document->delete();
        return redirect()->back()->with('success', 'Document deleted.');
    }
}
