<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use LogsActivity;
    public function index()
    {
        $projects = Project::with('members')->latest()->get();
        $users = User::all();
        
        return Inertia::render('projects/index', [
            'projects' => $projects,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Planning,Progress,Review,Completed',
            'project_type' => 'required|string|max:255',
            'metadata' => 'nullable|array',
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id'
        ]);

        $project = Project::create($validated);
        
        if (isset($validated['members'])) {
            $project->members()->sync($validated['members']);
        }

        $this->logActivity('created', 'Project', $project->id, "Membuat project baru: {$project->project_name}");

        return redirect()->back()->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load('members', 'tasks');
        return Inertia::render('projects/show', [
            'project' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Planning,Progress,Review,Completed',
            'project_type' => 'required|string|max:255',
            'metadata' => 'nullable|array',
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id'
        ]);

        $project->update($validated);
        
        if (isset($validated['members'])) {
            $project->members()->sync($validated['members']);
        } else {
            $project->members()->detach();
        }

        $this->logActivity('updated', 'Project', $project->id, "Mengupdate project: {$project->project_name}");

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $this->logActivity('deleted', 'Project', $project->id, "Menghapus project: {$project->project_name}");
        $project->delete();
        return redirect()->back()->with('success', 'Project deleted successfully.');
    }
}
