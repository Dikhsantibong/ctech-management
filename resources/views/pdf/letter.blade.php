<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $letter->reference_number }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            font-size: 14px;
            line-height: 1.6;
            margin: 40px 50px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 30px;
            position: relative;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #2563eb;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 12px;
        }
        .header-line {
            border-bottom: 1px solid #000;
            margin-top: 2px;
            width: 100%;
        }
        .meta-info {
            margin-bottom: 30px;
            display: table;
            width: 100%;
        }
        .meta-left {
            display: table-cell;
            width: 60%;
        }
        .meta-right {
            display: table-cell;
            width: 40%;
            text-align: right;
        }
        table.meta-table {
            border-collapse: collapse;
        }
        table.meta-table td {
            padding: 2px 10px 2px 0;
            vertical-align: top;
        }
        .content {
            text-align: justify;
            margin-bottom: 50px;
            min-height: 400px;
            white-space: pre-wrap;
        }
        .signature {
            float: right;
            width: 300px;
            text-align: center;
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
            padding-top: 10px;
        }
    </style>
</head>
<body>
    @php
        $settings = \App\Models\CompanySetting::first();
    @endphp
    <div class="header">
        <table style="width: 100%; text-align: center; margin-bottom: 5px;">
            <tr>
                <td style="width: 15%; text-align: left; vertical-align: middle;">
                    <img src="{{ public_path('letter/main-logo.png') }}" style="max-height: 80px;" alt="Logo">
                </td>
                <td style="width: 85%; text-align: center; vertical-align: middle;">
                    <h1 style="margin: 0; font-size: 22px; color: #2563eb; letter-spacing: 1px;">{{ $settings->company_name ?? 'PT KREATIF TEKNOLOGI MAJU BERSAMA' }}</h1>
                    <p style="margin: 5px 0 0 0;">{{ $settings->address ?? 'Gedung C-Tech Lantai 5, Jl. Teknologi No. 99, Jakarta Selatan' }}</p>
                    <p style="margin: 2px 0 0 0;">Telp: {{ $settings->phone ?? '(021) 1234567' }} | Email: {{ $settings->email ?? 'info@ctech.com' }} | Web: {{ $settings->website ?? 'www.ctech.com' }}</p>
                </td>
            </tr>
        </table>
        <div class="header-line"></div>
    </div>

    <div class="meta-info">
        <div class="meta-left">
            <table class="meta-table">
                <tr>
                    <td><strong>Nomor</strong></td>
                    <td>:</td>
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
        </div>
        <div class="meta-right">
            Jakarta, {{ \Carbon\Carbon::parse($letter->letter_date ?? $letter->created_at)->translatedFormat('d F Y') }}<br><br>
            Kepada Yth.<br>
            <strong>{{ $letter->recipient }}</strong><br>
            di Tempat
        </div>
    </div>

    <div style="text-align: center; margin-bottom: 20px; font-weight: bold; text-decoration: underline; text-transform: uppercase;">
        {{ $letter->type }}
    </div>

    <div class="content">
{{ $letter->content }}
    </div>

    <div class="signature">
        <p>Hormat Kami,</p>
        <div class="signature-space"></div>
        <p style="font-weight: bold; text-decoration: underline; margin-bottom: 0;">{{ $settings->leader_name ?? $letter->creator->name }}</p>
        <p style="margin-top: 5px;">Direktur</p>
    </div>

</body>
</html>
