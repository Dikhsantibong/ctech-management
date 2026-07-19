<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ClientFeedback;
use Illuminate\Http\Request;

class ClientFeedbackController extends Controller
{
    public function index(Project $project)
    {
        $feedbacks = $project->feedbacks()->with('client')->latest()->get();
        return response()->json($feedbacks);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|in:New,Reviewed,Resolved'
        ]);

        // If client is submitting, we would get their ID. For now, PM submits on their behalf if needed.
        $feedback = $project->feedbacks()->create([
            'client_id' => $project->client_id, // assuming project has client_id
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => $request->status,
        ]);

        return response()->json($feedback->load('client'), 201);
    }

    public function update(Request $request, ClientFeedback $feedback)
    {
        $request->validate([
            'status' => 'required|in:New,Reviewed,Resolved'
        ]);

        $feedback->update(['status' => $request->status]);

        return response()->json($feedback);
    }
}
