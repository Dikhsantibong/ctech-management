<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectCanvas extends Model
{
    protected $table = 'project_canvases';

    protected $fillable = [
        'project_id',
        'name',
        'viewport',
        'settings',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'viewport' => 'array',
            'settings' => 'array',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function nodes(): HasMany
    {
        return $this->hasMany(CanvasNode::class, 'canvas_id');
    }

    public function edges(): HasMany
    {
        return $this->hasMany(CanvasEdge::class, 'canvas_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(CanvasVersion::class, 'canvas_id')->latest('version_number');
    }
}
