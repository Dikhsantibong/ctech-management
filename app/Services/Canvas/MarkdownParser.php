<?php

namespace App\Services\Canvas;

/**
 * Tokenizer Markdown yang aman: HANYA membaca teks sebagai data dokumentasi,
 * tidak pernah mengeksekusi kode apa pun. Menyediakan primitive (section,
 * tabel, urutan panah) yang dipakai DatabaseSchemaParser & FlowParser.
 */
class MarkdownParser
{
    /**
     * Pecah markdown menjadi section berdasarkan heading (#, ##, ...).
     *
     * @return list<array{level:int, heading:string, body:string}>
     */
    public function sections(string $markdown): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $markdown) ?: [];
        $sections = [];
        $current = null;

        foreach ($lines as $line) {
            if (preg_match('/^(#{1,6})\s+(.*)$/', $line, $m)) {
                if ($current !== null) {
                    $sections[] = $current;
                }
                $current = ['level' => strlen($m[1]), 'heading' => trim($m[2]), 'body' => ''];
            } elseif ($current !== null) {
                $current['body'] .= $line."\n";
            } else {
                // Konten sebelum heading pertama.
                $current = ['level' => 0, 'heading' => '', 'body' => $line."\n"];
            }
        }

        if ($current !== null) {
            $sections[] = $current;
        }

        return $sections;
    }

    /**
     * Parse tabel markdown pertama dari sebuah body.
     *
     * @return array{headers: list<string>, rows: list<array<string,string>>}|null
     */
    public function parseTable(string $body): ?array
    {
        $lines = array_values(array_filter(
            array_map('trim', preg_split('/\r\n|\r|\n/', $body) ?: []),
            fn ($l) => str_contains($l, '|')
        ));

        if (count($lines) < 1) {
            return null;
        }

        $rowsRaw = array_map(fn ($l) => $this->splitRow($l), $lines);

        // Buang baris pemisah markdown (---|---).
        $rowsRaw = array_values(array_filter($rowsRaw, function ($cells) {
            $joined = implode('', $cells);

            return ! preg_match('/^[-:\s]*$/', $joined);
        }));

        if (count($rowsRaw) < 1) {
            return null;
        }

        $headers = array_map(fn ($h) => strtolower(trim($h)), $rowsRaw[0]);
        $rows = [];

        foreach (array_slice($rowsRaw, 1) as $cells) {
            $row = [];
            foreach ($headers as $i => $h) {
                $row[$h] = trim($cells[$i] ?? '');
            }
            $rows[] = $row;
        }

        return ['headers' => $headers, 'rows' => $rows];
    }

    /**
     * Ambil urutan langkah dari body yang memakai panah atau baris pendek berurutan.
     *
     * @return list<string>
     */
    public function arrowSequence(string $body): array
    {
        // Normalisasi semua jenis panah menjadi newline.
        $normalized = preg_replace('/\s*(→|↓|->|=>|-->|➜|⇒)\s*/u', "\n", $body) ?? $body;
        $steps = [];

        foreach (preg_split('/\r\n|\r|\n/', $normalized) ?: [] as $line) {
            $line = trim($line);
            // Buang bullet/format tabel.
            $line = ltrim($line, "-*•\t ");
            if ($line === '' || str_contains($line, '|')) {
                continue;
            }
            $steps[] = $line;
        }

        return $steps;
    }

    /**
     * @return list<string>
     */
    private function splitRow(string $line): array
    {
        $line = trim($line);
        $line = preg_replace('/^\|/', '', $line) ?? $line;
        $line = preg_replace('/\|$/', '', $line) ?? $line;

        return array_map('trim', explode('|', $line));
    }
}
