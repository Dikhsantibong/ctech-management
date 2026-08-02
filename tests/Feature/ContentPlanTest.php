<?php

namespace Tests\Feature;

use App\Models\ContentPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ContentPlanTest extends TestCase
{
    use DatabaseTransactions;

    private function actor(string $role): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => $role])->save();

        return $user;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Konten uji',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Draft',
        ], $overrides);
    }

    /**
     * Peran pengelola sempat memakai nama role lama, sehingga pilihan penanggung
     * jawab selalu ditimpa dengan user yang sedang login.
     */
    public function test_marketing_can_assign_content_to_someone_else(): void
    {
        $marketing = $this->actor('marketing');
        $other = User::where('id', '!=', $marketing->id)->first();

        if (! $other) {
            $this->markTestSkipped('Butuh minimal dua user untuk menguji penugasan.');
        }

        $this->actingAs($marketing)
            ->post('/content-plans', $this->payload(['assigned_to' => $other->id]))
            ->assertRedirect();

        $plan = ContentPlan::latest('id')->first();

        $this->assertSame($other->id, $plan->assigned_to, 'Penugasan ditimpa ke user yang login');
    }

    /** Role tanpa wewenang menugaskan otomatis memegang kontennya sendiri. */
    public function test_non_manager_owns_the_content_it_creates(): void
    {
        $user = $this->actor('operation');
        $other = User::where('id', '!=', $user->id)->first();

        // Role ini normalnya tidak punya menu content-plans; diberikan agar yang
        // diuji murni perilaku penugasan di controller, bukan penjagaan menu.
        app(\App\Services\MenuAccess::class)->sync('operation', ['content-plans']);

        $this->actingAs($user)
            ->post('/content-plans', $this->payload(['assigned_to' => $other?->id]))
            ->assertRedirect();

        $plan = ContentPlan::latest('id')->first();

        $this->assertSame($user->id, $plan->assigned_to);
    }

    public function test_publishing_fills_the_actual_publish_date(): void
    {
        $user = $this->actor('marketing');

        $this->actingAs($user)->post('/content-plans', $this->payload(['status' => 'Published']))->assertRedirect();

        $plan = ContentPlan::latest('id')->first();

        $this->assertNotNull($plan->published_date, 'Tanggal tayang tidak terisi otomatis');
    }

    public function test_status_endpoint_updates_only_the_status(): void
    {
        $user = $this->actor('marketing');

        $plan = ContentPlan::create([
            'title' => 'Konten uji status',
            'description' => 'Caption penting',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Draft',
            'campaign_name' => 'Campaign A',
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->put("/content-plans/{$plan->id}/status", ['status' => 'Published'])
            ->assertRedirect();

        $plan->refresh();

        $this->assertSame('Published', $plan->status);
        $this->assertNotNull($plan->published_date);
        // Kolom lain harus utuh — dulu papan kanban mengirim ulang seluruh form
        $this->assertSame('Caption penting', $plan->description);
        $this->assertSame('Campaign A', $plan->campaign_name);
    }

    public function test_moving_out_of_published_clears_the_publish_date(): void
    {
        $user = $this->actor('marketing');

        $plan = ContentPlan::create([
            'title' => 'Konten batal tayang',
            'platform' => 'Instagram',
            'content_type' => 'Post',
            'status' => 'Published',
            'published_date' => now()->toDateString(),
            'created_by' => $user->id,
        ]);

        $this->actingAs($user)->put("/content-plans/{$plan->id}/status", ['status' => 'Draft'])->assertRedirect();

        $this->assertNull($plan->refresh()->published_date);
    }

    /** Metrik laporan sempat menghitung status yang tidak pernah ada. */
    public function test_report_metrics_use_real_statuses(): void
    {
        $user = $this->actor('marketing');

        $metrics = $this->actingAs($user)->get('/content-plans/report')
            ->assertStatus(200)
            ->viewData('page')['props']['metrics'];

        $plans = ContentPlan::all();
        $expectedActive = $plans->whereIn('status', ['Draft', 'Scheduled'])->count();

        $this->assertSame($expectedActive, $metrics['activeContent']);

        // Konten dibatalkan bukan keterlambatan
        $cancelledOverdue = $plans
            ->where('status', 'Cancelled')
            ->whereNotNull('scheduled_date')
            ->filter(fn ($p) => $p->scheduled_date < now()->format('Y-m-d'))
            ->count();

        $this->assertLessThanOrEqual($plans->count() - $cancelledOverdue, $metrics['overdueContent']);
    }
}
