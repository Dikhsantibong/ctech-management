<?php

namespace Tests\Feature;

use App\Models\CompanySetting;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CompanySettingBankAccountTest extends TestCase
{
    use DatabaseTransactions;

    private function director(): User
    {
        try {
            $user = User::first() ?? User::factory()->create();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Database belum tersedia: '.$e->getMessage());
        }

        if (! $user) {
            $this->markTestSkipped('Tidak ada data user untuk diuji.');
        }

        $user->forceFill(['role' => 'direktur_utama'])->save();

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    private function settingsPayload(array $accounts): array
    {
        return [
            'company_name' => 'PT Uji Rekening',
            'bank_accounts' => $accounts,
        ];
    }

    private function makeInvoice(): Invoice
    {
        return Invoice::create([
            'invoice_number' => 'CTECH/TEST/'.uniqid(),
            'client_name' => 'Klien Uji',
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addWeek()->toDateString(),
            'subtotal' => 100000,
            'tax' => 0,
            'total' => 100000,
            'status' => 'Draft',
        ]);
    }

    private function renderPdfView(string $view, Invoice $invoice): string
    {
        return view($view, [
            'invoice' => $invoice->load('items'),
            'settings' => CompanySetting::first(),
            'logo' => null,
            'kwitansi_number' => 'KWT/TEST',
        ])->render();
    }

    /** Inti permintaan: rekening yang dipilih sebagai utama yang tercetak di invoice. */
    public function test_selected_primary_account_is_printed_on_invoice_and_kwitansi(): void
    {
        $this->actingAs($this->director())->post('/settings', $this->settingsPayload([
            ['bank_name' => 'BANK SULTRA', 'account_number' => '1111111111', 'account_name' => 'PT Uji', 'is_active' => false],
            ['bank_name' => 'BANK MANDIRI', 'account_number' => '2222222222', 'account_name' => 'PT Uji', 'is_active' => true],
        ]))->assertRedirect();

        $invoice = $this->makeInvoice();

        foreach (['pdf.invoice', 'pdf.kwitansi'] as $view) {
            $html = $this->renderPdfView($view, $invoice);

            $this->assertStringContainsString('BANK MANDIRI', $html, "{$view} tidak mencetak rekening utama");
            $this->assertStringContainsString('2222222222', $html);
            $this->assertStringNotContainsString('1111111111', $html, "{$view} masih mencetak rekening lama");
        }
    }

    /** Mengganti rekening utama harus langsung mengubah dokumen yang diunduh berikutnya. */
    public function test_switching_primary_account_changes_the_next_download(): void
    {
        $director = $this->director();
        $accounts = [
            ['bank_name' => 'BANK SULTRA', 'account_number' => '1111111111', 'account_name' => 'PT Uji', 'is_active' => true],
            ['bank_name' => 'BANK MANDIRI', 'account_number' => '2222222222', 'account_name' => 'PT Uji', 'is_active' => false],
        ];

        $this->actingAs($director)->post('/settings', $this->settingsPayload($accounts));
        $invoice = $this->makeInvoice();
        $this->assertStringContainsString('1111111111', $this->renderPdfView('pdf.invoice', $invoice));

        $accounts[0]['is_active'] = false;
        $accounts[1]['is_active'] = true;
        $this->actingAs($director)->post('/settings', $this->settingsPayload($accounts));

        $this->assertStringContainsString('2222222222', $this->renderPdfView('pdf.invoice', $invoice));
    }

    /** Kolom tunggal lama ikut diselaraskan agar tidak ada pembaca yang tertinggal. */
    public function test_legacy_columns_follow_the_primary_account(): void
    {
        $this->actingAs($this->director())->post('/settings', $this->settingsPayload([
            ['bank_name' => 'BANK SULTRA', 'account_number' => '1111111111', 'account_name' => 'PT A', 'is_active' => false],
            ['bank_name' => 'BANK BCA', 'account_number' => '3333333333', 'account_name' => 'PT B', 'is_active' => true],
        ]))->assertRedirect();

        $settings = CompanySetting::first();

        $this->assertSame('BANK BCA', $settings->bank_name);
        $this->assertSame('3333333333', $settings->bank_account_number);
        $this->assertSame('PT B', $settings->bank_account_name);
    }

    /** Baris kosong dibuang dan selalu tepat satu rekening yang aktif. */
    public function test_accounts_are_normalized_to_exactly_one_primary(): void
    {
        $this->actingAs($this->director())->post('/settings', $this->settingsPayload([
            ['bank_name' => '', 'account_number' => '', 'account_name' => '', 'is_active' => true],
            ['bank_name' => 'BANK BRI', 'account_number' => '4444444444', 'account_name' => 'PT C', 'is_active' => false],
            ['bank_name' => 'BANK BNI', 'account_number' => '5555555555', 'account_name' => 'PT D', 'is_active' => false],
        ]))->assertRedirect();

        $accounts = CompanySetting::first()->bank_accounts;

        $this->assertCount(2, $accounts, 'Baris kosong seharusnya dibuang');
        $this->assertCount(1, array_filter($accounts, fn ($a) => $a['is_active']));
        // Tidak ada yang dipilih setelah baris kosong dibuang -> rekening pertama jadi utama
        $this->assertSame('BANK BRI', CompanySetting::first()->activeBankAccount()['bank_name']);
    }

    /** Data sebelum fitur multi rekening (hanya kolom tunggal) tetap tercetak. */
    public function test_falls_back_to_legacy_columns_when_no_accounts_stored(): void
    {
        $setting = new CompanySetting([
            'bank_name' => 'BANK LAMA',
            'bank_account_number' => '9999999999',
            'bank_account_name' => 'PT Lama',
            'bank_accounts' => null,
        ]);

        $this->assertSame([
            'bank_name' => 'BANK LAMA',
            'account_number' => '9999999999',
            'account_name' => 'PT Lama',
        ], $setting->activeBankAccount());
    }
}
