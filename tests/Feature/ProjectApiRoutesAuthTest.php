<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

/**
 * Endpoint /api/v1/* harus berjalan di grup middleware "web" (session auth).
 * Ketika masih terdaftar di routes/api.php, grup "api" yang stateless membuat
 * setiap request dari frontend dibalas 401 Unauthorized.
 */
class ProjectApiRoutesAuthTest extends TestCase
{
    use DatabaseTransactions;

    /** Test ini berjalan terhadap database yang sudah terisi (mis. DB dev). */
    private function actor(): User
    {
        try {
            $user = User::where('role', 'direktur_utama')->first() ?? User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia/termigrasi: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        return $user;
    }

    private function project(): Project
    {
        try {
            $project = Project::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia/termigrasi: ' . $e->getMessage());
        }

        if (! $project) {
            $this->markTestSkipped('Tidak ada data project untuk diuji.');
        }

        return $project;
    }

    public function test_milestone_endpoints_are_reachable_when_logged_in(): void
    {
        $user = $this->actor();
        $project = $this->project();

        $create = $this->actingAs($user)->postJson("/api/v1/projects/{$project->id}/milestones", [
            'name' => 'Milestone uji rute',
            'status' => 'Not Started',
        ]);
        $create->assertStatus(201);

        $milestoneId = $create->json('data.id');

        $this->actingAs($user)
            ->putJson("/api/v1/milestones/{$milestoneId}", ['status' => 'In Progress'])
            ->assertStatus(200);

        $this->actingAs($user)
            ->putJson("/api/v1/milestones/{$milestoneId}/progress", ['progress' => 75])
            ->assertStatus(200);

        // Inilah request yang sebelumnya dibalas 401
        $this->actingAs($user)
            ->deleteJson("/api/v1/milestones/{$milestoneId}")
            ->assertStatus(200);
    }

    public function test_document_meeting_and_activity_endpoints_are_reachable(): void
    {
        $user = $this->actor();
        $project = $this->project();

        $this->actingAs($user)->getJson("/api/v1/projects/{$project->id}/documents")->assertStatus(200);
        $this->actingAs($user)->getJson("/api/v1/projects/{$project->id}/meetings")->assertStatus(200);
        $this->actingAs($user)->getJson("/api/v1/projects/{$project->id}/activities")->assertStatus(200);
    }

    public function test_guest_is_rejected(): void
    {
        $project = $this->project();

        $this->getJson("/api/v1/projects/{$project->id}/meetings")->assertStatus(401);
    }
}
