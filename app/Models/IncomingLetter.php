<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncomingLetter extends Model
{
    protected $fillable = [
        'agenda_number',
        'reference_number',
        'sender',
        'letter_date',
        'received_date',
        'subject',
        'sifat',
        'disposition',
        'notes',
        'attachment_path',
        'status',
        'created_by',
    ];

    protected $casts = [
        'letter_date' => 'date',
        'received_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
