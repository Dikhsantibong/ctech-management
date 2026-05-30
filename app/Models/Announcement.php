<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    protected $fillable = ['title', 'content', 'visible_to_roles', 'type', 'is_active', 'published_at', 'expires_at', 'created_by'];

    protected $casts = [
        'visible_to_roles' => 'array',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $attributes = [
        'visible_to_roles' => '["staff", "admin_operasional", "direktur_operasional", "direktur_utama"]',
        'type' => 'info',
        'is_active' => true,
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isVisibleToRole(string $role): bool
    {
        return in_array($role, $this->visible_to_roles ?? []);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeForRole($query, string $role)
    {
        return $query->whereJsonContains('visible_to_roles', $role);
    }
}
