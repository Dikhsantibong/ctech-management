<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Satu kali pembayaran langganan, mencakup periode tertentu.
 *
 * Inilah satu-satunya sumber angka "sudah dibayar". Tanpa tabel ini, total
 * pembayaran hanya bisa diterka dari lamanya waktu berjalan.
 */
class SubscriptionPayment extends Model
{
    protected $fillable = [
        'app_subscription_id',
        'period_start',
        'period_end',
        'months',
        'amount',
        'paid_at',
        'method',
        'reference',
        'note',
        'recorded_by',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'paid_at' => 'date',
            'months' => 'integer',
            'amount' => 'decimal:2',
        ];
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(AppSubscription::class, 'app_subscription_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
