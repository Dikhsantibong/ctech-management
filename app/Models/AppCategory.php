<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * Jenis aplikasi yang dilanggan, mis. POS App dan Photobooth App.
 * Menggantikan kolom app_name berupa teks bebas agar rekap per jenis aplikasi
 * bisa diandalkan.
 */
class AppCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'default_monthly_price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'default_monthly_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (AppCategory $category) {
            if (blank($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(AppSubscription::class);
    }
}
