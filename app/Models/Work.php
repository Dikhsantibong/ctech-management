<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'title',
        'category',
        'priority',
        'user_id',
        'start_date',
        'due_date',
        'estimated_duration',
        'client_id',
        'project_id',
        'description',
        'checklist',
        'attachments',
        'reminder',
        'is_recurring',
        'recurring_frequency',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'checklist' => 'array',
        'attachments' => 'array',
        'is_recurring' => 'boolean',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'work_collaborators', 'work_id', 'user_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
