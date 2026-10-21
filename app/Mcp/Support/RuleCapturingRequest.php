<?php

namespace App\Mcp\Support;

use Illuminate\Http\Request;

/**
 * Request tiruan yang berhenti tepat saat controller memanggil validate().
 *
 * Dipakai untuk membaca aturan validasi asli dari controller, sehingga daftar
 * field yang diberikan ke Claude selalu sama dengan aturan aplikasi tanpa
 * harus ditulis ulang.
 */
class RuleCapturingRequest extends Request
{
    /**
     * @param  array<string, mixed>  $rules
     *
     * @throws CapturedRules
     */
    public function validate(array $rules, ...$params): array
    {
        throw new CapturedRules($rules);
    }
}
