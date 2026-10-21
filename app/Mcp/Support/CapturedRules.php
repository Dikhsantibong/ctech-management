<?php

namespace App\Mcp\Support;

use RuntimeException;
use Stringable;

/**
 * Membawa aturan validasi yang ditangkap RuleCapturingRequest keluar dari controller.
 */
class CapturedRules extends RuntimeException
{
    /**
     * @param  array<string, mixed>  $rules
     */
    public function __construct(public readonly array $rules)
    {
        parent::__construct('Aturan validasi tertangkap.');
    }

    /**
     * Aturan dalam bentuk teks, siap dibaca Claude.
     *
     * @return array<string, string>
     */
    public function readable(): array
    {
        return collect($this->rules)
            ->map(function (mixed $rule): string {
                $parts = is_string($rule) ? explode('|', $rule) : (array) $rule;

                return collect($parts)
                    ->map(fn (mixed $part): string => match (true) {
                        is_string($part) => $part,
                        $part instanceof Stringable => (string) $part,
                        is_object($part) => lcfirst(class_basename($part)),
                        default => (string) $part,
                    })
                    ->implode('|');
            })
            ->all();
    }
}
