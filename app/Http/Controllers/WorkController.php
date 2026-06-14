<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class WorkController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $query = Work::with(['assignee', 'collaborators', 'client', 'project'])
            ->orderBy('created_at', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('client', function ($q2) use ($request) {
                      $q2->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $works = $query->get();
        $clients = Client::all();
        $projects = Project::all();
        $users = User::all();
        
        return Inertia::render('works/index', [
            'works' => $works,
            'clients' => $clients,
            'projects' => $projects,
            'users' => $users,
            'filters' => $request->only('category', 'search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|in:Low,Medium,High,Critical',
            'user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'estimated_duration' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'description' => 'nullable|string',
            'checklist' => 'nullable|array',
            'reminder' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|string',
            'status' => 'required|in:Inbox,Todo,In Progress,Waiting,Review,Done',
            'collaborators' => 'nullable|array',
            'collaborators.*' => 'exists:users,id',
        ]);

        // Handle file uploads
        $attachments = [];
        if ($request->hasFile('new_attachments')) {
            foreach ($request->file('new_attachments') as $file) {
                $path = $file->store('work_attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ];
            }
        }
        $validated['attachments'] = count($attachments) > 0 ? $attachments : null;

        $work = Work::create($validated);

        if ($request->has('collaborators')) {
            $work->collaborators()->sync($request->collaborators);
        }

        $this->logActivity('created', 'Work', $work->id, "Membuat work baru: {$work->title}");

        return redirect()->back()->with('success', 'Work created successfully.');
    }

    public function update(Request $request, Work $work)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|in:Low,Medium,High,Critical',
            'user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'estimated_duration' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'description' => 'nullable|string',
            'checklist' => 'nullable|array',
            'reminder' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|string',
            'status' => 'required|in:Inbox,Todo,In Progress,Waiting,Review,Done',
            'collaborators' => 'nullable|array',
            'collaborators.*' => 'exists:users,id',
            'attachments' => 'nullable|array' // Existing attachments to keep
        ]);

        $existingAttachments = $request->input('attachments', []);
        
        if ($request->hasFile('new_attachments')) {
            foreach ($request->file('new_attachments') as $file) {
                $path = $file->store('work_attachments', 'public');
                $existingAttachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ];
            }
        }
        $validated['attachments'] = $existingAttachments;

        $work->update($validated);

        if ($request->has('collaborators')) {
            $work->collaborators()->sync($request->collaborators);
        }

        $this->logActivity('updated', 'Work', $work->id, "Mengupdate work: {$work->title}");

        return redirect()->back()->with('success', 'Work updated successfully.');
    }

    public function destroy(Work $work)
    {
        $this->logActivity('deleted', 'Work', $work->id, "Menghapus work: {$work->title}");
        
        if ($work->attachments) {
            foreach ($work->attachments as $attachment) {
                Storage::disk('public')->delete($attachment['path']);
            }
        }

        $work->delete();
        return redirect()->back()->with('success', 'Work deleted successfully.');
    }

    public function report()
    {
        $works = Work::with(['assignee', 'client'])->get();
        
        $metrics = [
            'totalWorks' => $works->count(),
            'completedWorks' => $works->where('status', 'Done')->count(),
            'activeWorks' => $works->whereIn('status', ['Todo', 'In Progress', 'Waiting', 'Review'])->count(),
            'overdueWorks' => $works->where('due_date', '<', now()->format('Y-m-d'))->where('status', '!=', 'Done')->count(),
        ];
        
        $metrics['completionRate'] = $metrics['totalWorks'] > 0 ? round(($metrics['completedWorks'] / $metrics['totalWorks']) * 100) : 0;

        return Inertia::render('works/report', [
            'works' => $works,
            'metrics' => $metrics
        ]);
    }
}
