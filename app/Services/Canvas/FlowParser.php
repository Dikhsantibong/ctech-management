<?php

namespace App\Services\Canvas;

use Illuminate\Support\Str;

/**
 * Membaca dokumentasi flow (langkah dipisah panah/baris) menjadi node
 * Start/Process/Decision/End yang terhubung berurutan. Tidak memaksa parsing
 * bila struktur tidak jelas.
 */
class FlowParser
{
    public function __construct(private readonly MarkdownParser $markdown) {}

    /**
     * @return array{nodes: list<array<string,mixed>>, edges: list<array<string,mixed>>, warnings: list<string>, unmapped: list<string>}
     */
    public function parse(string $content): array
    {
        $sections = $this->markdown->sections($content);

        // Pilih section dengan urutan langkah terpanjang.
        $bestSteps = [];
        foreach ($sections as $section) {
            $steps = $this->markdown->arrowSequence($section['body']);
            $steps = array_values(array_filter($steps, fn ($s) => mb_strlen($s) > 0 && mb_strlen($s) < 120));
            if (count($steps) > count($bestSteps)) {
                $bestSteps = $steps;
            }
        }

        if (count($bestSteps) < 2) {
            return [
                'nodes' => [],
                'edges' => [],
                'warnings' => ['Beberapa bagian dokumentasi tidak dapat dipetakan secara otomatis.'],
                'unmapped' => [],
            ];
        }

        $nodes = [];
        $edges = [];
        $count = count($bestSteps);

        foreach ($bestSteps as $i => $label) {
            $type = 'process';
            if ($i === 0) {
                $type = 'start';
            } elseif ($i === $count - 1) {
                $type = 'end';
            } elseif (str_ends_with($label, '?')) {
                $type = 'decision';
            }

            $id = 'flow_'.$i.'_'.Str::slug($label, '_');
            $nodes[] = [
                'id' => $id,
                'type' => $type,
                'position' => ['x' => 0, 'y' => $i * 130],
                'data' => ['label' => $label],
                'source_type' => 'flow',
            ];

            if ($i > 0) {
                $prev = $nodes[$i - 1]['id'];
                $edges[] = [
                    'id' => 'flowedge_'.($i - 1).'_'.$i,
                    'type' => 'flow',
                    'source' => $prev,
                    'target' => $id,
                ];
            }
        }

        return ['nodes' => $nodes, 'edges' => $edges, 'warnings' => [], 'unmapped' => []];
    }
}
