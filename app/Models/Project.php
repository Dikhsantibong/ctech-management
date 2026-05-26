<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    protected $fillable = [
        'project_name',
        'client_name',
        'description',
        'start_date',
        'deadline',
        'status',
    ];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
