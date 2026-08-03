<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialAccount extends Model
{
    protected $fillable = [
        'platform',
        'display_name',
        'is_enabled',
        'credentials',
        'external_id',
        'token_expires_at',
        'last_verified_at',
        'last_error',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            // Token disimpan terenkripsi di database
            'credentials' => 'encrypted:array',
            'token_expires_at' => 'datetime',
            'last_verified_at' => 'datetime',
        ];
    }

    /** Jangan pernah kirim kredensial ke frontend. */
    protected $hidden = ['credentials'];

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** Semua kolom kredensial wajib platform ini sudah terisi? */
    public function hasCompleteCredentials(): bool
    {
        $required = array_keys(config("social.platforms.{$this->platform}.credentials", []));
        $stored = $this->credentials ?? [];

        foreach ($required as $key) {
            if (blank($stored[$key] ?? null)) {
                return false;
            }
        }

        return $required !== [];
    }

    public function isReady(): bool
    {
        return $this->is_enabled && $this->hasCompleteCredentials();
    }
}
