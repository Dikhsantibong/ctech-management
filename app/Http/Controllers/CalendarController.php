<?php

namespace App\Http\Controllers;

use App\Models\ContentPlan;
use App\Models\Invoice;
use App\Models\Meeting;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $events = collect()
            ->merge($this->projectEvents())
            ->merge($this->taskEvents())
            ->merge($this->meetingEvents())
            ->merge($this->contentEvents())
            ->merge($this->invoiceEvents())
            ->sortBy('date')
            ->values();

        return Inertia::render('calendar/index', [
            'events' => $events,
        ]);
    }

    private function projectEvents()
    {
        return Project::whereNotNull('deadline')
            ->get()
            ->map(fn (Project $project) => [
                'id' => "project-{$project->id}",
                'type' => 'project',
                // Kolomnya project_name — sebelumnya memakai $project->name yang tidak ada,
                // sehingga judul event selalu tampil kosong.
                'title' => $project->project_name,
                'date' => Carbon::parse($project->deadline)->format('Y-m-d'),
                'description' => $project->description,
                'status' => $project->status,
                'context' => $project->client_name,
                'url' => "/projects/{$project->id}",
                'is_done' => $project->status === 'Completed',
            ]);
    }

    private function taskEvents()
    {
        return Task::with('project')
            ->whereNotNull('deadline')
            ->get()
            ->map(fn (Task $task) => [
                'id' => "task-{$task->id}",
                'type' => 'task',
                'title' => $task->title,
                'date' => Carbon::parse($task->deadline)->format('Y-m-d'),
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'context' => $task->project?->project_name,
                'url' => '/tasks',
                'is_done' => $task->status === 'Done',
            ]);
    }

    private function meetingEvents()
    {
        return Meeting::with('project')
            ->whereNotNull('scheduled_at')
            ->get()
            ->map(fn (Meeting $meeting) => [
                'id' => "meeting-{$meeting->id}",
                'type' => 'meeting',
                'title' => $meeting->title,
                'date' => $meeting->scheduled_at->format('Y-m-d'),
                'time' => $meeting->scheduled_at->format('H:i'),
                'description' => $meeting->description,
                'status' => $meeting->status,
                'location' => $meeting->location_or_link,
                'duration' => $meeting->duration_minutes,
                'context' => $meeting->project?->project_name,
                'url' => $meeting->project_id ? "/projects/{$meeting->project_id}" : null,
                'is_done' => $meeting->status === 'Completed',
            ]);
    }

    private function contentEvents()
    {
        return ContentPlan::whereNotNull('scheduled_date')
            ->where('status', '!=', 'Cancelled')
            ->get()
            ->map(fn (ContentPlan $content) => [
                'id' => "content-{$content->id}",
                'type' => 'content_plan',
                'title' => $content->title,
                'date' => Carbon::parse($content->scheduled_date)->format('Y-m-d'),
                'description' => $content->description,
                'status' => $content->status,
                'context' => trim(implode(' · ', array_filter([$content->platform, $content->content_type]))) ?: null,
                'url' => '/content-plans',
                'is_done' => (bool) $content->published_date,
            ]);
    }

    private function invoiceEvents()
    {
        return Invoice::whereNotNull('due_date')
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => "invoice-{$invoice->id}",
                'type' => 'invoice',
                'title' => $invoice->invoice_number,
                'date' => Carbon::parse($invoice->due_date)->format('Y-m-d'),
                'status' => $invoice->status,
                'amount' => (float) $invoice->total,
                'context' => $invoice->client_name,
                'url' => "/invoices/{$invoice->id}",
                'is_done' => $invoice->status === 'Paid',
            ]);
    }
}
