<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class NotificationReminderLog extends Model
{
    protected $fillable = ['remindable_id', 'remindable_type', 'reminder_type', 'sent_date'];

    protected $casts = [
        'sent_date' => 'date'
    ];

    public function remindable(): MorphTo
    {
        return $this->morphTo();
    }
}
