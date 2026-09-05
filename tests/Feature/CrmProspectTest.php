<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\CrmActivity;
use App\Models\Prospect;
use App\Models\ProspectStageHistory;
use App\Models\User;
use App\Services\MenuAccess;
use App\Services\ProspectService;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CrmProspectTest extends TestCase
{
    use DatabaseTransactions;

    private function actor(): User
    {
        try {
            $user = User::first();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => MenuRegistry::SUPER_ROLE])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    public function test_can_create_prospect(): void
    {
        $user = $this->actor();

        $response = $this->actingAs($user)->post('/crm/prospek', [
            'company_name' => 'PT Uji Prospek',
            'pic_name' => 'Andi',
            'source' => 'Website',
            'priority' => 'Tinggi',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('crm_prospects', [
            'company_name' => 'PT Uji Prospek',
            'stage' => 'Prospek Baru',
            'status' => 'Aktif',
        ]);
    }

    public function test_moving_stage_records_history_and_closes_status(): void
    {
        $this->actor();
        $prospect = Prospect::factory()->create(['stage' => 'Penawaran', 'status' => 'Aktif']);

        app(ProspectService::class)->moveStage($prospect, 'Berhasil', 'Deal ditandatangani', null);

        $prospect->refresh();
        $this->assertSame('Berhasil', $prospect->stage);
        $this->assertSame('Berhasil', $prospect->status);
        $this->assertDatabaseHas('crm_prospect_stage_histories', [
            'prospect_id' => $prospect->id,
            'from_stage' => 'Penawaran',
            'to_stage' => 'Berhasil',
        ]);
    }

    public function test_convert_creates_new_customer_when_none_exists(): void
    {
        $this->actor();
        $unique = 'PT Konversi Baru '.uniqid();
        $prospect = Prospect::factory()->create([
            'company_name' => $unique,
            'pic_name' => 'Rina',
            'pic_email' => 'rina'.uniqid().'@example.com',
        ]);

        $client = app(ProspectService::class)->convertToClient($prospect);

        $prospect->refresh();
        $this->assertSame($client->id, $prospect->client_id);
        $this->assertSame('Dikonversi', $prospect->status);
        $this->assertNotNull($prospect->converted_at);
        $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => $unique]);
    }

    public function test_convert_links_existing_customer_without_duplicating(): void
    {
        $this->actor();
        $name = 'PT Sudah Jadi Customer '.uniqid();
        $existing = Client::create(['name' => $name, 'pic' => 'Budi']);
        $prospect = Prospect::factory()->create(['company_name' => $name]);

        $before = Client::where('name', $name)->count();
        $client = app(ProspectService::class)->convertToClient($prospect);
        $after = Client::where('name', $name)->count();

        $this->assertSame($existing->id, $client->id);
        $this->assertSame($before, $after, 'Konversi tidak boleh membuat Customer duplikat.');
    }

    public function test_activity_updates_prospect_follow_up_and_last_activity(): void
    {
        $user = $this->actor();
        $prospect = Prospect::factory()->create(['sales_id' => $user->id]);

        // Aktivitas terjadwal → mengisi next_follow_up_at
        $this->actingAs($user)->post("/crm/prospek/{$prospect->id}/aktivitas", [
            'type' => 'Follow-up',
            'subject' => 'Telepon lanjutan',
            'scheduled_at' => now()->addDay()->format('Y-m-d H:i:s'),
            'status' => 'Terjadwal',
        ])->assertRedirect();

        $prospect->refresh();
        $this->assertNotNull($prospect->next_follow_up_at);
        $this->assertSame('Telepon lanjutan', $prospect->next_action);

        // Aktivitas selesai → mengisi last_activity_at
        $activity = CrmActivity::where('prospect_id', $prospect->id)->first();
        $this->actingAs($user)->put("/crm/aktivitas/{$activity->id}/selesai", ['outcome' => 'Tertarik'])->assertRedirect();

        $prospect->refresh();
        $this->assertNotNull($prospect->last_activity_at);
    }

    public function test_stage_history_relation_uses_service(): void
    {
        $this->actor();
        $prospect = Prospect::factory()->create(['stage' => 'Prospek Baru']);

        app(ProspectService::class)->moveStage($prospect, 'Pendekatan', null, null);

        $this->assertSame(1, ProspectStageHistory::where('prospect_id', $prospect->id)->count());
    }
}
