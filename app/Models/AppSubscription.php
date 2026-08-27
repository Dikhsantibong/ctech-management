<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Langganan aplikasi milik satu klien.
 *
 * Dasar perhitungan adalah HARGA PER BULAN. Siklus tagihan hanya menentukan
 * seberapa sering ditagih, bukan besaran harganya — sehingga siklus bisa diubah
 * kapan saja tanpa merusak riwayat.
 *
 * Tiga angka yang perlu dibedakan:
 *
 *   terakru (accrued)  : bulan berjalan x harga per bulan — nilai yang seharusnya
 *                        sudah dibayar sampai hari ini
 *   dibayar (paid)     : jumlah pembayaran yang benar-benar tercatat
 *   tunggakan          : selisih keduanya
 *
 * Struktur lama menghitung "total terbayar" dari lamanya waktu berjalan saja,
 * sehingga klien yang menunggak tetap tampak lunas.
 */
class AppSubscription extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_ENDED = 'ended';

    public const STATUSES = [self::STATUS_ACTIVE, self::STATUS_PAUSED, self::STATUS_ENDED];

    /** Pilihan siklus tagihan yang lazim dipakai. */
    public const BILLING_CYCLES = [1, 3, 6, 12];

    protected $fillable = [
        'app_category_id',
        'client_name',
        'app_name',
        'monthly_price',
        'billing_cycle_months',
        'status',
        'start_date',
        'deadline',
        'ended_at',
        'notes',
        'is_invoiced',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'monthly_price' => 'decimal:2',
            'billing_cycle_months' => 'integer',
            'start_date' => 'date',
            'deadline' => 'date',
            'ended_at' => 'date',
            'is_invoiced' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /** Nilai turunan ikut terkirim ke frontend. */
    protected $appends = [
        'months_running',
        'days_running',
        'duration_label',
        'accrued_amount',
        'total_paid',
        'months_paid',
        'outstanding_amount',
        'paid_through',
        'next_due_date',
        'days_until_due',
        'cycle_amount',
        'payment_state',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(AppCategory::class, 'app_category_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class)->orderByDesc('period_start');
    }

    /* ===================== Perhitungan waktu ===================== */

    /** Tanggal acuan akhir: hari ini, atau tanggal berhenti bila sudah diakhiri. */
    private function referenceDate(): CarbonImmutable
    {
        $today = CarbonImmutable::now()->startOfDay();

        if ($this->status === self::STATUS_ENDED && $this->ended_at) {
            return CarbonImmutable::parse($this->ended_at)->startOfDay();
        }

        return $today;
    }

    private function startDate(): ?CarbonImmutable
    {
        return $this->start_date ? CarbonImmutable::parse($this->start_date)->startOfDay() : null;
    }

    /** Lama berlangganan dalam bulan penuh. */
    public function getMonthsRunningAttribute(): int
    {
        $start = $this->startDate();

        if (! $start || $start->greaterThan($this->referenceDate())) {
            return 0;
        }

        // Carbon 3 mengembalikan pecahan; dibulatkan ke bawah agar hanya bulan
        // yang sudah genap yang dihitung
        return (int) floor($start->diffInMonths($this->referenceDate()));
    }

    public function getDaysRunningAttribute(): int
    {
        $start = $this->startDate();

        if (! $start || $start->greaterThan($this->referenceDate())) {
            return 0;
        }

        return (int) floor($start->diffInDays($this->referenceDate()));
    }

    /** Keterangan lama berlangganan yang mudah dibaca, mis. "1 tahun 4 bulan". */
    public function getDurationLabelAttribute(): string
    {
        $start = $this->startDate();

        if (! $start) {
            return '—';
        }

        if ($start->greaterThan($this->referenceDate())) {
            return 'Belum mulai';
        }

        $months = $this->months_running;
        $years = intdiv($months, 12);
        $restMonths = $months % 12;

        // Sisa hari setelah bulan penuh terakhir
        $days = (int) floor($start->addMonths($months)->diffInDays($this->referenceDate()));

        $parts = [];
        if ($years > 0) {
            $parts[] = "{$years} tahun";
        }
        if ($restMonths > 0) {
            $parts[] = "{$restMonths} bulan";
        }
        if ($parts === [] || ($years === 0 && $restMonths < 2 && $days > 0)) {
            $parts[] = "{$days} hari";
        }

        return implode(' ', $parts);
    }

    /* ===================== Perhitungan uang ===================== */

    /** Nominal satu kali tagih sesuai siklus. */
    public function getCycleAmountAttribute(): float
    {
        return round((float) $this->monthly_price * max(1, (int) $this->billing_cycle_months), 2);
    }

    /**
     * Nilai yang seharusnya sudah dibayar sampai tanggal acuan.
     * Dihitung dari bulan penuh yang sudah berjalan — bulan berjalan yang belum
     * genap tidak ikut dihitung agar tidak menagih di muka.
     */
    public function getAccruedAmountAttribute(): float
    {
        return round((float) $this->monthly_price * $this->months_running, 2);
    }

    public function getTotalPaidAttribute(): float
    {
        return round((float) $this->payments()->sum('amount'), 2);
    }

    public function getMonthsPaidAttribute(): int
    {
        return (int) $this->payments()->sum('months');
    }

    public function getOutstandingAmountAttribute(): float
    {
        return round(max(0, $this->accrued_amount - $this->total_paid), 2);
    }

    /** Tanggal sampai kapan langganan sudah terbayar. */
    public function getPaidThroughAttribute(): ?string
    {
        $start = $this->startDate();

        if (! $start) {
            return null;
        }

        return $start->addMonths($this->months_paid)->toDateString();
    }

    /**
     * Jatuh tempo berikutnya = akhir masa yang sudah dibayar.
     * Diturunkan dari riwayat pembayaran, bukan kolom tersendiri, supaya tidak
     * mungkin berbeda dengan kenyataan.
     */
    public function getNextDueDateAttribute(): ?string
    {
        if ($this->status === self::STATUS_ENDED) {
            return null;
        }

        return $this->paid_through;
    }

    public function getDaysUntilDueAttribute(): ?int
    {
        if (! $this->next_due_date) {
            return null;
        }

        return (int) round(
            CarbonImmutable::now()->startOfDay()->diffInDays(CarbonImmutable::parse($this->next_due_date)->startOfDay(), false),
        );
    }

    /**
     * Ringkasan kondisi pembayaran untuk penanda di antarmuka.
     * lunas | jatuh_tempo | menunggak | belum_mulai | berhenti
     */
    public function getPaymentStateAttribute(): string
    {
        if ($this->status === self::STATUS_ENDED) {
            return 'berhenti';
        }

        $start = $this->startDate();
        if ($start && $start->greaterThan(CarbonImmutable::now()->startOfDay())) {
            return 'belum_mulai';
        }

        if ($this->outstanding_amount > 0) {
            return 'menunggak';
        }

        $days = $this->days_until_due;
        if ($days !== null && $days <= 7) {
            return 'jatuh_tempo';
        }

        return 'lunas';
    }

    /* ===================== Pencatatan pembayaran ===================== */

    /**
     * Catat pembayaran untuk sejumlah bulan, dilanjutkan dari periode terakhir
     * yang sudah terbayar sehingga tidak ada celah maupun periode bertumpuk.
     */
    public function recordPayment(int $months, ?float $amount = null, ?string $paidAt = null, array $extra = []): SubscriptionPayment
    {
        $months = max(1, $months);
        $start = $this->startDate() ?? CarbonImmutable::now()->startOfDay();

        $periodStart = CarbonImmutable::parse($this->paid_through ?? $start->toDateString());
        $periodEnd = $periodStart->addMonths($months);

        $payment = $this->payments()->create([
            'period_start' => $periodStart->toDateString(),
            'period_end' => $periodEnd->toDateString(),
            'months' => $months,
            'amount' => $amount ?? round((float) $this->monthly_price * $months, 2),
            'paid_at' => $paidAt ?? CarbonImmutable::now()->toDateString(),
            'method' => $extra['method'] ?? null,
            'reference' => $extra['reference'] ?? null,
            'note' => $extra['note'] ?? null,
            'recorded_by' => $extra['recorded_by'] ?? null,
        ]);

        // Kolom deadline dipertahankan agar bagian lain aplikasi yang masih
        // membacanya tetap menunjuk tanggal yang benar.
        $this->forceFill(['deadline' => $periodEnd->toDateString()])->save();

        return $payment;
    }
}
