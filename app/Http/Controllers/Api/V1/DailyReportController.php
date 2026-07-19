<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DailyReportController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = DailyReport::with(['user', 'tasks.project'])->latest();

        // If regular developer, they can only see their own reports.
        // PM or CEO can see everyone's reports.
        if (in_array($user->role, ['staff'])) {
            $query->where('user_id', $user->id);
        } else if ($request->query('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->query('date')) {
            $query->whereDate('report_date', $request->query('date'));
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'blockers' => 'nullable|string',
            'notes' => 'nullable|string',
            'tasks' => 'required|array',
            'tasks.*.project_id' => 'nullable|exists:projects,id',
            'tasks.*.task_description' => 'required|string',
            'tasks.*.hours_spent' => 'nullable|numeric',
            'tasks.*.status' => 'required|in:In Progress,Completed,Blocked'
        ]);

        $reportDate = Carbon::parse($request->report_date)->format('Y-m-d');
        $userId = auth()->id();

        // Check if report already exists for this date
        $report = DailyReport::where('user_id', $userId)->where('report_date', $reportDate)->first();

        if ($report) {
            $report->update($request->only('blockers', 'notes'));
            // Delete old tasks to replace with new ones
            $report->tasks()->delete();
        } else {
            $report = DailyReport::create([
                'user_id' => $userId,
                'report_date' => $reportDate,
                'blockers' => $request->blockers,
                'notes' => $request->notes,
            ]);
        }

        foreach ($request->tasks as $task) {
            $report->tasks()->create($task);
        }

        return response()->json($report->load('tasks.project'), 201);
    }
}
