<?php

namespace App\Models;

use Database\Factories\CrmActivityFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmActivity extends Model
{
    /** @use HasFactory<CrmActivityFactory> */
    use HasFactory;

    protected $table = 'crm_activities';

    protected $fillable = [
        'prospect_id',
        'user_id',
        'type',
        'subject',
        'description',
        'scheduled_at',
        'completed_at',
        'outcome',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function prospect(): BelongsTo
    {
        return $this->belongsTo(Prospect::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', 'Terjadwal');
    }

    /** Aktivitas terjadwal yang melewati waktunya dan belum selesai. */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', 'Terjadwal')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<', now());
    }
}
