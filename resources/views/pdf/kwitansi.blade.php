<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kwitansi {{ $kwitansi_number }}</title>
    <style>
        @page {
            margin: 20px 25px; /* Dompdf page margins */
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background: #fff;
        }
        .page {
            position: relative;
        }
        .accent-bar {
            position: absolute;
            top: -20px;
            left: -25px;
            right: -25px;
            height: 6px;
            background: #155EEF;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table {
            margin-top: 5px;
        }
        .header-table td {
            vertical-align: middle;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
            text-transform: uppercase;
        }
        .company-detail {
            font-size: 9px;
            color: #4b5563;
            margin-top: 2px;
            line-height: 1.3;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: 800;
            color: #155EEF;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }
        .invoice-number {
            font-size: 10px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 15px 0;
        }
        
        /* Kwitansi Body */
        .kwitansi-body {
            margin-top: 10px;
            width: 100%;
        }
        .kwitansi-body td {
            padding: 8px 8px;
            vertical-align: top;
            font-size: 12px;
        }
        .label-col {
            width: 25%;
            font-weight: bold;
            color: #4b5563;
        }
        .colon-col {
            width: 3%;
            font-weight: bold;
        }
        .value-col {
            width: 72%;
            border-bottom: 1px dotted #ccc;
        }
        
        .terbilang-box {
            background-color: #f3f4f6;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-style: italic;
            color: #1f2937;
            border-left: 4px solid #155EEF;
            display: inline-block;
            margin-bottom: 2px;
        }

        .amount-display {
            font-size: 18px;
            font-weight: 800;
            color: #111827;
            margin-top: 5px;
            background-color: #f8fafc;
            padding: 10px 15px;
            border: 2px solid #e2e8f0;
            display: inline-block;
            border-radius: 6px;
        }

        /* Signatures */
        .signature-table {
            margin-top: 15px;
            width: 100%;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            font-size: 11px;
        }
        .sign-area {
            height: 50px;
        }
        .sign-name {
            font-weight: bold;
            text-decoration: underline;
        }
        .sign-title {
            color: #6b7280;
            font-size: 10px;
            margin-top: 2px;
        }

        .footer {
            margin-top: 20px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="accent-bar"></div>
    <div class="page">
        {{-- Header --}}
        <table class="header-table">
            <tr>
                @if(!empty($logo))
                <td style="width: 62px; vertical-align: middle;">
                    <img src="{{ $logo }}" style="width: 52px;" alt="Logo">
                </td>
                @endif
                <td style="vertical-align: middle; {{ !empty($logo) ? 'padding-left: 12px;' : '' }}">
                    <div class="company-name">{{ $settings->company_name ?? 'PT KREATIF TEKNOLOGI MAJU BERSAMA' }}</div>
                    @if(!empty($settings->address))
                        <div class="company-detail">{{ $settings->address }}</div>
                    @endif
                    <div class="company-detail">
                        @if(!empty($settings->phone)) Telp: {{ $settings->phone }} @endif
                        @if(!empty($settings->email)) &nbsp;|&nbsp; {{ $settings->email }} @endif
                        @if(!empty($settings->website)) &nbsp;|&nbsp; {{ $settings->website }} @endif
                    </div>
                </td>
                <td style="width: 40%; text-align: right; vertical-align: middle;">
                    <div class="invoice-title">KWITANSI</div>
                    <div class="invoice-number">NO: {{ $kwitansi_number }}</div>
                </td>
            </tr>
        </table>
        
        <div class="divider"></div>

        {{-- Body Kwitansi --}}
        <table class="kwitansi-body">
            <tr>
                <td class="label-col">Sudah Terima Dari</td>
                <td class="colon-col">:</td>
                <td class="value-col"><strong>{{ $invoice->client_name }}</strong></td>
            </tr>
            <tr>
                <td class="label-col">Banyaknya Uang</td>
                <td class="colon-col">:</td>
                <td class="value-col" style="border-bottom: none;">
                    <div class="terbilang-box">
                        # {{ $invoice->terbilang }} #
                    </div>
                </td>
            </tr>
            <tr>
                <td class="label-col">Untuk Pembayaran</td>
                <td class="colon-col">:</td>
                <td class="value-col">
                    Tagihan Invoice {{ $invoice->invoice_number }} 
                    <br>
                    <span style="font-size: 11px; color: #4b5563; line-height: 1.6;">
                        @foreach($invoice->items as $item)
                            - {{ $item->description }}<br>
                        @endforeach
                    </span>
                </td>
            </tr>
        </table>

        <div style="margin-top: 20px;">
            <div class="amount-display">
                Rp {{ number_format($invoice->total, 0, ',', '.') }}
            </div>
        </div>

        {{-- Signatures --}}
        <table class="signature-table">
            <tr>
                <td></td>
                <td>
                    {{ $settings->city ?? 'Kendari' }}, {{ \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y') }}<br>
                    Penerima,
                    <div class="sign-area"></div>
                    <div class="sign-name">{{ $settings->leader_name ?? 'Manajemen' }}</div>
                    <div class="sign-title">{{ $settings->company_name ?? 'PT Kreatif Teknologi Maju Bersama' }}</div>
                </td>
            </tr>
        </table>

        <div class="footer">
            Dokumen ini diterbitkan secara elektronik dan sah sebagai bukti penerimaan pembayaran.
        </div>
    </div>
</body>
</html>
