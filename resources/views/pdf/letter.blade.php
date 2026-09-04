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

        /* ===== Kop Surat (Modern Tech Corporate) ===== */
        .letterhead {
            width: 100%;
            border-collapse: collapse;
        }
        .lh-logo-cell {
            width: 66px;
            vertical-align: middle;
        }
        .lh-brand-cell {
            vertical-align: middle;
            padding-left: 12px;
        }
        .lh-name {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 18pt;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            margin: 0;
            line-height: 1.05;
        }
        .lh-tagline {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 7pt;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #2563eb;
            margin: 4px 0 0 0;
        }
        .lh-contact-cell {
            vertical-align: middle;
            text-align: right;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 8pt;
            color: #475569;
            line-height: 1.55;
        }
        .lh-contact-cell p {
            margin: 0;
        }
        .lh-contact-cell .lh-c-label {
            color: #94a3b8;
            font-weight: bold;
        }
        /* Accent bar dua warna + hairline */
        .lh-bar {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        .lh-bar td {
            height: 4px;
            padding: 0;
            font-size: 0;
            line-height: 0;
        }
        .lh-bar-accent {
            width: 84px;
            background-color: #22d3ee;
        }
        .lh-bar-primary {
            background-color: #2563eb;
        }
        .lh-subrule {
            border-bottom: 0.75px solid #e2e8f0;
            margin-top: 3px;
            margin-bottom: 20px;
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
            font-family: Helvetica, Arial, sans-serif;
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
            font-family: Helvetica, Arial, sans-serif;
            font-size: 30pt;
            font-weight: bold;
            letter-spacing: 10px;
            color: #1e3a8a;
            white-space: nowrap;
            line-height: 2.6;
            text-align: center;
            margin: 0;
        }

        /* ===== Footer kode dokumen (di dalam margin bawah) ===== */
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
        // Dokumen dianggap resmi hanya setelah diverifikasi Direktur Utama
        $isDraft = empty($isVerified ?? false);
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
            @if(!empty($verifierName))
                Diverifikasi &amp; disahkan oleh <strong>{{ $verifierName }}</strong> (Direktur Utama){{ !empty($verifiedAt) ? ' pada '.$verifiedAt : '' }}.
                <br>
            @endif
            Dokumen ini dihasilkan oleh sistem informasi {{ $settings->company_name ?? 'CTECH' }}. Keabsahan dokumen mensyaratkan tanda tangan pejabat berwenang dan cap resmi perusahaan.
            <br>
            Kode Dokumen: <span class="verif-code">{{ $verificationCode ?? '-' }}</span> &nbsp;&bull;&nbsp; untuk pengecekan keaslian arsip @if(!empty($printedAt)) &nbsp;&bull;&nbsp; Dicetak: {{ $printedAt }} @endif
        </div>
    @endif

    {{-- ===== Kop Surat (Modern Tech Corporate) ===== --}}
    <table class="letterhead">
        <tr>
            @if(!empty($logo))
                <td class="lh-logo-cell">
                    <img src="{{ $logo }}" style="width: 60px;" alt="Logo">
                </td>
            @endif
            <td class="lh-brand-cell" @if(empty($logo)) style="padding-left: 0;" @endif>
                <p class="lh-name">{{ $settings->company_name ?? 'PT KREATIF TEKNOLOGI MAJU BERSAMA' }}</p>
                <p class="lh-tagline">Technology &bull; Digital &bull; Creative Solutions</p>
            </td>
            <td class="lh-contact-cell">
                @if(!empty($settings->address))<p>{{ $settings->address }}</p>@endif
                @if(!empty($settings->phone))<p><span class="lh-c-label">T</span> {{ $settings->phone }}</p>@endif
                @if(!empty($settings->email))<p><span class="lh-c-label">E</span> {{ $settings->email }}</p>@endif
                @if(!empty($settings->website))<p><span class="lh-c-label">W</span> {{ $settings->website }}</p>@endif
            </td>
        </tr>
    </table>
    <table class="lh-bar">
        <tr>
            <td class="lh-bar-accent"></td>
            <td class="lh-bar-primary"></td>
        </tr>
    </table>
    <div class="lh-subrule"></div>

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
            <td style="width: 55%; vertical-align: bottom;"></td>
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
