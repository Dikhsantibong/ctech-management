<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPermission extends Model
{
    protected $fillable = ['document_id', 'user_id', 'role', 'access_level'];

    public function document(): BelongsTo
    {
        return $this->belongsTo(ProjectDocument::class, 'document_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
