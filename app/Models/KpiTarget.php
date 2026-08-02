<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiTarget extends Model
{
    protected $fillable = [
        'role',
        'metric_key',
        'period',
        'target_value',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'target_value' => 'float',
        ];
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
