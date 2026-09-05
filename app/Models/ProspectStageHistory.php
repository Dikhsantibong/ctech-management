<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProspectStageHistory extends Model
{
    protected $table = 'crm_prospect_stage_histories';

    protected $fillable = [
        'prospect_id',
        'from_stage',
        'to_stage',
        'note',
        'changed_by',
    ];

    public function prospect(): BelongsTo
    {
        return $this->belongsTo(Prospect::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
