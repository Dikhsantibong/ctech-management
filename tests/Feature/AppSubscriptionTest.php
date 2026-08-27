<?php

namespace Tests\Feature;

use App\Models\AppCategory;
use App\Models\AppSubscription;
use App\Models\User;
use App\Support\MenuRegistry;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AppSubscriptionTest extends TestCase
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
        app(\App\Services\MenuAccess::class)->forget();

        return $user;
    }

    private function makeSubscription(array $overrides = []): AppSubscription
    {
        $category = AppCategory::firstOrCreate(['slug' => 'pos-app'], ['name' => 'POS App']);

        return AppSubscription::create(array_merge([
            'app_category_id' => $category->id,
            'client_name' => 'Klien Uji',
            'app_name' => 'POS Uji',
            'monthly_price' => 100000,
            'billing_cycle_months' => 1,
            'status' => AppSubscription::STATUS_ACTIVE,
            'start_date' => CarbonImmutable::now()->subMonths(6)->toDateString(),
            'deadline' => CarbonImmutable::now()->subMonths(6)->toDateString(),
            'is_active' => true,
        ], $overrides));
    }

    /** Lama berlangganan dihitung dari tanggal mulai, bukan dari data lain. */
    public function test_duration_is_measured_from_start_date(): void
    {
        $this->actor();
        $sub = $this->makeSubscription(['start_date' => CarbonImmutable::now()->subMonths(14)->toDateString()]);

        $this->assertSame(14, $sub->months_running);
        $this->assertStringContainsString('1 tahun', $sub->duration_label);
        $this->assertStringContainsString('2 bulan', $sub->duration_label);
    }

    /** Nilai terakru = bulan penuh berjalan x harga per bulan. */
    public function test_accrued_amount_follows_monthly_price(): void
    {
        $this->actor();
        $sub = $this->makeSubscription(['monthly_price' => 250000, 'start_date' => CarbonImmutable::now()->subMonths(4)->toDateString()]);

        $this->assertSame(1000000.0, $sub->accrued_amount);
    }

    /**
     * Inti perombakan: tanpa pembayaran tercatat, langganan berjalan 6 bulan
     * harus tampil menunggak — bukan otomatis dianggap lunas seperti sebelumnya.
     */
    public function test_running_subscription_without_payment_is_in_arrears(): void
    {
        $this->actor();
        $sub = $this->makeSubscription();

        $this->assertSame(0.0, $sub->total_paid);
        $this->assertSame(600000.0, $sub->accrued_amount);
        $this->assertSame(600000.0, $sub->outstanding_amount);
        $this->assertSame('menunggak', $sub->payment_state);
    }

    public function test_recording_payment_reduces_arrears_and_moves_due_date(): void
    {
        $this->actor();
        $sub = $this->makeSubscription();

        $sub->recordPayment(6);
        $sub->refresh();

        $this->assertSame(600000.0, $sub->total_paid);
        $this->assertSame(6, $sub->months_paid);
        $this->assertSame(0.0, $sub->outstanding_amount);
        $this->assertSame(
            CarbonImmutable::parse($sub->start_date)->addMonths(6)->toDateString(),
            $sub->paid_through,
        );
    }

    /** Pembayaran berturut-turut harus bersambung, tidak bertumpuk. */
    public function test_consecutive_payments_do_not_overlap(): void
    {
        $this->actor();
        $sub = $this->makeSubscription();

        $first = $sub->recordPayment(3);
        $sub->refresh();
        $second = $sub->recordPayment(3);

        $this->assertSame(
            $first->period_end->toDateString(),
            $second->period_start->toDateString(),
            'Periode pembayaran kedua harus mulai tepat saat periode pertama berakhir',
        );
        $this->assertSame(6, $sub->refresh()->months_paid);
    }

    /** Siklus tagihan hanya mengubah nominal sekali tagih, bukan harga bulanan. */
    public function test_billing_cycle_only_changes_invoice_amount(): void
    {
        $this->actor();
        $sub = $this->makeSubscription(['monthly_price' => 50000, 'billing_cycle_months' => 12]);

        $this->assertSame(600000.0, $sub->cycle_amount);
        $this->assertSame(50000.0, (float) $sub->monthly_price);
    }

    public function test_ended_subscription_stops_accruing(): void
    {
        $this->actor();
        $sub = $this->makeSubscription([
            'status' => AppSubscription::STATUS_ENDED,
            'start_date' => CarbonImmutable::now()->subMonths(10)->toDateString(),
            'ended_at' => CarbonImmutable::now()->subMonths(4)->toDateString(),
        ]);

        // Hanya 6 bulan yang dihitung, bukan 10
        $this->assertSame(6, $sub->months_running);
        $this->assertSame(600000.0, $sub->accrued_amount);
        $this->assertNull($sub->next_due_date);
        $this->assertSame('berhenti', $sub->payment_state);
    }

    public function test_can_create_subscription_with_prepaid_months(): void
    {
        $user = $this->actor();
        $category = AppCategory::firstOrCreate(['slug' => 'pos-app'], ['name' => 'POS App']);

        $this->actingAs($user)->post('/app-subscriptions', [
            'app_category_id' => $category->id,
            'client_name' => 'Klien Prabayar',
            'app_name' => 'POS Prabayar',
            'monthly_price' => 200000,
            'billing_cycle_months' => 3,
            'status' => 'active',
            'start_date' => CarbonImmutable::now()->subMonths(5)->toDateString(),
            'prepaid_months' => 5,
        ])->assertRedirect();

        $sub = AppSubscription::where('client_name', 'Klien Prabayar')->firstOrFail();

        $this->assertSame(5, $sub->months_paid);
        $this->assertSame(1000000.0, $sub->total_paid);
        $this->assertSame(0.0, $sub->outstanding_amount);
    }

    /** Menghapus pembayaran harus memundurkan kembali masa aktif. */
    public function test_deleting_payment_recalculates_paid_through(): void
    {
        $user = $this->actor();
        $sub = $this->makeSubscription();
        $payment = $sub->recordPayment(6);
        $sub->refresh();

        $this->assertSame(6, $sub->months_paid);

        $this->actingAs($user)
            ->delete("/app-subscriptions/{$sub->id}/payments/{$payment->id}")
            ->assertRedirect();

        $sub->refresh();

        $this->assertSame(0, $sub->months_paid);
        $this->assertSame(600000.0, $sub->outstanding_amount);
    }

    /** Kategori yang masih dipakai tidak boleh terhapus. */
    public function test_category_in_use_cannot_be_deleted(): void
    {
        $user = $this->actor();
        $sub = $this->makeSubscription();
        $categoryId = $sub->app_category_id;

        $this->actingAs($user)->delete("/app-categories/{$categoryId}")->assertRedirect();

        $this->assertDatabaseHas('app_categories', ['id' => $categoryId]);
    }
}
