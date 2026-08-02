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
    public function index(Request $request)
    {
        $search = $request->input('search');

        $projects = Project::with('members')
            ->when($search, function ($query, $search) {
                $query->where('project_name', 'like', "%{$search}%")
                      ->orWhere('client_name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $users = User::all();
        
        return Inertia::render('projects/index', [
            'projects' => $projects,
            'users' => $users,
            'filters' => ['search' => $search]
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
        $project->load([
            'members',
            'tasks',
            'milestones' => function($query) {
                $query->with(['pic', 'checklists', 'tasks']);
            },
            'revisions.requester',
            'feedbacks',
            'meetings.participants',
            'documents.uploader'
        ]);
        return Inertia::render('projects/show', [
            'project' => $project,
            'users' => User::all(), // Needed for assigning PIC to milestone
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

    public function storeRevision(Request $request, Project $project)
    {
        $validated = $request->validate([
            'version_tag' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:255',
        ]);

        $project->revisions()->create([
            'requested_by' => auth()->id(),
            'version_tag' => $validated['version_tag'],
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'status' => $validated['status'],
        ]);

        return redirect()->back();
    }

    public function storeFeedback(Request $request, Project $project)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|string|max:255',
            'status' => 'required|string|max:255',
        ]);

        $project->feedbacks()->create([
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'],
            'status' => $validated['status'],
        ]);

        return redirect()->back();
    }

    public function updateRevisionStatus(Request $request, Project $project, $revisionId)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,In Progress,Completed',
        ]);

        $revision = $project->revisions()->findOrFail($revisionId);
        $revision->update(['status' => $validated['status']]);

        return redirect()->back();
    }

    public function updateFeedbackStatus(Request $request, Project $project, $feedbackId)
    {
        $validated = $request->validate([
            'status' => 'required|in:Open,Review,Development,Testing,Completed',
        ]);

        $feedback = $project->feedbacks()->findOrFail($feedbackId);
        $feedback->update(['status' => $validated['status']]);

        return redirect()->back();
    }

    public function convertFeedbackToTask(Request $request, Project $project, $feedbackId)
    {
        $feedback = \App\Models\ClientFeedback::findOrFail($feedbackId);
        
        $project->tasks()->create([
            'title' => 'Feedback: ' . $feedback->subject,
            'description' => $feedback->message,
            'status' => 'Todo',
            'priority' => $feedback->priority === 'Urgent' ? 'High' : ($feedback->priority === 'High' ? 'High' : 'Medium'),
            'metadata' => [
                'checklists' => [],
                'attachments' => [],
                'comments' => [
                    ['id' => uniqid(), 'user' => 'System', 'text' => 'Task automatically generated from client feedback.', 'timestamp' => now()->format('Y-m-d H:i:s')]
                ]
            ]
        ]);

        $feedback->update(['status' => 'Development']);

        return redirect()->back();
    }


    public function updateMetadata(Request $request, Project $project)
    {
        $validated = $request->validate([
            'tech_stack' => 'nullable|string',
            'repo_link' => 'nullable|string',
            'domain_link' => 'nullable|string',
            'design_link' => 'nullable|string',
            'structure_notes' => 'nullable|string',
        ]);

        $metadata = $project->metadata ?? [];
        $project->update([
            'metadata' => array_merge($metadata, $validated)
        ]);

        return redirect()->back();
    }

}
