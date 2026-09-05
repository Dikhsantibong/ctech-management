<?php

namespace Tests\Feature;

use App\Models\Prospect;
use App\Models\User;
use App\Services\MenuAccess;
use App\Services\ProspectImportService;
use App\Support\MenuRegistry;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CrmImportTest extends TestCase
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

    private function csvUpload(string $contents): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'crm').'.csv';
        file_put_contents($path, $contents);

        return new UploadedFile($path, 'prospek.csv', 'text/csv', null, true);
    }

    public function test_template_can_be_downloaded(): void
    {
        $user = $this->actor();

        $response = $this->actingAs($user)->get('/crm/prospek/import/template');

        $response->assertStatus(200);
        $this->assertStringContainsString('spreadsheet', strtolower($response->headers->get('content-type') ?? ''));
    }

    public function test_preview_classifies_valid_error_and_duplicate_rows(): void
    {
        $this->actor();
        $dupName = 'PT Duplikat Uji '.uniqid();
        Prospect::factory()->create(['company_name' => $dupName, 'city' => 'Jakarta']);

        $header = 'nama_perusahaan,kota,sales_pic,email_pic';
        $rows = [
            $header,
            'PT Valid Unik '.uniqid().',Bandung,,',   // valid
            ',Surabaya,,',                              // error: nama_perusahaan kosong
            'PT Sales Salah,Medan,Orang Tidak Ada,',   // error: sales_pic tidak dikenal
            $dupName.',Jakarta,,',                      // duplikat
        ];

        $preview = app(ProspectImportService::class)->preview($this->csvUpload(implode("\n", $rows)));

        $this->assertSame(1, $preview['summary']['valid']);
        $this->assertSame(1, $preview['summary']['duplicates']);
        $this->assertSame(2, $preview['summary']['errors']);
        $this->assertSame('prospect', $preview['duplicates'][0]['match_type']);
    }

    public function test_apply_rows_creates_prospects(): void
    {
        $user = $this->actor();
        $name = 'PT Import Terapkan '.uniqid();

        $imported = app(ProspectImportService::class)->applyRows([
            ['action' => 'create', 'payload' => ['company_name' => $name, 'stage' => 'Prospek Baru', 'status' => 'Aktif', 'priority' => 'Sedang']],
            ['action' => 'skip', 'payload' => ['company_name' => 'PT Dilewati']],
        ], $user->id);

        $this->assertSame(1, $imported);
        $this->assertDatabaseHas('crm_prospects', ['company_name' => $name]);
        $this->assertDatabaseMissing('crm_prospects', ['company_name' => 'PT Dilewati']);
    }
}
