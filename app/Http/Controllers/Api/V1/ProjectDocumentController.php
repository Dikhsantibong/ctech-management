<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectDocumentFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectDocumentController extends Controller
{
    // List all folders and files in a project
    public function index(Project $project, Request $request)
    {
        $folderId = $request->query('folder_id');

        $folders = $project->documentFolders()
            ->where('parent_id', $folderId)
            ->get();

        $documents = $project->documents()
            ->with(['uploader', 'permissions'])
            ->where('folder_id', $folderId)
            ->get();

        // Apply RBAC: if user is not CEO, filter out confidential documents unless they have explicit permission
        $user = auth()->user();
        if (!in_array($user->role, ['direktur_utama', 'direktur_operasional'])) {
            $documents = $documents->filter(function($doc) use ($user) {
                if (!$doc->is_confidential) return true;
                // If confidential, check explicit permission
                return $doc->permissions()->where('user_id', $user->id)->exists();
            })->values();
        }

        return response()->json([
            'folders' => $folders,
            'documents' => $documents
        ]);
    }

    // Create a new folder
    public function storeFolder(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:project_document_folders,id'
        ]);

        $folder = $project->documentFolders()->create([
            'name' => $request->name,
            'parent_id' => $request->parent_id
        ]);

        return response()->json($folder, 201);
    }

    // Upload a new document or new version
    public function storeDocument(Request $request, Project $project)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // max 50MB
            'folder_id' => 'nullable|exists:project_document_folders,id',
            'is_confidential' => 'boolean'
        ]);

        $file = $request->file('file');
        $path = $file->store("projects/{$project->id}/documents");

        $document = $project->documents()->create([
            'folder_id' => $request->folder_id,
            'uploaded_by' => auth()->id(),
            'name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'is_confidential' => $request->is_confidential ?? false,
        ]);

        return response()->json($document->load('uploader'), 201);
    }

    // Download document
    public function download(ProjectDocument $document)
    {
        $user = auth()->user();
        
        // Check permission if confidential
        if ($document->is_confidential && !in_array($user->role, ['direktur_utama', 'direktur_operasional'])) {
            if (!$document->permissions()->where('user_id', $user->id)->exists()) {
                abort(403, 'Unauthorized access to confidential document.');
            }
        }

        return Storage::download($document->file_path, $document->name);
    }

    // Delete document
    public function destroy(ProjectDocument $document)
    {
        Storage::delete($document->file_path);
        $document->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
