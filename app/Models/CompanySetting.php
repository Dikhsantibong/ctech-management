<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'leader_name',
        'bank_name',
        'bank_account_number',
        'bank_account_name',
        'address',
        'phone',
        'email',
        'website',
        'bank_accounts',
    ];

    protected $casts = [
        'bank_accounts' => 'array',
    ];
}
