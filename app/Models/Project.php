<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'project_name',
        'client_name',
        'description',
        'start_date',
        'deadline',
        'status',
        'progress',
        'project_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function financial()
    {
        return $this->hasOne(ProjectFinancial::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function documents()
    {
        return $this->hasMany(ProjectDocument::class);
    }

    public function documentFolders(): HasMany
    {
        return $this->hasMany(ProjectDocumentFolder::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ProjectRevision::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(ClientFeedback::class);
    }
}
