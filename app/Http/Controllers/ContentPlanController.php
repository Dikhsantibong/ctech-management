<?php

namespace App\Http\Controllers;

use App\Models\ContentPlan;
use App\Models\User;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContentPlanController extends Controller
{
    use LogsActivity;

    /**
     * Role yang boleh melihat seluruh content plan dan menugaskannya ke orang lain.
     *
     * Sebelumnya berisi 'staff', 'admin_operasional', dan 'direktur_operasional'
     * yang sudah tidak dipakai lagi, sehingga pengecekannya tidak pernah cocok:
     * penugasan selalu dipaksa ke diri sendiri dan pembatasan data tidak pernah jalan.
     */
    private const MANAGER_ROLES = ['direktur_utama', 'marketing'];

    private function isManager(?User $user): bool
    {
        return $user && in_array($user->role, self::MANAGER_ROLES, true);
    }

    /** Content plan yang boleh dilihat user ini. */
    private function visibleTo(User $user)
    {
        $query = ContentPlan::with(['creator', 'assignedTo']);

        if (! $this->isManager($user)) {
            $query->where(fn ($q) => $q->where('assigned_to', $user->id)->orWhereNull('assigned_to'));
        }

        return $query;
    }

    private function rules(): array
    {
        return [
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
            'visual' => 'nullable|string',
            'reference_links' => 'nullable|string',
            'visual_assets_url' => 'nullable|string|max:255',
            'target_audience' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:255',
            'tujuan_konten' => 'nullable|in:ctechagency,officialperusahaan,ctechpaylo,ctechbooth',
            'assigned_to' => 'nullable|exists:users,id',
        ];
    }

    public function index()
    {
        $user = Auth::user();

        return Inertia::render('content-plans/index', [
            'contentPlans' => $this->visibleTo($user)->latest()->get(),
            // Semua pengguna bisa ditugaskan — daftar lama menyaring direktur sehingga
            // konten tidak pernah bisa ditugaskan kepada mereka.
            'staffUsers' => User::orderBy('name')->get(['id', 'name', 'role']),
            'userRole' => $user->role,
            'canAssign' => $this->isManager($user),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $user = Auth::user();

        // Yang tidak berwenang menugaskan otomatis memegang kontennya sendiri
        if (! $this->isManager($user)) {
            $validated['assigned_to'] = $user->id;
        }

        $validated = $this->syncPublishedDate($validated);
        $validated['created_by'] = $user->id;

        $contentPlan = ContentPlan::create($validated);

        $this->logActivity('created', 'ContentPlan', $contentPlan->id, "Membuat content plan baru: {$contentPlan->title}");

        return redirect()->back()->with('success', 'Content plan created successfully.');
    }

    public function update(Request $request, ContentPlan $contentPlan)
    {
        $user = Auth::user();

        abort_unless($this->canEdit($user, $contentPlan), 403, 'Anda hanya bisa mengubah konten yang ditugaskan kepada Anda.');

        $validated = $request->validate($this->rules());

        // Hanya yang berwenang boleh memindahkan penugasan
        if (! $this->isManager($user)) {
            $validated['assigned_to'] = $contentPlan->assigned_to ?? $user->id;
        }

        $validated = $this->syncPublishedDate($validated, $contentPlan);

        $contentPlan->update($validated);

        $this->logActivity('updated', 'ContentPlan', $contentPlan->id, "Mengupdate content plan: {$contentPlan->title}");

        return redirect()->back()->with('success', 'Content plan updated successfully.');
    }

    /**
     * Ubah status saja — dipakai drag & drop di papan kanban.
     * Sebelumnya papan mengirim ulang seluruh isi form, sehingga satu kolom yang
     * tidak ikut terkirim bisa terhapus tanpa disadari.
     */
    public function updateStatus(Request $request, ContentPlan $contentPlan)
    {
        $user = Auth::user();

        abort_unless($this->canEdit($user, $contentPlan), 403, 'Anda tidak berhak mengubah konten ini.');

        $validated = $request->validate([
            'status' => 'required|in:Draft,Scheduled,Published,Cancelled',
        ]);

        $data = ['status' => $validated['status']];

        // Tanggal tayang terisi otomatis saat dipindah ke Published, dan dikosongkan
        // lagi bila ditarik keluar — supaya laporan tidak menghitung konten yang batal tayang.
        if ($validated['status'] === 'Published') {
            $data['published_date'] = $contentPlan->published_date ?? now()->toDateString();
        } elseif ($contentPlan->status === 'Published') {
            $data['published_date'] = null;
        }

        $contentPlan->update($data);

        $this->logActivity('updated', 'ContentPlan', $contentPlan->id, "Mengubah status content plan {$contentPlan->title} menjadi {$validated['status']}");

        return redirect()->back();
    }

    public function destroy(ContentPlan $contentPlan)
    {
        $user = Auth::user();

        abort_unless($this->canEdit($user, $contentPlan), 403, 'Anda tidak berhak menghapus konten ini.');

        $this->logActivity('deleted', 'ContentPlan', $contentPlan->id, "Menghapus content plan: {$contentPlan->title}");
        $contentPlan->delete();

        return redirect()->back()->with('success', 'Content plan deleted successfully.');
    }

    public function report()
    {
        $user = Auth::user();
        $contentPlans = $this->visibleTo($user)->get();

        $published = $contentPlans->where('status', 'Published')->count();

        $metrics = [
            'totalContent' => $contentPlans->count(),
            'publishedContent' => $published,
            // Status yang valid hanya Draft/Scheduled/Published/Cancelled — daftar lama
            // memuat 'Idea', 'Drafting', dan 'Review' yang tidak pernah ada isinya.
            'activeContent' => $contentPlans->whereIn('status', ['Draft', 'Scheduled'])->count(),
            'overdueContent' => $contentPlans
                ->whereNotNull('scheduled_date')
                ->whereNotIn('status', ['Published', 'Cancelled']) // konten dibatalkan bukan keterlambatan
                ->filter(fn ($plan) => $plan->scheduled_date < now()->format('Y-m-d'))
                ->count(),
        ];

        $metrics['completionRate'] = $metrics['totalContent'] > 0
            ? round(($published / $metrics['totalContent']) * 100)
            : 0;

        return Inertia::render('content-plans/report', [
            'contentPlans' => $contentPlans,
            'metrics' => $metrics,
        ]);
    }

    private function canEdit(?User $user, ContentPlan $contentPlan): bool
    {
        if ($this->isManager($user)) {
            return true;
        }

        return $contentPlan->assigned_to === null || $contentPlan->assigned_to === $user?->id;
    }

    /** Isi tanggal tayang otomatis ketika status Published tapi tanggalnya dibiarkan kosong. */
    private function syncPublishedDate(array $data, ?ContentPlan $existing = null): array
    {
        if ($data['status'] === 'Published' && empty($data['published_date'])) {
            $data['published_date'] = $existing?->published_date ?? now()->toDateString();
        }

        return $data;
    }
}
