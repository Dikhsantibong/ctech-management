<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $letter->reference_number }}</title>
    @php
        $marginTop = $letter->margin_top ?? 14;
        $marginRight = $letter->margin_right ?? 20;
        $marginBottom = $letter->margin_bottom ?? 18;
        $marginLeft = $letter->margin_left ?? 20;
        $lineSpacing = $letter->line_spacing ?? '1.5';
    @endphp
    <style>
        @page {
            size: A4 portrait;
            margin: {{ $marginTop }}mm {{ $marginRight }}mm {{ $marginBottom }}mm {{ $marginLeft }}mm;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            font-size: 12pt;
            line-height: {{ $lineSpacing }};
            margin: 0;
        }

        /* ===== Kop Surat ===== */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
        }
        .kop-logo-cell {
            width: 80px;
            vertical-align: middle;
            text-align: left;
        }
        .kop-text-cell {
            vertical-align: middle;
            text-align: center;
            padding: 0 80px 0 0; /* balance the logo width so text stays centered on the page */
        }
        .kop-company {
            font-size: 17pt;
            font-weight: bold;
            letter-spacing: 1px;
            color: #1e3a8a;
            text-transform: uppercase;
            margin: 0;
        }
        .kop-address {
            font-size: 9pt;
            color: #374151;
            margin: 3px 0 0 0;
        }
        .kop-contact {
            font-size: 9pt;
            color: #374151;
            margin: 1px 0 0 0;
        }
        .kop-rule-thick {
            border-bottom: 3px solid #1e3a8a;
            margin-top: 10px;
        }
        .kop-rule-thin {
            border-bottom: 1px solid #1e3a8a;
            margin-top: 2px;
            margin-bottom: 18px;
        }

        /* ===== Meta ===== */
        .date-line {
            text-align: right;
            margin-bottom: 6px;
        }
        table.meta { border-collapse: collapse; }
        table.meta td {
            vertical-align: top;
            padding: 0.5px 0;
        }
        .meta-label { width: 70px; }
        .meta-colon { width: 12px; }
        .recipient-block {
            margin: 14px 0 18px 0;
        }

        /* ===== Judul (untuk surat bergaya keputusan) ===== */
        .letter-title {
            text-align: center;
            margin: 4px 0 16px 0;
        }
        .letter-title .name {
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 13pt;
        }
        .letter-title .number {
            font-size: 11pt;
            margin-top: 2px;
        }

        /* ===== Isi surat ===== */
        .content {
            text-align: justify;
            widows: 2;
            orphans: 2;
            word-wrap: break-word; /* jangan biarkan teks panjang keluar dari halaman */
        }
        .content img { max-width: 100%; }
        .content p { margin: 0 0 8px 0; }
        .content ol, .content ul {
            margin: 0 0 8px 0;
            padding-left: 22px;
        }
        .content li { margin: 0 0 4px 0; }
        .content ol ol, .content ul ul, .content ol ul, .content ul ol {
            margin-top: 4px;
            margin-bottom: 0;
        }
        /* Penomoran bertingkat: 1. → a. → i. (list bernomor yang di-indent) */
        .content ol { list-style-type: decimal; }
        .content ol ol { list-style-type: lower-alpha; }
        .content ol ol ol { list-style-type: lower-roman; }
        /* Kelas format dari editor (Quill) agar align & indent ikut terbawa ke PDF */
        .content .ql-align-center  { text-align: center; }
        .content .ql-align-right   { text-align: right; }
        .content .ql-align-justify { text-align: justify; }
        .content .ql-indent-1 { padding-left: 2em; }
        .content .ql-indent-2 { padding-left: 4em; }
        .content .ql-indent-3 { padding-left: 6em; }
        .content .ql-indent-4 { padding-left: 8em; }
        .content .ql-indent-5 { padding-left: 10em; }

        /* ===== Tanda tangan ===== */
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 28px;
            page-break-inside: avoid;
        }
        .signature-cell {
            width: 45%;
            text-align: center;
            vertical-align: top;
        }
        .signature-space { height: 80px; }
        .signature-name {
            font-weight: bold;
            text-decoration: underline;
            margin: 0;
        }
        .signature-role { margin: 2px 0 0 0; }
    </style>
