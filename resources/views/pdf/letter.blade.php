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

        /* ===== Watermark DRAFT (dokumen belum disahkan) ===== */
        .wm-draft {
            position: fixed;
            top: 34%;
            left: 0;
            width: 100%;
            text-align: center;
            transform: rotate(-45deg);
            transform-origin: center center;
            z-index: -1;
        }
        .wm-draft .wm-word {
            font-size: 150pt;
            font-weight: bold;
            letter-spacing: 12px;
            color: #dc2626;
            opacity: 0.09;
            margin: 0;
        }
        .wm-draft .wm-sub {
            font-size: 20pt;
            letter-spacing: 8px;
            color: #dc2626;
            opacity: 0.11;
            margin: 4px 0 0 0;
            text-transform: uppercase;
        }

        /* ===== Watermark keamanan CTECH (dokumen final/resmi) ===== */
        .wm-final {
            position: fixed;
            top: -15%;
            left: -20%;
            width: 140%;
            height: 130%;
            transform: rotate(-30deg);
            transform-origin: center center;
            opacity: 0.05;
            z-index: -1;
        }
        .wm-final .wm-line {
            font-size: 30pt;
            font-weight: bold;
            letter-spacing: 10px;
            color: #1e3a8a;
            white-space: nowrap;
            line-height: 2.6;
            text-align: center;
            margin: 0;
        }

        /* ===== Stempel / cap resmi ===== */
        .official-stamp {
            width: 118px;
            height: 118px;
            border: 2.5px solid #1e3a8a;
            border-radius: 50%;
            text-align: center;
            color: #1e3a8a;
            transform: rotate(-14deg);
            padding: 0;
            margin: 6px 0 0 8px;
            opacity: 0.9;
        }
        .official-stamp .stamp-inner {
            border: 1px solid #1e3a8a;
            border-radius: 50%;
            width: 104px;
            height: 104px;
            margin: 5px auto;
            padding-top: 20px;
        }
        .official-stamp .stamp-top {
            font-size: 6.5pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0;
        }
        .official-stamp .stamp-main {
            font-size: 12pt;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 6px 0 4px 0;
        }
        .official-stamp .stamp-code {
            font-size: 6pt;
            font-family: 'Courier New', monospace;
            letter-spacing: 0.5px;
            margin: 0;
        }
        .official-stamp .stamp-bottom {
            font-size: 5.5pt;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 4px 0 0 0;
        }

        /* ===== Footer verifikasi (di dalam margin bawah) ===== */
        .doc-footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -10mm;
            text-align: center;
            font-size: 7pt;
            color: #6b7280;
            padding-top: 3px;
            border-top: 0.5px solid #d1d5db;
        }
        .doc-footer .verif-code {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            letter-spacing: 1px;
            color: #1e3a8a;
        }
        .doc-footer.footer-draft {
            color: #dc2626;
            border-top-color: #fca5a5;
            font-weight: bold;
        }
    </style>
</head>
<body>

    @php
        $isDraft = ($letter->status ?? 'Draft') !== 'Final';
    @endphp

    {{-- ===== Watermark ===== --}}
    @if($isDraft)
        <div class="wm-draft">
            <p class="wm-word">DRAFT</p>
            <p class="wm-sub">Belum Disahkan</p>
        </div>
    @else
        <div class="wm-final">
            @for($i = 0; $i < 14; $i++)
                <p class="wm-line">CTECH &nbsp;&bull;&nbsp; CTECH &nbsp;&bull;&nbsp; CTECH &nbsp;&bull;&nbsp; CTECH &nbsp;&bull;&nbsp; CTECH</p>
            @endfor
        </div>
    @endif

    {{-- ===== Footer verifikasi (muncul di setiap halaman) ===== --}}
    @if($isDraft)
        <div class="doc-footer footer-draft">
            DOKUMEN DRAFT &mdash; belum disahkan dan tidak berlaku sebagai dokumen resmi.
            @if(!empty($isPreview)) Pratinjau sebelum surat dibuat. @endif
        </div>
    @else
        <div class="doc-footer">
            Dokumen ini diterbitkan secara elektronik oleh {{ $settings->company_name ?? 'CTECH' }} dan sah tanpa tanda tangan basah.
            Kode Verifikasi: <span class="verif-code">{{ $verificationCode ?? '-' }}</span>
            @if(!empty($printedAt)) &nbsp;&bull;&nbsp; Dicetak: {{ $printedAt }} @endif
        </div>
    @endif

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
            <td style="width: 55%; vertical-align: bottom;">
                @if(!$isDraft)
                    <div class="official-stamp">
                        <div class="stamp-inner">
                            <p class="stamp-top">Dokumen Resmi</p>
                            <p class="stamp-main">CTECH</p>
                            <p class="stamp-code">{{ $verificationCode ?? '' }}</p>
                            <p class="stamp-bottom">Terverifikasi</p>
                        </div>
                    </div>
                @endif
            </td>
            <td class="signature-cell">
                <p style="margin: 0 0 2px 0;">Hormat kami,</p>
                <p style="margin: 0;"><strong>{{ $settings->company_name ?? '' }}</strong></p>
                <div class="signature-space"></div>
                <p class="signature-name">{{ $settings->leader_name ?? ($letter->creator->name ?? '') }}</p>
                <p class="signature-role">Direktur Utama</p>
            </td>
        </tr>
    </table>

</body>
</html>
