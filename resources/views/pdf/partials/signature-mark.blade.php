{{--
    Ruang tanda tangan. Bila dokumen ditandatangani elektronik ($signature dari
    App\Services\Documents\SignatureStamp), cap perusahaan & tanda tangan Direktur Utama
    dicetak di sini; selain itu (draft / cetak TTD basah) ruangnya dibiarkan kosong.
--}}
@php($height = $height ?? 80)
<div style="position: relative; height: {{ $height }}px; text-align: center;">
    @if(!empty($signature))
        @if(!empty($signature['stamp_image']))
            <img src="{{ $signature['stamp_image'] }}" alt="Cap" style="position: absolute; left: 4px; top: -8px; height: {{ $height + 16 }}px; opacity: 0.85;">
        @endif
        @if(!empty($signature['signature_image']))
            <img src="{{ $signature['signature_image'] }}" alt="Tanda tangan" style="position: relative; height: {{ $height }}px; max-width: 190px;">
        @endif
    @endif
</div>
