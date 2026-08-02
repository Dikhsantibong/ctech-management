<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientFeedback extends Model
{
    protected $table = 'client_feedbacks';

    protected $fillable = ['project_id', 'client_id', 'subject', 'message', 'attachment_path', 'priority', 'status'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
