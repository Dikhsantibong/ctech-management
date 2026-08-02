<?php

namespace Tests\Feature;

use App\Models\KpiTarget;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Services\KpiService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class KpiTest extends TestCase
{
    use DatabaseTransactions;

    private function user(): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        return $user;
    }

    public function test_every_role_produces_metrics(): void
    {
        $this->user(); // pastikan DB siap

        $service = app(KpiService::class);

        foreach (KpiService::ROLES as $role) {
            $kpi = $service->forRole($role);

            $this->assertNotEmpty($kpi['metrics'], "Role {$role} tidak punya metrik");
            $this->assertIsInt($kpi['score']);

            foreach ($kpi['metrics'] as $metric) {
                $this->assertGreaterThanOrEqual(0, $metric['achievement']);
                $this->assertLessThanOrEqual(150, $metric['achievement']);
            }
        }
    }

    public function test_completed_task_counts_toward_operation_kpi(): void
    {
        $user = $this->user();
        $project = Project::first();

        if (! $project) {
            $this->markTestSkipped('Tidak ada data project untuk diuji.');
        }

        $service = app(KpiService::class);
        $period = CarbonImmutable::now()->format('Y-m');

        $before = collect($service->forRole('operation', $period)['metrics'])
            ->firstWhere('key', 'tasks_completed')['actual'];

        // Task selesai tepat waktu pada periode berjalan
        Task::create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'title' => 'Task uji KPI',
            'status' => 'Done',
            'priority' => 'Medium',
            'deadline' => CarbonImmutable::now()->addDay()->toDateString(),
            'completed_at' => CarbonImmutable::now(),
        ]);

        $after = collect($service->forRole('operation', $period)['metrics'])
            ->firstWhere('key', 'tasks_completed')['actual'];

        $this->assertSame($before + 1, $after, 'Task selesai tidak terhitung di KPI');
    }

    public function test_custom_target_changes_achievement(): void
    {
        $this->user();

        $service = app(KpiService::class);
        $period = CarbonImmutable::now()->format('Y-m');

        KpiTarget::updateOrCreate(
            ['role' => 'operation', 'metric_key' => 'tasks_completed', 'period' => $period],
            ['target_value' => 1000],
        );

        $metric = collect($service->forRole('operation', $period)['metrics'])->firstWhere('key', 'tasks_completed');

        $this->assertTrue($metric['is_custom_target']);
        $this->assertSame(1000.0, $metric['target']);
    }

    public function test_only_direktur_utama_can_open_monitoring(): void
    {
        $user = $this->user();

        $user->forceFill(['role' => 'operation'])->save();
        $this->actingAs($user)->get('/kpi')->assertStatus(403);

        $user->forceFill(['role' => 'direktur_utama'])->save();
        $this->actingAs($user)->get('/kpi')->assertStatus(200);
    }

    public function test_target_update_rejects_unknown_metric(): void
    {
        $user = $this->user();
        $user->forceFill(['role' => 'direktur_utama'])->save();

        $this->actingAs($user)->putJson('/kpi/target', [
            'role' => 'operation',
            'metric_key' => 'metrik_palsu',
            'period' => CarbonImmutable::now()->format('Y-m'),
            'target_value' => 10,
        ])->assertStatus(422);
    }
}
