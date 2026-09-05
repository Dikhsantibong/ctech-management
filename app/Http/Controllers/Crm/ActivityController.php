<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\CrmActivity;
use App\Models\Prospect;
use App\Support\Crm;
use App\Support\MenuRegistry;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivityController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $user = $request->user();
        $seesAll = $user->role === MenuRegistry::SUPER_ROLE;

        $base = fn () => CrmActivity::query()
            ->with(['prospect:id,company_name,pic_name', 'user:id,name'])
            ->when(! $seesAll, fn ($q) => $q->where('user_id', $user->id));

        return Inertia::render('crm/activities/index', [
            'today' => $base()->whereDate('scheduled_at', today())->orderBy('scheduled_at')->get(),
            'upcoming' => $base()->where('status', 'Terjadwal')->whereDate('scheduled_at', '>', today())->orderBy('scheduled_at')->get(),
            'overdue' => $base()->overdue()->orderBy('scheduled_at')->get(),
            'activityTypes' => Crm::activityTypes(),
        ]);
    }

    public function store(Request $request, Prospect $prospect)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:'.implode(',', Crm::activityTypes())],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'status' => ['required', 'in:Terjadwal,Selesai'],
            'outcome' => ['nullable', 'string'],
        ]);

        $activity = $prospect->activities()->create([
            'user_id' => $prospect->sales_id ?? Auth::id(),
            'type' => $validated['type'],
            'subject' => $validated['subject'],
            'description' => $validated['description'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === 'Selesai' ? now() : null,
            'outcome' => $validated['outcome'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $this->refreshProspectSchedule($prospect);

        $this->logActivity('created', 'CrmActivity', $activity->id, "Mencatat aktivitas {$activity->type} untuk {$prospect->company_name}");

        return redirect()->back()->with('success', 'Aktivitas dicatat.');
    }

    public function complete(Request $request, CrmActivity $activity)
    {
        $validated = $request->validate([
            'outcome' => ['nullable', 'string'],
        ]);

        $activity->update([
            'status' => 'Selesai',
            'completed_at' => now(),
            'outcome' => $validated['outcome'] ?? $activity->outcome,
        ]);

        $this->refreshProspectSchedule($activity->prospect);

        $this->logActivity('updated', 'CrmActivity', $activity->id, "Menyelesaikan aktivitas {$activity->type}");

        return redirect()->back()->with('success', 'Aktivitas ditandai selesai.');
    }

    public function destroy(CrmActivity $activity)
    {
        $prospect = $activity->prospect;
        $this->logActivity('deleted', 'CrmActivity', $activity->id, "Menghapus aktivitas {$activity->type}");
        $activity->delete();

        if ($prospect) {
            $this->refreshProspectSchedule($prospect);
        }

        return redirect()->back()->with('success', 'Aktivitas dihapus.');
    }

    /**
     * Selaraskan last_activity_at & next_follow_up_at prospek dengan aktivitasnya.
     */
    private function refreshProspectSchedule(Prospect $prospect): void
    {
        $prospect->loadMissing('activities');

        $lastCompleted = $prospect->activities
            ->where('status', 'Selesai')
            ->max('completed_at');

        $nextScheduled = $prospect->activities
            ->where('status', 'Terjadwal')
            ->whereNotNull('scheduled_at')
            ->sortBy('scheduled_at')
            ->first();

        $prospect->update([
            'last_activity_at' => $lastCompleted,
            'next_follow_up_at' => $nextScheduled?->scheduled_at,
            'next_action' => $nextScheduled?->subject,
        ]);
    }
}
