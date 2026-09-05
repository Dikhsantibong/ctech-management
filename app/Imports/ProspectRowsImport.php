<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\Import;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Penanda pembacaan sheet pertama file import dengan heading row (snake_case).
 * Dipakai bersama Excel::toArray(); validasi & preview ditangani
 * ProspectImportService sesuai alur konfirmasi.
 */
class ProspectRowsImport implements Import, WithHeadingRow {}
