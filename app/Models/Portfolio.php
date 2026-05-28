<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use \App\Traits\LogsActivity;

    protected $fillable = [
        'title',
        'category',
        'image',
        'description',
        'link',
    ];
}
