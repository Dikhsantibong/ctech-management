<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMilestone extends Model
{
    protected $fillable = [
        'project_id',
        'pic_user_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'progress',
        'status',
        'completed_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_user_id');
    }

    public function checklists()
    {
        return $this->hasMany(ProjectMilestoneChecklist::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_milestone_id');
    }
}
