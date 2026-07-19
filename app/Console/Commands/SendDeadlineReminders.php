<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project;
use App\Models\Task;
use App\Models\NotificationReminderLog;
use Illuminate\Support\Carbon;

class SendDeadlineReminders extends Command
{
    protected $signature = 'reminders:send-deadlines';
    protected $description = 'Send deadline reminders (H-7, H-3, H-1) for Projects and Tasks';

    public function handle()
    {
        $this->info('Starting deadline reminder checks...');
        $today = Carbon::today();

        // 1. Project Deadlines
        $activeProjects = Project::whereNotNull('deadline')
            ->whereNotIn('status', ['Completed'])
            ->get();

        foreach ($activeProjects as $project) {
            $deadline = Carbon::parse($project->deadline)->startOfDay();
            $diffInDays = $today->diffInDays($deadline, false); // negative if overdue

            if ($diffInDays == 7) {
                $this->processReminder($project, 'H-7');
            } elseif ($diffInDays == 3) {
                $this->processReminder($project, 'H-3');
            } elseif ($diffInDays == 1) {
                $this->processReminder($project, 'H-1');
            } elseif ($diffInDays < 0) {
                $this->processReminder($project, 'Overdue');
            }
        }

        // 2. Task Deadlines
        $activeTasks = Task::whereNotNull('deadline')
            ->whereNotIn('status', ['Done'])
            ->get();

        foreach ($activeTasks as $task) {
            $deadline = Carbon::parse($task->deadline)->startOfDay();
            $diffInDays = $today->diffInDays($deadline, false);

            if ($diffInDays == 7) {
                $this->processReminder($task, 'H-7');
            } elseif ($diffInDays == 3) {
                $this->processReminder($task, 'H-3');
            } elseif ($diffInDays == 1) {
                $this->processReminder($task, 'H-1');
            } elseif ($diffInDays < 0) {
                $this->processReminder($task, 'Overdue');
            }
        }

        $this->info('Deadline reminder checks completed.');
    }

    private function processReminder($model, $type)
    {
        $logExists = NotificationReminderLog::where('remindable_id', $model->id)
            ->where('remindable_type', get_class($model))
            ->where('reminder_type', $type)
            ->exists();

        if (!$logExists) {
            // Ideally trigger notification event (email/push) here
            // e.g. event(new DeadlineApproaching($model, $type));

            NotificationReminderLog::create([
                'remindable_id' => $model->id,
                'remindable_type' => get_class($model),
                'reminder_type' => $type,
                'sent_date' => now()->toDateString()
            ]);

            $name = $model instanceof Project ? $model->project_name : $model->title;
            $this->info("Sent {$type} reminder for " . class_basename($model) . " ID: {$model->id} - {$name}");
        }
    }
}
