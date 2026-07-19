<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMilestoneChecklist extends Model
{
    protected $fillable = [
        'project_milestone_id',
        'title',
        'is_checked',
    ];

    public function milestone()
    {
        return $this->belongsTo(ProjectMilestone::class, 'project_milestone_id');
    }
}
