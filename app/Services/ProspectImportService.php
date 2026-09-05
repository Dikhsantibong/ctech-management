<?php

namespace App\Services;

use App\Imports\ProspectRowsImport;
use App\Models\Client;
use App\Models\Prospect;
use App\Models\User;
use App\Support\Crm;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Alur import prospek: baca file → validasi → cek duplikat → preview.
 * Tidak pernah menyimpan langsung setelah upload; penyimpanan dilakukan
 * terpisah lewat applyRows() setelah pengguna konfirmasi.
 */
class ProspectImportService
{
    /**
     * Baca file upload menjadi baris preview terstruktur.
     *
     * @return array{valid: list<array<string,mixed>>, duplicates: list<array<string,mixed>>, errors: list<array<string,mixed>>, summary: array<string,int>}
     */
    public function preview(UploadedFile $file): array
    {
        $sheets = Excel::toArray(new ProspectRowsImport, $file);
        $rows = $sheets[0] ?? [];

        $salesByName = User::all()->keyBy(fn ($u) => mb_strtolower(trim($u->name)));
        $salesByEmail = User::all()->keyBy(fn ($u) => mb_strtolower(trim((string) $u->email)));

        $valid = [];
        $duplicates = [];
        $errors = [];

        foreach ($rows as $index => $raw) {
            $rowNumber = $index + 2; // baris 1 = heading

            if ($this->isEmptyRow($raw)) {
                continue;
            }

            [$payload, $rowErrors] = $this->normalize($raw, $salesByName, $salesByEmail);

            if ($rowErrors !== []) {
                foreach ($rowErrors as $column => $reason) {
                    $errors[] = [
                        'row_number' => $rowNumber,
                        'company' => (string) ($raw['nama_perusahaan'] ?? '-'),
                        'column' => $column,
                        'reason' => $reason,
                    ];
                }

                continue;
            }

            $duplicate = $this->findDuplicate($payload);

            if ($duplicate !== null) {
                $duplicates[] = [
                    'row_number' => $rowNumber,
                    'payload' => $payload,
                    'match_type' => $duplicate['type'],
                    'match_reason' => $duplicate['reason'],
                    'existing_prospect_id' => $duplicate['prospect_id'],
                    'existing_client_id' => $duplicate['client_id'],
                    'action' => 'skip',
                ];

                continue;
            }

            $valid[] = [
                'row_number' => $rowNumber,
                'payload' => $payload,
            ];
        }

        return [
            'valid' => $valid,
            'duplicates' => $duplicates,
            'errors' => $errors,
            'summary' => [
                'total' => count($valid) + count($duplicates) + count(array_unique(array_column($errors, 'row_number'))),
                'valid' => count($valid),
                'duplicates' => count($duplicates),
                'errors' => count(array_unique(array_column($errors, 'row_number'))),
            ],
        ];
    }

    /**
     * Simpan baris hasil konfirmasi. Setiap entri: payload + action.
     *
     * @param  list<array<string,mixed>>  $rows
     */
    public function applyRows(array $rows, int $createdBy): int
    {
        $imported = 0;

        DB::transaction(function () use ($rows, $createdBy, &$imported) {
            foreach ($rows as $row) {
                $action = $row['action'] ?? 'create';
                $payload = $row['payload'] ?? [];

                if ($payload === [] || empty($payload['company_name'])) {
                    continue;
                }

                if ($action === 'skip') {
                    continue;
                }

                $payload['created_by'] = $createdBy;

                if ($action === 'update' && ! empty($row['existing_prospect_id'])) {
                    $prospect = Prospect::find($row['existing_prospect_id']);
                    if ($prospect) {
                        $prospect->update(array_filter($payload, fn ($v) => $v !== null && $v !== ''));
                        $imported++;
                    }

                    continue;
                }

                if (! empty($row['existing_client_id'])) {
                    $payload['client_id'] = $row['existing_client_id'];
                }

                Prospect::create($payload);
                $imported++;
            }
        });

        return $imported;
    }

