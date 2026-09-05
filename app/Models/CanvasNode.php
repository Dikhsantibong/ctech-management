<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanvasNode extends Model
{
    protected $table = 'canvas_nodes';

    protected $fillable = [
        'canvas_id',
        'node_key',
        'type',
        'label',
        'position_x',
        'position_y',
        'width',
        'height',
        'data',
        'style',
        'source_document_id',
        'source_type',
        'source_reference',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'style' => 'array',
            'position_x' => 'float',
            'position_y' => 'float',
            'width' => 'float',
            'height' => 'float',
        ];
    }

    public function canvas(): BelongsTo
    {
        return $this->belongsTo(ProjectCanvas::class, 'canvas_id');
    }
}
