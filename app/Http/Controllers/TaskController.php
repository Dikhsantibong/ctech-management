<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Traits\LogsActivity;
use App\Models\Meeting;
use App\Models\ProjectMilestone;
use App\Models\ClientFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    use LogsActivity;
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee', 'projectMilestone', 'clientFeedback', 'meeting'])->orderBy('created_at', 'desc');

        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        $tasks = $query->get();
        $projects = Project::all();
        $users = User::all();
        $milestones = ProjectMilestone::all();
        $feedbacks = ClientFeedback::all();
        $meetings = Meeting::all();
        
        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'users' => $users,
            'milestones' => $milestones,
            'feedbacks' => $feedbacks,
            'meetings' => $meetings,
            'filters' => $request->only('project_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'project_milestone_id' => 'nullable|exists:project_milestones,id',
            'client_feedback_id' => 'nullable|exists:client_feedbacks,id',
            'meeting_id' => 'nullable|exists:meetings,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Todo,Progress,Review,Done',
            'priority' => 'required|in:Low,Medium,High',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        $metadata = $validated['metadata'] ?? [];

        // Handle file uploads
        $attachments = [];
        if ($request->hasFile('new_attachments')) {
            foreach ($request->file('new_attachments') as $file) {
                $path = $file->store('task_attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ];
            }
        }
        
        if (count($attachments) > 0) {
            $metadata['attachments'] = $attachments;
        }

        $validated['metadata'] = $metadata;

        // Dicatat saat task benar-benar selesai — dipakai KPI ketepatan waktu
        $validated['completed_at'] = $validated['status'] === 'Done' ? now() : null;

        $task = Task::create($validated);

        $this->logActivity('created', 'Task', $task->id, "Membuat task baru: {$task->title}");

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'project_milestone_id' => 'nullable|exists:project_milestones,id',
            'client_feedback_id' => 'nullable|exists:client_feedbacks,id',
            'meeting_id' => 'nullable|exists:meetings,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Todo,Progress,Review,Done',
            'priority' => 'required|in:Low,Medium,High',
            'start_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        $metadata = $validated['metadata'] ?? [];

        $attachments = $metadata['attachments'] ?? [];
        if ($request->hasFile('new_attachments')) {
            foreach ($request->file('new_attachments') as $file) {
                $path = $file->store('task_attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ];
            }
            $metadata['attachments'] = $attachments;
        }

        $validated['metadata'] = $metadata;

        // Set saat berpindah ke Done, dikosongkan lagi bila dikembalikan ke status lain.
        // Tanggal penyelesaian yang sudah ada dipertahankan agar KPI bulan lalu tidak bergeser.
        if ($validated['status'] === 'Done') {
            $validated['completed_at'] = $task->completed_at ?? now();
        } else {
            $validated['completed_at'] = null;
        }

        $task->update($validated);

        $this->logActivity('updated', 'Task', $task->id, "Mengupdate task: {$task->title}");

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->logActivity('deleted', 'Task', $task->id, "Menghapus task: {$task->title}");
        $task->delete();
        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