</head>
<body>

    {{-- ===== Kop Surat ===== --}}
    <table class="kop-table">
        <tr>
            <td class="kop-logo-cell">
                @if(!empty($logo))
                    <img src="{{ $logo }}" style="width: 64px;" alt="Logo">
                @endif
            </td>
            <td class="kop-text-cell" @if(empty($logo)) style="padding: 0;" @endif>
                <p class="kop-company">{{ $settings->company_name ?? 'PT KREATIF TEKNOLOGI MAJU BERSAMA' }}</p>
                <p class="kop-address">{{ $settings->address ?? '' }}</p>
                <p class="kop-contact">
                    @if(!empty($settings->phone)) Telp: {{ $settings->phone }} @endif
                    @if(!empty($settings->email)) &bull; Email: {{ $settings->email }} @endif
                    @if(!empty($settings->website)) &bull; {{ $settings->website }} @endif
                </p>
            </td>
        </tr>
    </table>
    <div class="kop-rule-thick"></div>
    <div class="kop-rule-thin"></div>

    {{-- ===== Tanggal ===== --}}
    <div class="date-line">
        Kendari, {{ \Carbon\Carbon::parse($letter->letter_date ?? $letter->created_at)->locale('id')->translatedFormat('d F Y') }}
    </div>

    {{-- ===== Nomor / Sifat / Perihal ===== --}}
    <table class="meta">
        <tr>
            <td class="meta-label">Nomor</td>
            <td class="meta-colon">:</td>
            <td>{{ $letter->reference_number }}</td>
        </tr>
        <tr>
            <td class="meta-label">Sifat</td>
            <td class="meta-colon">:</td>
            <td>{{ $letter->sifat ?? 'Biasa' }}</td>
        </tr>
        <tr>
            <td class="meta-label">Perihal</td>
            <td class="meta-colon">:</td>
            <td><strong>{{ $letter->subject }}</strong></td>
        </tr>
    </table>

    {{-- ===== Penerima ===== --}}
    <div class="recipient-block">
        Kepada Yth.<br>
        <strong>{{ $letter->recipient }}</strong><br>
        di Tempat
    </div>

    {{-- ===== Judul surat (khusus jenis bergaya keputusan/keterangan) ===== --}}
    @if(in_array($letter->type, ['Surat Keputusan', 'Surat Tugas', 'Surat Keterangan', 'Surat Keterangan Kerja', 'Surat Peringatan', 'Surat Kontrak']))
    <div class="letter-title">
        <div class="name">{{ $letter->type }}</div>
        <div class="number">Nomor: {{ $letter->reference_number }}</div>
    </div>
    @endif

    {{-- ===== Isi surat (mendukung konten HTML dari editor maupun teks lama) ===== --}}
    <div class="content">
        @if($letter->content && preg_match('/<\w+[^>]*>/', $letter->content))
            {!! $letter->content !!}
        @else
            {!! nl2br(e($letter->content)) !!}
        @endif
    </div>

    {{-- ===== Tanda tangan (satu-satunya blok tanda tangan; jangan tulis ulang di isi surat) ===== --}}
    <table class="signature-table">
        <tr>
            <td style="width: 55%;"></td>
            <td class="signature-cell">
                <p style="margin: 0 0 2px 0;">Hormat kami,</p>
                <p style="margin: 0;"><strong>{{ $settings->company_name ?? '' }}</strong></p>
                <div class="signature-space"></div>
                <p class="signature-name">{{ $settings->leader_name ?? ($letter->creator->name ?? '') }}</p>
                <p class="signature-role">Direktur</p>
            </td>
        </tr>
    </table>

</body>
</html>