    /**
     * @param  array<string,mixed>  $raw
     * @return array{0: array<string,mixed>, 1: array<string,string>}
     */
    private function normalize(array $raw, $salesByName, $salesByEmail): array
    {
        $get = fn (string $key) => $this->clean($raw[$key] ?? null);

        $errors = [];

        $companyName = $get('nama_perusahaan');
        if ($companyName === null) {
            $errors['nama_perusahaan'] = 'Nama perusahaan wajib diisi.';
        }

        $companyEmail = $get('email_perusahaan');
        if ($companyEmail !== null && ! filter_var($companyEmail, FILTER_VALIDATE_EMAIL)) {
            $errors['email_perusahaan'] = 'Format email perusahaan tidak valid.';
        }

        $picEmail = $get('email_pic');
        if ($picEmail !== null && ! filter_var($picEmail, FILTER_VALIDATE_EMAIL)) {
            $errors['email_pic'] = 'Format email PIC tidak valid.';
        }

        // sales_pic harus merujuk User existing (nama atau email). Kosong = belum ditugaskan.
        $salesId = null;
        $salesRef = $get('sales_pic');
        if ($salesRef !== null) {
            $key = mb_strtolower($salesRef);
            $user = $salesByName->get($key) ?? $salesByEmail->get($key);
            if ($user === null) {
                $errors['sales_pic'] = "Sales '{$salesRef}' tidak ditemukan sebagai user existing.";
            } else {
                $salesId = $user->id;
            }
        }

        $priority = $get('prioritas');
        if ($priority !== null && ! in_array($priority, Crm::priorities(), true)) {
            $priority = 'Sedang'; // normalisasi diam-diam, bukan error
        }

        $payload = [
            'company_name' => $companyName,
            'brand_name' => $get('nama_brand'),
            'company_type' => $get('jenis_perusahaan'),
            'industry' => $get('industri'),
            'address' => $get('alamat'),
            'city' => $get('kota'),
            'province' => $get('provinsi'),
            'country' => $get('negara') ?? 'Indonesia',
            'website' => $get('website'),
            'company_email' => $companyEmail,
            'company_phone' => $get('telepon_perusahaan'),
            'company_whatsapp' => $get('whatsapp_perusahaan'),
            'pic_name' => $get('nama_pic'),
            'pic_position' => $get('jabatan_pic'),
            'pic_email' => $picEmail,
            'pic_phone' => $get('telepon_pic'),
            'pic_whatsapp' => $get('whatsapp_pic'),
            'pic_linkedin' => $get('linkedin_pic'),
            'source' => $get('sumber_prospek'),
            'sales_id' => $salesId,
            'priority' => $priority ?? 'Sedang',
            'products_interest' => $get('produk_diminati'),
            'notes' => $get('catatan'),
            'stage' => 'Prospek Baru',
            'status' => 'Aktif',
        ];

        return [$payload, $errors];
    }

    /**
     * @param  array<string,mixed>  $payload
     * @return array{type: string, reason: string, prospect_id: ?int, client_id: ?int}|null
     */
    private function findDuplicate(array $payload): ?array
    {
        $emails = array_values(array_filter([$payload['company_email'], $payload['pic_email']]));
        $phones = array_values(array_filter([$payload['company_phone'], $payload['company_whatsapp'], $payload['pic_phone'], $payload['pic_whatsapp']]));

        $prospect = Prospect::query()
            ->when($emails !== [], fn ($q) => $q->whereIn('company_email', $emails)->orWhereIn('pic_email', $emails))
            ->when($phones !== [], fn ($q) => $q->orWhereIn('company_phone', $phones)->orWhereIn('company_whatsapp', $phones))
            ->orWhere(function ($q) use ($payload) {
                $q->where('company_name', $payload['company_name']);
                if ($payload['city']) {
                    $q->where('city', $payload['city']);
                }
            })
            ->first();

        if ($prospect) {
            return [
                'type' => 'prospect',
                'reason' => 'Prospek serupa sudah ada di CRM.',
                'prospect_id' => $prospect->id,
                'client_id' => $prospect->client_id,
            ];
        }

        $client = Client::query()
            ->where('name', $payload['company_name'])
            ->when($emails !== [], fn ($q) => $q->orWhereIn('email', $emails))
            ->first();

        if ($client) {
            return [
                'type' => 'client',
                'reason' => 'Cocok dengan Customer existing.',
                'prospect_id' => null,
                'client_id' => $client->id,
            ];
        }

        return null;
    }

    /**
     * @param  array<string,mixed>  $raw
     */
    private function isEmptyRow(array $raw): bool
    {
        foreach ($raw as $value) {
            if ($this->clean($value) !== null) {
                return false;
            }
        }

        return true;
    }

    private function clean(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
