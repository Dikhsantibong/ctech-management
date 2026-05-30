<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentPlan extends Model
{
    protected $fillable = [
        'title',
        'description',
        'platform',
        'content_type',
        'status',
        'scheduled_date',
        'published_date',
        'notes',
        'created_by',
        'user_id',
        'campaign_name',
        'brief',
        'reference_links',
        'visual_assets_url',
        'target_audience',
        'keywords',
        'tujuan_konten',
        'assigned_to',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'published_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
