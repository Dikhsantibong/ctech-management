<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMilestone;
use Illuminate\Http\Request;

class ProjectMilestoneController extends Controller
{
    public function __construct()
    {
        // Require authentication
        $this->middleware(['auth', 'verified']);
        
        // Developer can only update progress
        $this->middleware('role:direktur_utama,direktur_operasional,admin_operasional,staff')
             ->only(['index', 'store', 'update', 'destroy']);
    }

    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);
        $milestones = $project->milestones()->with(['pic', 'checklists'])->get();
        return response()->json(['data' => $milestones]);
    }

    public function store(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pic_user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'in:Not Started,In Progress,Review,Completed,Delayed'
        ]);

        $milestone = $project->milestones()->create($validated);
        return response()->json(['message' => 'Milestone created successfully', 'data' => $milestone], 201);
    }

    public function update(Request $request, $id)
    {
        $milestone = ProjectMilestone::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'pic_user_id' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'in:Not Started,In Progress,Review,Completed,Delayed'
        ]);

        $milestone->update($validated);
        return response()->json(['message' => 'Milestone updated successfully', 'data' => $milestone]);
    }

    public function updateProgress(Request $request, $id)
    {
        $milestone = ProjectMilestone::findOrFail($id);
        
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
        ]);

        $milestone->update(['progress' => $validated['progress']]);
        
        // Update project total progress
        $project = $milestone->project;
        $totalMilestones = $project->milestones()->count();
        if ($totalMilestones > 0) {
            $avgProgress = $project->milestones()->avg('progress');
            $project->update(['progress' => (int) $avgProgress]);
        }

        return response()->json(['message' => 'Progress updated successfully', 'data' => $milestone]);
    }

    public function destroy($id)
    {
        $milestone = ProjectMilestone::findOrFail($id);
        $milestone->delete();
        return response()->json(['message' => 'Milestone deleted successfully']);
    }
}
