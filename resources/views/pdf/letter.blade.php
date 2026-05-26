<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $letter->reference_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 18mm 18mm 20mm 18mm;
        }
        *, *::before, *::after { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            font-size: 12px;
            line-height: 1.45;
            margin: 0; /* page margins handled by @page */
            -webkit-print-color-adjust: exact;
        }
        .page {
            padding: 0; /* content sits within the A4 margins */
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 8px;
            margin-bottom: 18px;
            position: relative;
        }
        .header h1 {
            margin: 0;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1e40af;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 12px;
        }
        .header-line {
            border-bottom: 1px solid #000;
            margin-top: 6px;
            width: 100%;
        }
        .meta-info { margin-bottom: 14px; width: 100%; }
        table.meta-table { width: 100%; border-collapse: collapse; }
        .meta-left-cell { width: 60%; vertical-align: top; padding-right: 10px; }
        .meta-right-cell { width: 40%; vertical-align: top; text-align: right; }
        .meta-inner td { padding: 2px 6px; vertical-align: top; }
        .content {
            text-align: left;
            margin-bottom: 24px;
            white-space: normal;
            widows: 2; /* avoid lonely lines */
            orphans: 2;
            font-size: 13px;
            line-height: 1.5;
        }
        .signature {
            display: block;
            width: 36%;
            margin-top: 30px;
            margin-left: auto;
            text-align: center;
            clear: both;
        }
        .signature-space {
            height: 100px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 8px;
        }
    </style>
</head>
<body>
    <div class="page">
    @php
        $settings = \App\Models\CompanySetting::first();
    @endphp
    <div class="header">
        <table style="width: 100%; text-align: center; margin-bottom: 5px;">
            <tr>
                <td style="width: 15%; text-align: left; vertical-align: middle;">
                    <img src="{{ public_path('letter/main-logo.png') }}" style="max-height: 60px;" alt="Logo">
                </td>
                <td style="width: 70%; text-align: center; vertical-align: middle;">
                    <h1>{{ $settings->company_name ?? 'PT KREATIF TEKNOLOGI MAJU BERSAMA' }}</h1>
                    <p style="margin: 4px 0 0 0; font-size:11px;">{{ $settings->address ?? 'Gedung C-Tech Lantai 5, Jl. Teknologi No. 99, Jakarta Selatan' }}</p>
                    <p style="margin: 2px 0 0 0; font-size:11px;">Telp: {{ $settings->phone ?? '(021) 1234567' }} | Email: {{ $settings->email ?? 'info@ctech.com' }} | Web: {{ $settings->website ?? 'www.ctech.com' }}</p>
                </td>
                <td style="width: 15%; text-align: right; vertical-align: middle;">
                    <!-- reserved for optional right-aligned info -->
                </td>
            </tr>
        </table>
        <div class="header-line"></div>
    </div>

    <div class="meta-info">
        <table class="meta-table">
            <tr>
                <td class="meta-left-cell">
                    <table class="meta-inner">
                        <tr>
                            <td style="width:75px;"><strong>Nomor</strong></td>
                            <td style="width:8px;">:</td>
                            <td>{{ $letter->reference_number }}</td>
                        </tr>
                        <tr>
                            <td><strong>Perihal</strong></td>
                            <td>:</td>
                            <td>{{ $letter->subject }}</td>
                        </tr>
                        <tr>
                            <td><strong>Sifat</strong></td>
                            <td>:</td>
                            <td>{{ $letter->sifat }}</td>
                        </tr>
                    </table>
                </td>
                <td class="meta-right-cell">
                    Kendari, {{ \Carbon\Carbon::parse($letter->letter_date ?? $letter->created_at)->translatedFormat('d F Y') }}<br><br>
                    Kepada Yth.<br>
                    <strong>{{ $letter->recipient }}</strong><br>
                    di Tempat
                </td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-bottom: 20px; font-weight: bold; text-decoration: underline; text-transform: uppercase;">
        {{ $letter->type }}
    </div>

    <div class="content">
        {!! nl2br(e($letter->content)) !!}
    </div>

    <div class="signature">
        <p>Hormat Kami,</p>
        <div class="signature-space"></div>
        <p style="font-weight: bold; text-decoration: underline; margin-bottom: 0;">{{ $settings->leader_name ?? $letter->creator->name }}</p>
        <p style="margin-top: 5px;">Direktur</p>
    </div>

    </div>
</body>
</html>
