<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'client_name',
        'due_date',
        'subtotal',
        'tax',
        'total',
        'status',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
