<?php

namespace App\Exports;

use App\Models\Prospect;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

/**
 * Export daftar prospek (mengikuti filter yang sedang aktif) ke Excel.
 */
class ProspectsDataExport implements FromCollection, WithHeadings, WithTitle
{
    /** @param Collection<int, Prospect> $prospects */
    public function __construct(private Collection $prospects) {}

    public function title(): string
    {
        return 'Prospek';
    }

    public function headings(): array
    {
        return [
            'Perusahaan', 'Brand', 'Industri', 'Kota', 'PIC', 'Jabatan',
            'Email PIC', 'Telepon PIC', 'Sumber', 'Sales', 'Prioritas',
            'Tahap', 'Status', 'Nilai Peluang', 'Follow-up Berikutnya', 'Aktivitas Terakhir',
        ];
    }

    public function collection(): Collection
    {
        return $this->prospects->map(fn ($p) => [
            $p->company_name,
            $p->brand_name,
            $p->industry,
            $p->city,
            $p->pic_name,
            $p->pic_position,
            $p->pic_email,
            $p->pic_phone,
            $p->source,
            $p->sales?->name,
            $p->priority,
            $p->stage,
            $p->status,
            $p->estimated_value,
            optional($p->next_follow_up_at)->format('Y-m-d H:i'),
            optional($p->last_activity_at)->format('Y-m-d H:i'),
        ]);
    }
}
