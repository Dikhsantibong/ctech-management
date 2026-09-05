<?php

namespace App\Services\Canvas;

use Illuminate\Support\Str;

/**
 * Membaca dokumentasi database (heading tabel + tabel markdown kolom + section
 * Relationships) menjadi node ERD dan edge relasi. Tidak berasumsi: relasi hanya
 * dibuat bila deklarasinya jelas (baris "a.col -> b.col" atau kolom FK yang
 * target tabelnya benar-benar ada).
 */
class DatabaseSchemaParser
{
    public function __construct(private readonly MarkdownParser $markdown) {}

    /**
     * @return array{nodes: list<array<string,mixed>>, edges: list<array<string,mixed>>, warnings: list<string>, unmapped: list<string>}
     */
    public function parse(string $content): array
    {
        $sections = $this->markdown->sections($content);

        $tables = [];       // tableName => columns[]
        $relationshipBodies = [];
        $order = [];

        foreach ($sections as $section) {
            if ($section['heading'] === '') {
                continue;
            }

            if (Str::contains(Str::lower($section['heading']), 'relationship')) {
                $relationshipBodies[] = $section['body'];

                continue;
            }

            $table = $this->markdown->parseTable($section['body']);
            if ($table === null) {
                continue;
            }

            $nameHeader = $this->firstPresent($table['headers'], ['column', 'field', 'name', 'kolom']);
            if ($nameHeader === null) {
                continue;
            }

            $typeHeader = $this->firstPresent($table['headers'], ['type', 'tipe', 'data type']);
            $keyHeader = $this->firstPresent($table['headers'], ['key', 'index', 'constraint', 'kunci']);

            $tableName = $this->tableName($section['heading']);
            $columns = [];

            foreach ($table['rows'] as $row) {
                $colName = $row[$nameHeader] ?? '';
                if ($colName === '') {
                    continue;
                }
                $key = $keyHeader ? ($row[$keyHeader] ?? '') : '';
                $columns[] = [
                    'name' => $colName,
                    'type' => $typeHeader ? ($row[$typeHeader] ?? '') : '',
                    'key' => $key,
                    'pk' => (bool) preg_match('/pk|primary/i', $key),
                    'fk' => (bool) preg_match('/fk|foreign/i', $key),
                ];
            }

            if ($columns !== []) {
                $tables[$tableName] = $columns;
                $order[] = $tableName;
            }
        }

        return $this->build($tables, $order, $relationshipBodies);
    }

    /**
     * @param  array<string, list<array<string,mixed>>>  $tables
     * @param  list<string>  $order
     * @param  list<string>  $relationshipBodies
     * @return array{nodes: list<array<string,mixed>>, edges: list<array<string,mixed>>, warnings: list<string>, unmapped: list<string>}
     */
    private function build(array $tables, array $order, array $relationshipBodies): array
    {
        $nodes = [];
        $edges = [];
        $warnings = [];
        $unmapped = [];

        $keyFor = fn (string $name) => 'db_'.Str::slug($name, '_');

        foreach ($order as $i => $name) {
            $col = $i % 3;
            $rowIdx = intdiv($i, 3);
            $nodes[] = [
                'id' => $keyFor($name),
                'type' => 'database',
                'position' => ['x' => $col * 340, 'y' => $rowIdx * 320],
                'data' => [
                    'label' => $name,
                    'columns' => $tables[$name],
                ],
                'source_type' => 'database',
                'source_reference' => $name,
            ];
        }

        $seen = [];
        $addEdge = function (string $from, string $to, string $label) use (&$edges, &$seen, $keyFor) {
            $edgeId = 'rel_'.$keyFor($from).'__'.$keyFor($to);
            if (isset($seen[$edgeId])) {
                return;
            }
            $seen[$edgeId] = true;
            $edges[] = [
                'id' => $edgeId,
                'type' => 'relationship',
                'source' => $keyFor($from),
                'target' => $keyFor($to),
                'label' => $label,
                'data' => ['cardinality' => $label],
            ];
        };

        // 1) Relasi eksplisit: "a.col -> b.col"
        foreach ($relationshipBodies as $body) {
            foreach (preg_split('/\r\n|\r|\n/', $body) ?: [] as $line) {
                if (preg_match('/([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\s*(?:→|->|=>|-->)\s*([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)/u', $line, $m)) {
                    $from = $m[1];
                    $to = $m[3];
                    if (isset($tables[$from], $tables[$to])) {
                        $addEdge($from, $to, 'N:1');
                    } else {
                        $unmapped[] = trim($line);
                    }
                }
            }
        }

        // 2) Kolom FK "<x>_id" yang target tabelnya benar-benar ada (tanpa asumsi liar).
        foreach ($tables as $name => $columns) {
            foreach ($columns as $col) {
                if (! $col['fk'] && ! preg_match('/_id$/', (string) $col['name'])) {
                    continue;
                }
                if (! preg_match('/^(.*)_id$/', (string) $col['name'], $m)) {
                    continue;
                }
                $base = $m[1];
                $target = $this->matchTable(array_keys($tables), $base);
                if ($target !== null && $target !== $name) {
                    $addEdge($name, $target, 'N:1');
                }
            }
        }

        if ($nodes === []) {
            $warnings[] = 'Beberapa bagian dokumentasi tidak dapat dipetakan secara otomatis.';
        }
        if ($unmapped !== []) {
            $warnings[] = 'Sebagian relasi merujuk tabel yang tidak ditemukan dan dilewati.';
        }

        return ['nodes' => $nodes, 'edges' => $edges, 'warnings' => $warnings, 'unmapped' => $unmapped];
    }

    /**
     * @param  list<string>  $tableNames
     */
    private function matchTable(array $tableNames, string $base): ?string
    {
        $candidates = [$base, $base.'s', $base.'es', Str::plural($base)];
        foreach ($tableNames as $t) {
            foreach ($candidates as $c) {
                if (strcasecmp($t, $c) === 0) {
                    return $t;
                }
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $headers
     * @param  list<string>  $candidates
     */
    private function firstPresent(array $headers, array $candidates): ?string
    {
        foreach ($candidates as $c) {
            if (in_array($c, $headers, true)) {
                return $c;
            }
        }

        return null;
    }

    private function tableName(string $heading): string
    {
        // Ambil token pertama yang tampak seperti nama tabel.
        $heading = trim($heading);
        if (preg_match('/([A-Za-z_][A-Za-z0-9_]*)/', $heading, $m)) {
            return $m[1];
        }

        return Str::slug($heading, '_');
    }
}
