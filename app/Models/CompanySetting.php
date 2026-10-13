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

    /**
     * Rekening yang sedang dipilih sebagai rekening utama.
     *
     * Dipakai oleh semua dokumen yang mencetak informasi pembayaran (invoice,
     * kwitansi), sehingga mengganti rekening utama di pengaturan langsung
     * mengubah dokumen yang diunduh berikutnya. Bila daftar rekening kosong,
     * jatuh ke kolom tunggal lama agar data sebelum fitur multi rekening tetap terbaca.
     *
     * @return array{bank_name: ?string, account_number: ?string, account_name: ?string}
     */
    public function activeBankAccount(): array
    {
        $accounts = self::normalizeBankAccounts($this->bank_accounts ?? []);

        $active = collect($accounts)->firstWhere('is_active', true);

        if ($active) {
            return [
                'bank_name' => $active['bank_name'],
                'account_number' => $active['account_number'],
                'account_name' => $active['account_name'],
            ];
        }

        return [
            'bank_name' => $this->bank_name,
            'account_number' => $this->bank_account_number,
            'account_name' => $this->bank_account_name,
        ];
    }

    /**
     * Rapikan daftar rekening: buang baris kosong dan pastikan tepat satu
     * rekening yang aktif (rekening pertama bila tidak ada yang dipilih).
     *
     * @param  array<int, array<string, mixed>>  $accounts
     * @return array<int, array{bank_name: ?string, account_number: ?string, account_name: ?string, is_active: bool}>
     */
    public static function normalizeBankAccounts(array $accounts): array
    {
        $clean = collect($accounts)
            ->map(fn ($account) => [
                'bank_name' => self::cleanString($account['bank_name'] ?? null),
                'account_number' => self::cleanString($account['account_number'] ?? null),
                'account_name' => self::cleanString($account['account_name'] ?? null),
                'is_active' => filter_var($account['is_active'] ?? false, FILTER_VALIDATE_BOOLEAN),
            ])
            ->filter(fn ($account) => $account['bank_name'] || $account['account_number'] || $account['account_name'])
            ->values();

        if ($clean->isEmpty()) {
            return [];
        }

        $activeIndex = $clean->search(fn ($account) => $account['is_active']);
        $activeIndex = $activeIndex === false ? 0 : $activeIndex;

        return $clean
            ->map(fn ($account, $index) => [...$account, 'is_active' => $index === $activeIndex])
            ->all();
    }

    private static function cleanString(mixed $value): ?string
    {
        $value = is_string($value) ? trim($value) : null;

        return $value === '' ? null : $value;
    }
}
