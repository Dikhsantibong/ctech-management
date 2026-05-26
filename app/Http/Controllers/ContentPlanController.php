<?php

namespace App\Http\Controllers;

use App\Models\ContentPlan;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContentPlanController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $contentPlans = ContentPlan::with('creator')->latest()->get();
        return Inertia::render('content-plans/index', [
            'contentPlans' => $contentPlans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'platform' => 'required|string|max:255',
            'content_type' => 'required|string|max:255',
            'status' => 'required|in:Draft,Scheduled,Published,Cancelled',
            'scheduled_date' => 'nullable|date',
            'published_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'campaign_name' => 'nullable|string|max:255',
            'brief' => 'nullable|string',
            'reference_links' => 'nullable|string',
            'visual_assets_url' => 'nullable|string|max:255',
            'target_audience' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:255',
        ]);

        $contentPlan = ContentPlan::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        $this->logActivity('created', 'ContentPlan', $contentPlan->id, "Membuat content plan baru: {$contentPlan->title}");

        return redirect()->back()->with('success', 'Content plan created successfully.');
    }

    public function update(Request $request, ContentPlan $contentPlan)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'platform' => 'required|string|max:255',
            'content_type' => 'required|string|max:255',
            'status' => 'required|in:Draft,Scheduled,Published,Cancelled',
            'scheduled_date' => 'nullable|date',
            'published_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'campaign_name' => 'nullable|string|max:255',
            'brief' => 'nullable|string',
            'reference_links' => 'nullable|string',
            'visual_assets_url' => 'nullable|string|max:255',
            'target_audience' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:255',
        ]);

        $contentPlan->update($validated);

        $this->logActivity('updated', 'ContentPlan', $contentPlan->id, "Mengupdate content plan: {$contentPlan->title}");

        return redirect()->back()->with('success', 'Content plan updated successfully.');
    }

    public function destroy(ContentPlan $contentPlan)
    {
        $this->logActivity('deleted', 'ContentPlan', $contentPlan->id, "Menghapus content plan: {$contentPlan->title}");
        $contentPlan->delete();
        return redirect()->back()->with('success', 'Content plan deleted.');
    }
}
