<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\File;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $files = File::with(['creator', 'client'])->latest()->get();
        $clients = Client::orderBy('name')->get(['id', 'name']);

        return Inertia::render('files/index', [
            'files' => $files,
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'files' => 'required|array|min:1',
            'files.*' => 'file|max:10240', // 10MB per file
            'client_id' => 'nullable|exists:clients,id',
        ]);

        $count = 0;
        foreach ($request->file('files') as $uploadedFile) {
            // store() memberi nama acak sehingga path file tidak bisa ditebak
            $path = $uploadedFile->store('company-files', 'local');

            $file = File::create([
                'name' => $uploadedFile->getClientOriginalName(),
                'path' => $path,
                'extension' => $uploadedFile->getClientOriginalExtension(),
                'size' => $uploadedFile->getSize(),
                'created_by' => Auth::id(),
                'client_id' => $validated['client_id'] ?? null,
            ]);

            $this->logActivity('created', 'File', $file->id, "Mengupload file baru: {$file->name}");
            $count++;
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count . ' file berhasil diupload.',
        ]);

        return redirect()->back()->with('success', 'Files uploaded successfully.');
    }

    public function download(File $file)
    {
        abort_unless(Storage::disk('local')->exists($file->path), 404);

        return Storage::disk('local')
            ->download($file->path, $file->name)
            ->withHeaders(['X-Robots-Tag' => 'noindex, nofollow, noarchive']);
    }

    public function preview(File $file)
    {
        abort_unless(Storage::disk('local')->exists($file->path), 404);

        return Storage::disk('local')
            ->response($file->path)
            ->withHeaders(['X-Robots-Tag' => 'noindex, nofollow, noarchive']);
    }

    public function destroy(File $file)
    {
        Storage::disk('local')->delete($file->path);

        $this->logActivity('deleted', 'File', $file->id, "Menghapus file: {$file->name}");
        $file->delete();

        return redirect()->back()->with('success', 'File deleted.');
    }
}
