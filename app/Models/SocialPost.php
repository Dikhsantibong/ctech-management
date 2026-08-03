<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialPost extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'skipped';

    protected $fillable = [
        'content_plan_id',
        'platform',
        'status',
        'simulated',
        'external_post_id',
        'permalink',
        'message',
        'attempts',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'simulated' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function contentPlan(): BelongsTo
    {
        return $this->belongsTo(ContentPlan::class);
    }
}
