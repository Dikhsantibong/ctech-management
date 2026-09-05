<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanvasEdge extends Model
{
    protected $table = 'canvas_edges';

    protected $fillable = [
        'canvas_id',
        'edge_key',
        'source_node',
        'target_node',
        'source_handle',
        'target_handle',
        'label',
        'type',
        'data',
        'style',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'style' => 'array',
        ];
    }

    public function canvas(): BelongsTo
    {
        return $this->belongsTo(ProjectCanvas::class, 'canvas_id');
    }
}
