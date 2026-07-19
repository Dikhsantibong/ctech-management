<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectMilestoneTest extends TestCase
{
    use RefreshDatabase;

    public function test_pm_can_create_milestone()
    {
        $pm = User::factory()->create(['role' => 'admin_operasional']);
        $project = Project::factory()->create();

        $response = $this->actingAs($pm)->postJson("/api/v1/projects/{$project->id}/milestones", [
            'name' => 'Design Phase',
            'status' => 'Not Started',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('project_milestones', [
            'name' => 'Design Phase',
            'project_id' => $project->id,
        ]);
    }

    public function test_developer_can_update_progress()
    {
        $developer = User::factory()->create(['role' => 'staff']);
        $project = Project::factory()->create();
        $milestone = $project->milestones()->create([
            'name' => 'Dev Phase',
            'pic_user_id' => $developer->id,
            'progress' => 0
        ]);

        $response = $this->actingAs($developer)->putJson("/api/v1/milestones/{$milestone->id}/progress", [
            'progress' => 50,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(50, $milestone->fresh()->progress);
        
        // Assert project progress is updated
        $this->assertEquals(50, $project->fresh()->progress);
    }
}
