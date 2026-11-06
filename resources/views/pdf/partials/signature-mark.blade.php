{{--
    Ruang tanda tangan. Bila dokumen ditandatangani elektronik ($signature dari
    App\Services\Documents\SignatureStamp), cap perusahaan & tanda tangan Direktur Utama
    dicetak di sini; selain itu (draft / cetak TTD basah) ruangnya dibiarkan kosong.

    Ukuran dihitung dari rasio gambar (tepi kosong sudah dipangkas) agar muat di kotaknya:
    cap maks. ±1,4× tinggi ruang TTD & 160px lebar, menumpuk di sisi kiri tanda tangan seperti
    stempel basah; tanda tangan maks. setinggi ruang TTD & 190px lebar.
--}}
@php
    $height = $height ?? 80;

    $fit = function (float $ratio, float $maxWidth, float $maxHeight): array {
        $width = min($maxWidth, $maxHeight * $ratio);

        return [(int) round($width), (int) round($width / $ratio)];
    };

    [$stampWidth, $stampHeight] = $fit($signature['stamp_ratio'] ?? 1.0, 160, $height * 1.4);
    [$signWidth, $signHeight] = $fit($signature['signature_ratio'] ?? 1.0, 190, $height);
    $stampTop = (int) round(($height - $stampHeight) / 2);
@endphp
<div style="position: relative; height: {{ $height }}px; text-align: center;">
    @if(!empty($signature))
        @if(!empty($signature['stamp_image']))
            <img src="{{ $signature['stamp_image'] }}" alt="Cap" style="position: absolute; left: 0; top: {{ $stampTop }}px; width: {{ $stampWidth }}px; height: {{ $stampHeight }}px; opacity: 0.9;">
        @endif
        @if(!empty($signature['signature_image']))
            <img src="{{ $signature['signature_image'] }}" alt="Tanda tangan" style="position: relative; top: {{ (int) round(($height - $signHeight) / 2) }}px; width: {{ $signWidth }}px; height: {{ $signHeight }}px;">
        @endif
    @endif
</div>
