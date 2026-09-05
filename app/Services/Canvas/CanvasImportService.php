<?php

namespace App\Services\Canvas;

/**
 * Dispatcher import dokumentasi. Menentukan parser berdasarkan tipe yang dipilih
 * user (atau Auto Detect), lalu mengembalikan hasil parsing untuk PREVIEW —
 * tidak pernah langsung menyimpan ke database.
 */
class CanvasImportService
{
    public function __construct(
        private readonly MarkdownParser $markdown,
        private readonly DatabaseSchemaParser $databaseParser,
        private readonly FlowParser $flowParser,
    ) {}

    /**
     * @return array{detected_type: string, nodes: list<array<string,mixed>>, edges: list<array<string,mixed>>, warnings: list<string>, unmapped: list<string>}
     */
    public function parse(string $content, string $type = 'auto'): array
    {
        $type = $this->resolveType($content, $type);

        $result = match ($type) {
            'database' => $this->databaseParser->parse($content),
            // architecture & api diperlakukan sebagai urutan alur untuk V1.
            'flow', 'architecture', 'api' => $this->flowParser->parse($content),
            default => ['nodes' => [], 'edges' => [], 'warnings' => ['Beberapa bagian dokumentasi tidak dapat dipetakan secara otomatis.'], 'unmapped' => []],
        };

        return [
            'detected_type' => $type,
            'nodes' => $result['nodes'],
            'edges' => $result['edges'],
            'warnings' => $result['warnings'],
            'unmapped' => $result['unmapped'],
        ];
    }

    private function resolveType(string $content, string $type): string
    {
        $type = strtolower(trim($type));

        if ($type !== 'auto' && $type !== '') {
            return $type;
        }

        return $this->detect($content);
    }

    private function detect(string $content): string
    {
        $lower = strtolower($content);

        // Indikasi skema database.
        $looksDatabase = str_contains($lower, 'relationship')
            || preg_match('/\|\s*(column|field|kolom)\s*\|/i', $content)
            || preg_match('/\bpk\b|\bfk\b|primary key|foreign key/i', $content);

        if ($looksDatabase) {
            $db = $this->databaseParser->parse($content);
            if ($db['nodes'] !== []) {
                return 'database';
            }
        }

        // Indikasi flow: adanya panah.
        if (preg_match('/→|↓|->|=>|-->/u', $content)) {
            return 'flow';
        }

        return 'unknown';
    }
}
