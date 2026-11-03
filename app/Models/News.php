<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use LogsActivity;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'seo_title',
        'seo_description',
        'image',
        'social_image',
        'story_image',
        'category',
        'status',
        'author_id',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
