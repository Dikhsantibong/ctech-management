<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Letter extends Model
{
    protected $fillable = [
        'reference_number',
        'type',
        'letter_date',
        'sifat',
        'recipient',
        'subject',
        'content',
        'status',
        'created_by',
        'margin_top',
        'margin_right',
        'margin_bottom',
        'margin_left',
        'line_spacing',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'letter_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
