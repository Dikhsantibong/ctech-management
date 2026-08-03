<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContentPlan extends Model
{
    protected $fillable = [
        'media_path',
        'media_mime',
        'publish_targets',
        'auto_publish',
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
        'visual',
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
            'publish_targets' => 'array',
            'auto_publish' => 'boolean',
        ];
    }

    public function socialPosts(): HasMany
    {
        return $this->hasMany(SocialPost::class);
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
