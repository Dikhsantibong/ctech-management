<?php

namespace App\Http\Controllers;

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
        $files = File::with('creator')->latest()->get();
        return Inertia::render('files/index', [
            'files' => $files
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $uploadedFile = $request->file('file');
        $name = $uploadedFile->getClientOriginalName();
        $extension = $uploadedFile->getClientOriginalExtension();
        $size = $uploadedFile->getSize();
        
        $path = $uploadedFile->store('company-files', 'local');

        $file = File::create([
            'name' => $name,
            'path' => $path,
            'extension' => $extension,
            'size' => $size,
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'File', $file->id, "Mengupload file baru: {$file->name}");

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    public function download(File $file)
    {
        return Storage::disk('local')->download($file->path, $file->name);
    }

    public function preview(File $file)
    {
        if (!Storage::disk('local')->exists($file->path)) {
            abort(404);
        }
        return Storage::disk('local')->response($file->path);
    }

    public function destroy(File $file)
    {
        Storage::disk('local')->delete($file->path);
        
        $this->logActivity('deleted', 'File', $file->id, "Menghapus file: {$file->name}");
        $file->delete();
        
        return redirect()->back()->with('success', 'File deleted.');
    }
}
