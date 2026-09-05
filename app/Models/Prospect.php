<?php

namespace App\Models;

use App\Support\Crm;
use Database\Factories\ProspectFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prospect extends Model
{
    /** @use HasFactory<ProspectFactory> */
    use HasFactory;

    protected $table = 'crm_prospects';

    protected $fillable = [
        'company_name',
        'brand_name',
        'company_type',
        'industry',
        'address',
        'city',
        'province',
        'country',
        'website',
        'company_email',
        'company_phone',
        'company_whatsapp',
        'pic_name',
        'pic_position',
        'pic_email',
        'pic_phone',
        'pic_whatsapp',
        'pic_linkedin',
        'source',
        'sales_id',
        'priority',
        'stage',
        'status',
        'products_interest',
        'notes',
        'estimated_value',
        'expected_close_date',
        'needs',
        'next_action',
        'next_follow_up_at',
        'last_activity_at',
        'client_id',
        'converted_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'needs' => 'array',
            'estimated_value' => 'decimal:2',
            'expected_close_date' => 'date',
            'next_follow_up_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'converted_at' => 'datetime',
        ];
    }

    public function sales(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CrmActivity::class)->latest('scheduled_at');
    }

    public function stageHistories(): HasMany
    {
        return $this->hasMany(ProspectStageHistory::class)->latest();
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    /** Prospek yang masih berjalan (belum menang/kalah/dikonversi). */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'Aktif');
    }

    /** Prospek dengan follow-up yang sudah lewat tanggal. */
    public function scopeOverdueFollowUp(Builder $query): Builder
    {
        return $query->where('status', 'Aktif')
            ->whereNotNull('next_follow_up_at')
            ->where('next_follow_up_at', '<', now());
    }

    public function isOpen(): bool
    {
        return ! in_array($this->stage, Crm::terminalStages(), true);
    }

    public function isConverted(): bool
    {
        return $this->converted_at !== null;
    }
}
