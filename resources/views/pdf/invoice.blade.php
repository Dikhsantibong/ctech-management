<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.5;
        }
        .accent-bar {
            height: 8px;
            background-color: #1e40af;
        }
        .page {
            padding: 36px 48px 30px 48px;
        }

        /* ===== Header ===== */
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-name {
            font-size: 15px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .company-detail {
            font-size: 9.5px;
            color: #6b7280;
            margin-top: 2px;
        }
        .invoice-title {
            font-size: 30px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 3px;
            line-height: 1.1;
        }
        .invoice-number {
            font-size: 11px;
            color: #6b7280;
            margin-top: 4px;
        }
        .status-badge {
            display: inline-block;
            margin-top: 8px;
            padding: 3px 14px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-paid      { background-color: #dcfce7; color: #15803d; }
        .status-overdue   { background-color: #fee2e2; color: #b91c1c; }
        .status-sent      { background-color: #dbeafe; color: #1d4ed8; }
        .status-draft     { background-color: #f3f4f6; color: #4b5563; }

        .divider {
            border-bottom: 2px solid #1e40af;
            margin: 18px 0 0 0;
        }

        /* ===== Meta / Billed To ===== */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 22px;
        }
        .meta-label {
            font-size: 8.5px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
            margin-bottom: 4px;
        }
        .client-name {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
        }
        .meta-box {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px 16px;
        }
        .meta-box table {
            border-collapse: collapse;
        }
        .meta-box td {
            padding: 2px 0;
            font-size: 10.5px;
        }
        .meta-box .k {
            color: #6b7280;
            padding-right: 18px;
        }
        .meta-box .v {
            font-weight: bold;
            text-align: right;
        }
        .due-highlight { color: #b91c1c; }

        /* ===== Items ===== */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 26px;
        }
        .items-table thead th {
            background-color: #1e40af;
            color: #ffffff;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 9px 12px;
            text-align: left;
        }
        .items-table thead th:first-child { border-radius: 5px 0 0 5px; }
        .items-table thead th:last-child  { border-radius: 0 5px 5px 0; }
        .items-table tbody td {
            padding: 9px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10.5px;
        }
        .items-table tbody tr.alt td {
            background-color: #f8fafc;
        }
        .text-right  { text-align: right; }
        .text-center { text-align: center; }
        .col-no    { width: 5%; }
        .col-qty   { width: 10%; }
        .col-price { width: 20%; }
        .col-total { width: 22%; }

        /* ===== Totals & Payment ===== */
        .bottom-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .payment-box {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-left: 3px solid #1e40af;
            border-radius: 4px;
            padding: 12px 16px;
        }
        .payment-box h4 {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1e40af;
            margin-bottom: 6px;
        }
        .payment-box p {
            font-size: 10px;
            margin: 2px 0;
            color: #374151;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 6px 12px;
            font-size: 10.5px;
        }
        .totals-table .label { color: #6b7280; }
        .totals-table .value { text-align: right; font-weight: bold; }
        .grand-total td {
            background-color: #1e40af;
            color: #ffffff;
            font-size: 12.5px;
            font-weight: bold;
            padding: 10px 12px;
        }
        .grand-total td:first-child { border-radius: 5px 0 0 5px; }
        .grand-total td:last-child  { border-radius: 0 5px 5px 0; }

        /* ===== Notes & Footer ===== */
        .notes {
            margin-top: 28px;
            font-size: 9.5px;
            color: #6b7280;
        }
        .notes strong { color: #374151; }
        .footer {
            margin-top: 30px;
            border-top: 1px solid #e5e7eb;
            padding-top: 14px;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
        }
        .footer .thanks {
            font-size: 11px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 4px;
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
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-number">{{ $invoice->invoice_number }}</div>
                    @php
                        $statusClass = [
                            'Paid' => 'status-paid',
                            'Overdue' => 'status-overdue',
                            'Sent' => 'status-sent',
                        ][$invoice->status] ?? 'status-draft';
                        $statusLabel = [
                            'Paid' => 'Lunas',
                            'Overdue' => 'Jatuh Tempo',
                            'Sent' => 'Terkirim',
                            'Draft' => 'Draft',
                        ][$invoice->status] ?? $invoice->status;
                    @endphp
                    <span class="status-badge {{ $statusClass }}">{{ $statusLabel }}</span>
                </td>
            </tr>
        </table>
        <div class="divider"></div>

        {{-- Billed To & Invoice Meta --}}
        <table class="meta-table">
            <tr>
                <td style="width: 55%; vertical-align: top;">
                    <div class="meta-label">Ditagihkan Kepada</div>
                    <div class="client-name">{{ $invoice->client_name }}</div>
                </td>
                <td style="width: 45%; vertical-align: top;">
                    <div class="meta-box">
                        <table style="width: 100%;">
                            <tr>
                                <td class="k">No. Invoice</td>
                                <td class="v">{{ $invoice->invoice_number }}</td>
                            </tr>
                            <tr>
                                <td class="k">Tanggal Terbit</td>
                                <td class="v">{{ date('d F Y', strtotime($invoice->created_at)) }}</td>
                            </tr>
                            <tr>
                                <td class="k">Jatuh Tempo</td>
                                <td class="v due-highlight">{{ date('d F Y', strtotime($invoice->due_date)) }}</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Items --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th class="col-no text-center">No</th>
                    <th>Deskripsi</th>
                    <th class="col-qty text-center">Qty</th>
                    <th class="col-price text-right">Harga Satuan</th>
                    <th class="col-total text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr class="{{ $loop->even ? 'alt' : '' }}">
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td>{{ $item->description }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->total, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        {{-- Payment info + Totals --}}
        <table class="bottom-table">
            <tr>
                <td style="width: 52%; vertical-align: top; padding-right: 24px;">
                    <div class="payment-box">
                        <h4>Informasi Pembayaran</h4>
                        <p><strong>Bank:</strong> {{ $settings->bank_name ?? '-' }}</p>
                        <p><strong>No. Rekening:</strong> {{ $settings->bank_account_number ?? '-' }}</p>
                        <p><strong>Atas Nama:</strong> {{ $settings->bank_account_name ?? '-' }}</p>
                    </div>
                </td>
                <td style="width: 48%; vertical-align: top;">
                    <table class="totals-table">
                        <tr>
                            <td class="label">Subtotal</td>
                            <td class="value">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                        </tr>
                        @if($invoice->tax > 0)
                        <tr>
                            <td class="label">
                                Pajak (PPN @if($invoice->subtotal > 0){{ rtrim(rtrim(number_format(($invoice->tax / $invoice->subtotal) * 100, 2, ',', '.'), '0'), ',') }}%@endif)
                            </td>
                            <td class="value">Rp {{ number_format($invoice->tax, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        <tr class="grand-total">
                            <td>TOTAL</td>
                            <td class="text-right">Rp {{ number_format($invoice->total, 0, ',', '.') }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        {{-- Notes --}}
        <div class="notes">
            <strong>Catatan:</strong>
            Mohon lakukan pembayaran sebelum tanggal jatuh tempo. Cantumkan nomor invoice pada berita transfer untuk mempermudah verifikasi pembayaran.
        </div>

        {{-- Footer --}}
        <div class="footer">
            <div class="thanks">Terima kasih atas kepercayaan Anda!</div>
            <p>Jika ada pertanyaan mengenai invoice ini, silakan hubungi kami{{ !empty($settings->phone) ? ' di ' . $settings->phone : '' }}{{ !empty($settings->email) ? ' atau melalui email ' . $settings->email : '' }}.</p>
            <p style="margin-top: 4px;">Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.</p>
        </div>

    </div>
</body>
</html>
