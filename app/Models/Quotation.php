<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    protected $fillable = [
        'quotation_number',
        'client_name',
        'client_pic',
        'client_address',
        'quotation_date',
        'valid_until',
        'subject',
        'intro',
        'terms',
        'notes',
        'use_tax',
        'tax_rate',
        'discount',
        'subtotal',
        'tax',
        'total',
        'status',
        'created_by',
        'verified_at',
        'verified_by',
        'prospect_id',
    ];

    protected $casts = [
        'quotation_date' => 'date',
        'valid_until' => 'date',
        'use_tax' => 'boolean',
        'tax_rate' => 'decimal:2',
        'discount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class)->orderBy('sort_order');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function prospect(): BelongsTo
    {
        return $this->belongsTo(Prospect::class);
    }

    public function getTerbilangAttribute(): string
    {
        return ucwords(trim($this->penyebut((float) $this->total))).' Rupiah';
    }

    private function penyebut(float $nilai): string
    {
        $nilai = abs($nilai);
        $huruf = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
        $temp = '';

        if ($nilai < 12) {
            $temp = ' '.$huruf[(int) $nilai];
        } elseif ($nilai < 20) {
            $temp = $this->penyebut($nilai - 10).' belas';
        } elseif ($nilai < 100) {
            $temp = $this->penyebut($nilai / 10).' puluh'.$this->penyebut(fmod($nilai, 10));
        } elseif ($nilai < 200) {
            $temp = ' seratus'.$this->penyebut($nilai - 100);
        } elseif ($nilai < 1000) {
            $temp = $this->penyebut($nilai / 100).' ratus'.$this->penyebut(fmod($nilai, 100));
        } elseif ($nilai < 2000) {
            $temp = ' seribu'.$this->penyebut($nilai - 1000);
        } elseif ($nilai < 1000000) {
            $temp = $this->penyebut($nilai / 1000).' ribu'.$this->penyebut(fmod($nilai, 1000));
        } elseif ($nilai < 1000000000) {
            $temp = $this->penyebut($nilai / 1000000).' juta'.$this->penyebut(fmod($nilai, 1000000));
        } elseif ($nilai < 1000000000000) {
            $temp = $this->penyebut($nilai / 1000000000).' milyar'.$this->penyebut(fmod($nilai, 1000000000));
        } elseif ($nilai < 1000000000000000) {
            $temp = $this->penyebut($nilai / 1000000000000).' trilyun'.$this->penyebut(fmod($nilai, 1000000000000));
        }

        return $temp;
    }
}
