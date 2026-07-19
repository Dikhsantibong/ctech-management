<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Meeting;
use Illuminate\Http\Request;

class ProjectMeetingController extends Controller
{
    public function index(Project $project)
    {
        $meetings = $project->meetings()->with(['organizer', 'participants.user', 'actionItems.assignee'])->orderBy('scheduled_at', 'asc')->get();
        return response()->json($meetings);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer',
            'location_or_link' => 'nullable|string',
            'description' => 'nullable|string',
            'participants' => 'nullable|array',
            'participants.*' => 'exists:users,id'
        ]);

        $meeting = $project->meetings()->create([
            'organizer_id' => auth()->id(),
            'title' => $request->title,
            'scheduled_at' => $request->scheduled_at,
            'duration_minutes' => $request->duration_minutes,
            'location_or_link' => $request->location_or_link,
            'description' => $request->description,
        ]);

        if ($request->participants) {
            foreach ($request->participants as $userId) {
                $meeting->participants()->create([
                    'user_id' => $userId,
                    'status' => 'Invited'
                ]);
            }
        }

        // Ideally trigger an Event/Job here to send Email Invitations
        // \App\Events\MeetingScheduled::dispatch($meeting);

        return response()->json($meeting->load(['organizer', 'participants.user']), 201);
    }

    public function updateMinutes(Request $request, Meeting $meeting)
    {
        $request->validate([
            'minutes_of_meeting' => 'required|string'
        ]);

        $meeting->update([
            'minutes_of_meeting' => $request->minutes_of_meeting,
            'status' => 'Completed'
        ]);

        // Ideally trigger an Event/Job here to send MoM to participants
        // \App\Events\MinutesOfMeetingPublished::dispatch($meeting);

        return response()->json($meeting);
    }

    public function storeActionItem(Request $request, Meeting $meeting)
    {
        $request->validate([
            'task_description' => 'required|string',
            'assignee_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date'
        ]);

        $actionItem = $meeting->actionItems()->create($request->only('task_description', 'assignee_id', 'due_date'));

        return response()->json($actionItem->load('assignee'), 201);
    }
}
