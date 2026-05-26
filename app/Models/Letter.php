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
    ];

    protected $casts = [
        'letter_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
