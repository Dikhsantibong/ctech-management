<?php

namespace App\Services\Social;

/** Hasil satu kali pengiriman ke sebuah platform. */
class PublishResult
{
    private function __construct(
        public readonly bool $success,
        public readonly ?string $externalId = null,
        public readonly ?string $permalink = null,
        public readonly ?string $message = null,
        public readonly bool $simulated = false,
        public readonly bool $retryable = true,
    ) {
    }

    public static function success(?string $externalId = null, ?string $permalink = null, ?string $message = null, bool $simulated = false): self
    {
        return new self(true, $externalId, $permalink, $message, $simulated);
    }

    /**
     * @param bool $retryable false untuk kesalahan yang tidak akan membaik meski diulang,
     *                        misalnya caption melanggar aturan atau kredensial salah.
     */
    public static function failure(string $message, bool $retryable = true): self
    {
        return new self(false, null, null, $message, false, $retryable);
    }
}
