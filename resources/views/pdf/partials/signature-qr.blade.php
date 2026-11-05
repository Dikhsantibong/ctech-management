{{-- Keterangan tanda tangan elektronik + QR menuju halaman verifikasi publik. --}}
@if(!empty($signature))
    <table style="border-collapse: collapse;">
        <tr>
            <td style="width: {{ ($qrSize ?? 64) + 6 }}px; vertical-align: top; padding: 0;">
                <img src="{{ $signature['qr'] }}" alt="QR verifikasi" style="width: {{ $qrSize ?? 64 }}px; height: {{ $qrSize ?? 64 }}px;">
            </td>
            <td style="vertical-align: top; padding: 0 0 0 6px; font-size: 7pt; line-height: 1.4; color: #475467; text-align: left;">
                Ditandatangani secara elektronik oleh <strong style="color: #101828;">{{ $signature['name'] }}</strong>
                ({{ $signature['title'] }}) pada {{ $signature['signed_at'] }}.<br>
                Pindai QR untuk memeriksa keaslian dokumen.<br>
                <span style="font-family: 'Courier New', monospace; font-size: 6.5pt; color: #155EEF;">{{ $signature['url'] }}</span>
            </td>
        </tr>
    </table>
@endif
