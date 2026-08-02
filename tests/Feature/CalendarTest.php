<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CalendarTest extends TestCase
{
    use DatabaseTransactions;

    private function actor(): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: ' . $e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => MenuRegistry::SUPER_ROLE])->save();

        return $user;
    }

    private function events(): array
    {
        return $this->actingAs($this->actor())
            ->get('/calendar')
            ->assertStatus(200)
            ->viewData('page')['props']['events'];
    }

    /** Judul event project sempat kosong karena membaca kolom "name" yang tidak ada. */
    public function test_project_events_have_a_title(): void
    {
        $project = Project::whereNotNull('deadline')->first();

        if (! $project) {
            $this->markTestSkipped('Tidak ada project bertenggat untuk diuji.');
        }

        $events = collect($this->events())->where('type', 'project');

        $this->assertNotEmpty($events, 'Event project tidak dikirim ke kalender');

        foreach ($events as $event) {
            $this->assertNotEmpty($event['title'], 'Judul event project kosong');
        }
    }

    /** Legenda menjanjikan 5 jenis; backend harus benar-benar mampu mengirim semuanya. */
    public function test_all_event_types_are_supported(): void
    {
        $this->actor();

        $controller = new \App\Http\Controllers\CalendarController();
        $reflection = new \ReflectionClass($controller);

        foreach (['projectEvents', 'taskEvents', 'meetingEvents', 'contentEvents', 'invoiceEvents'] as $method) {
            $this->assertTrue($reflection->hasMethod($method), "Sumber event {$method} tidak ada");
        }

        // Setiap event wajib punya bentuk yang sama agar frontend tidak pecah
        foreach ($this->events() as $event) {
            $this->assertArrayHasKey('id', $event);
            $this->assertArrayHasKey('type', $event);
            $this->assertArrayHasKey('title', $event);
            $this->assertArrayHasKey('date', $event);
            $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', $event['date'], 'Format tanggal harus YYYY-MM-DD');
            $this->assertContains($event['type'], ['project', 'task', 'meeting', 'invoice', 'content_plan']);
        }
    }

    public function test_events_are_sorted_by_date(): void
    {
        $dates = collect($this->events())->pluck('date')->all();
        $sorted = $dates;
        sort($sorted);

        $this->assertSame($sorted, $dates, 'Event tidak terurut berdasarkan tanggal');
    }
}
