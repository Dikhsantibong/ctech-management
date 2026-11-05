<?php

namespace Tests\Feature;

use App\Models\CompanySetting;
use App\Models\DocumentSignature;
use App\Models\Invoice;
use App\Models\Letter;
use App\Models\Quotation;
use App\Models\User;
use App\Services\MenuAccess;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class DocumentSignatureTest extends TestCase
{
    use DatabaseTransactions;

    private const PASSWORD = 'rahasia-uji-ttd';

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.url' => 'https://ctechcreative.com']);
        Storage::fake('local');
        $this->withoutVite();
    }

    private function director(): User
    {
        try {
            $user = User::first() ?? User::factory()->create();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        $user->forceFill(['role' => 'direktur_utama', 'password' => Hash::make(self::PASSWORD)])->save();
        app(MenuAccess::class)->forget();

        return $user;
    }

    private function staff(): User
    {
        return User::factory()->create(['role' => 'marketing']);
    }

    private function withSignatureImage(): CompanySetting
    {
        $settings = CompanySetting::firstOrCreate([], ['company_name' => 'PT Uji']);
        $settings->forceFill([
            'leader_name' => 'Direktur Uji',
            'signature_image' => UploadedFile::fake()->image('ttd.png', 300, 120)->store('signature-assets', 'local'),
        ])->save();

        return $settings;
    }

    private function letter(User $creator): Letter
    {
        return Letter::create([
            'reference_number' => '9'.random_int(100, 999).'/SK/CTECH/XI/2026',
            'type' => 'Surat Keputusan',
            'letter_date' => now()->toDateString(),
            'sifat' => 'Biasa',
            'recipient' => 'Seluruh Karyawan',
            'subject' => 'Uji tanda tangan',
            'content' => '<p>Isi surat uji.</p>',
            'status' => 'Draft',
            'created_by' => $creator->id,
        ]);
    }

    public function test_director_signs_letter_and_signed_pdf_is_frozen(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $letter = $this->letter($director);

        $this->actingAs($director)
            ->put("/signatures/letter/{$letter->id}/sign", ['password' => self::PASSWORD])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $signature = $letter->activeSignature()->firstOrFail();
        $stored = Storage::disk('local')->get($signature->pdf_path);

        $this->assertSame('Final', $letter->fresh()->status);
        $this->assertSame('Direktur Uji', $signature->signer_name);
        $this->assertSame(hash('sha256', $stored), $signature->pdf_hash);
        $this->assertSame($stored, $this->actingAs($director)->get("/letters/{$letter->id}/pdf")->getContent());
    }

    public function test_wrong_password_does_not_sign(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $letter = $this->letter($director);

        $this->actingAs($director)
            ->put("/signatures/letter/{$letter->id}/sign", ['password' => 'salah'])
            ->assertSessionHasErrors('password');

        $this->assertFalse($letter->isSigned());
    }

    public function test_signing_requires_uploaded_signature_image(): void
    {
        $director = $this->director();
        CompanySetting::query()->update(['signature_image' => null]);
        $letter = $this->letter($director);

        $this->actingAs($director)
            ->put("/signatures/letter/{$letter->id}/sign", ['password' => self::PASSWORD])
            ->assertSessionHasErrors('document');

        $this->assertFalse($letter->isSigned());
    }

    public function test_only_director_can_sign_revoke_and_print_for_wet_signature(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $letter = $this->letter($director);
        $staff = $this->staff();

        $this->actingAs($staff)->put("/signatures/letter/{$letter->id}/sign", ['password' => 'password'])->assertForbidden();
        $this->actingAs($staff)->put("/signatures/letter/{$letter->id}/revoke")->assertForbidden();
        $this->actingAs($staff)->get("/signatures/letter/{$letter->id}/print-wet")->assertForbidden();

        $this->actingAs($director)->get("/signatures/letter/{$letter->id}/print-wet")
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_signed_letter_is_locked_until_revoked(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $letter = $this->letter($director);
        $this->actingAs($director)->put("/signatures/letter/{$letter->id}/sign", ['password' => self::PASSWORD]);

        $this->actingAs($director)->delete("/letters/{$letter->id}")->assertStatus(423);
        $this->actingAs($director)->get("/letters/{$letter->id}/edit")->assertStatus(423);

        $this->actingAs($director)->put("/signatures/letter/{$letter->id}/revoke")->assertRedirect();

        $this->assertSame('Draft', $letter->fresh()->status);
        $this->assertFalse($letter->isSigned());
        $this->assertNotNull(DocumentSignature::where('signable_id', $letter->id)->where('document_type', 'letter')->first()->revoked_at);
    }

    public function test_public_verification_page_and_pdf_matching(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $letter = $this->letter($director);
        $this->actingAs($director)->put("/signatures/letter/{$letter->id}/sign", ['password' => self::PASSWORD]);
        $signature = $letter->activeSignature()->firstOrFail();
        auth()->logout();

        $this->get("/verifikasi-dokumen/{$signature->token}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('public/document-verification')
                ->where('document.number', $letter->reference_number)
                ->where('document.signer_name', 'Direktur Uji')
                ->where('document.revoked_at', null)
                ->missing('document.content'));

        $original = UploadedFile::fake()->createWithContent('surat.pdf', Storage::disk('local')->get($signature->pdf_path));
        $this->post("/verifikasi-dokumen/{$signature->token}", ['file' => $original])
            ->assertInertia(fn ($page) => $page->where('match', true));

        $tampered = UploadedFile::fake()->createWithContent('surat.pdf', Storage::disk('local')->get($signature->pdf_path).'%');
        $this->post("/verifikasi-dokumen/{$signature->token}", ['file' => $tampered])
            ->assertInertia(fn ($page) => $page->where('match', false));

        $this->get('/verifikasi-dokumen/'.Str::random(40))
            ->assertInertia(fn ($page) => $page->where('document', null));
    }

    public function test_quotation_can_be_signed(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $quotation = Quotation::create([
            'quotation_number' => 'Q-UJI-'.random_int(1000, 9999),
            'client_name' => 'Klien Uji',
            'quotation_date' => now()->toDateString(),
            'subject' => 'Penawaran uji',
            'total' => 1500000,
            'created_by' => $director->id,
        ]);
        $quotation->items()->create(['description' => 'Jasa', 'quantity' => 1, 'price' => 1500000, 'total' => 1500000, 'sort_order' => 0]);

        $this->actingAs($director)
            ->put("/signatures/quotation/{$quotation->id}/sign", ['password' => self::PASSWORD])
            ->assertSessionHasNoErrors();

        $this->assertTrue($quotation->isSigned());
        $this->assertNotNull($quotation->fresh()->verified_at);
        $this->actingAs($director)->put("/quotations/{$quotation->id}", [])->assertStatus(423);
    }

    public function test_kwitansi_can_only_be_signed_when_invoice_is_paid(): void
    {
        $director = $this->director();
        $this->withSignatureImage();
        $invoice = Invoice::create([
            'invoice_number' => 'INV/CTECH/UJI/'.random_int(1000, 9999),
            'client_name' => 'Klien Uji',
            'due_date' => now()->addWeek()->toDateString(),
            'total' => 2000000,
            'status' => 'Sent',
        ]);

        $this->actingAs($director)
            ->put("/signatures/kwitansi/{$invoice->id}/sign", ['password' => self::PASSWORD])
            ->assertSessionHasErrors('document');

        $invoice->update(['status' => 'Paid']);

        $this->actingAs($director)
            ->put("/signatures/kwitansi/{$invoice->id}/sign", ['password' => self::PASSWORD])
            ->assertSessionHasNoErrors();

        $signature = $invoice->activeSignature()->firstOrFail();
        $this->assertSame(
            Storage::disk('local')->get($signature->pdf_path),
            $this->actingAs($director)->get("/invoices/{$invoice->id}/kwitansi")->getContent()
        );
    }

    public function test_director_manages_private_signature_assets(): void
    {
        $director = $this->director();

        $this->actingAs($director)
            ->post('/settings/signature-assets', ['asset' => 'stamp', 'file' => UploadedFile::fake()->image('cap.png', 200, 200)])
            ->assertSessionHasNoErrors();

        $path = CompanySetting::first()->stamp_image;
        Storage::disk('local')->assertExists($path);
        $this->actingAs($director)->get('/settings/signature-assets/stamp')->assertOk();
        $this->actingAs($this->staff())->get('/settings/signature-assets/stamp')->assertForbidden();

        $this->actingAs($director)->delete('/settings/signature-assets/stamp')->assertRedirect();
        Storage::disk('local')->assertMissing($path);
    }
}
