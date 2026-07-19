<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ProjectActivityController extends Controller
{
    public function index(Project $project)
    {
        // Fetch logs for the project itself
        $logs = ActivityLog::with('user')
            ->where(function ($query) use ($project) {
                $query->where('model_type', 'Project')
                      ->where('model_id', $project->id);
            })
            ->latest()
            ->take(50)
            ->get();

        return response()->json($logs);
    }
}
