<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectFinancial extends Model
{
    protected $fillable = [
        'project_id',
        'contract_value',
        'cost',
        'profit',
        'margin',
        'payment_status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
