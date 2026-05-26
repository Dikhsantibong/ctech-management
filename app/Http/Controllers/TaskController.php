<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    use LogsActivity;
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee'])->latest();

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $tasks = $query->get();
        $projects = Project::all();
        $users = User::all();
        
        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'users' => $users,
            'filters' => $request->only('project_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Todo,Progress,Review,Done',
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date',
        ]);

        $task = Task::create($validated);

        $this->logActivity('created', 'Task', $task->id, "Membuat task baru: {$task->title}");

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Todo,Progress,Review,Done',
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date',
        ]);

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
