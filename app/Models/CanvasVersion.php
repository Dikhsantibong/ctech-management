<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanvasVersion extends Model
{
    protected $table = 'canvas_versions';

    protected $fillable = [
        'canvas_id',
        'version_number',
        'name',
        'description',
        'snapshot',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'snapshot' => 'array',
        ];
    }

    public function canvas(): BelongsTo
    {
        return $this->belongsTo(ProjectCanvas::class, 'canvas_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
