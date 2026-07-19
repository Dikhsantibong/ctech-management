<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectRevision;
use Illuminate\Http\Request;

class ProjectRevisionController extends Controller
{
    public function index(Project $project)
    {
        $revisions = $project->revisions()->with('requester')->latest()->get();
        return response()->json($revisions);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'version_tag' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Pending,In Progress,Completed'
        ]);

        $revision = $project->revisions()->create([
            'requested_by' => auth()->id(),
            'version_tag' => $request->version_tag,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json($revision->load('requester'), 201);
    }

    public function update(Request $request, ProjectRevision $revision)
    {
        $request->validate([
            'status' => 'required|in:Pending,In Progress,Completed'
        ]);

        $revision->update(['status' => $request->status]);

        return response()->json($revision);
    }
}
