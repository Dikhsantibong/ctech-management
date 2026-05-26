<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 14px;
            line-height: 1.5;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 40px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
        }
        .header-left {
            display: table-cell;
            vertical-align: top;
        }
        .header-right {
            display: table-cell;
            text-align: right;
            vertical-align: top;
        }
        .title {
            font-size: 36px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .details {
            width: 100%;
            margin-bottom: 40px;
        }
        .details td {
            padding: 5px;
            vertical-align: top;
        }
        .client-info {
            width: 50%;
        }
        .invoice-info {
            width: 50%;
            text-align: right;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .items-table th, .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #555;
        }
        .items-table .text-right {
            text-align: right;
        }
        .items-table .text-center {
            text-align: center;
        }
        .totals-table {
            width: 50%;
            float: right;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .totals-table .total-row td {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #333;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .payment-info {
            margin-top: 40px;
            padding: 20px;
            background-color: #f0f7ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
        }
        .payment-info h4 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .payment-info p {
            margin: 4px 0;
            font-size: 13px;
            color: #333;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="header-left">
                <h1 style="margin:0; color:#2563eb;">C-TECH</h1>
                <p style="margin:5px 0 0 0; color:#666;">Technology Solutions</p>
            </div>
            <div class="header-right">
                <div class="title">INVOICE</div>
                <p style="margin:0;"># {{ $invoice->invoice_number }}</p>
            </div>
        </div>

        <table class="details">
            <tr>
                <td class="client-info">
                    <p style="color:#777; margin-bottom:5px; font-size:12px; text-transform:uppercase;">Billed To:</p>
                    <h3 style="margin:0 0 5px 0;">{{ $invoice->client_name }}</h3>
                </td>
                <td class="invoice-info">
                    <p style="margin:0 0 5px 0;"><strong>Date Issued:</strong> {{ date('d F Y', strtotime($invoice->created_at)) }}</p>
                    <p style="margin:0;"><strong>Due Date:</strong> <span style="color:#dc2626;">{{ date('d F Y', strtotime($invoice->due_date)) }}</span></p>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right font-medium">Rp {{ number_format($item->total, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="clearfix">
            <table class="totals-table">
                <tr>
                    <td>Subtotal</td>
                    <td class="text-right">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>Pajak @if($invoice->subtotal > 0)({{ round(($invoice->tax / $invoice->subtotal) * 100) }}%)@endif</td>
                    <td class="text-right">Rp {{ number_format($invoice->tax, 0, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td>Grand Total</td>
                    <td class="text-right">Rp {{ number_format($invoice->total, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        <div class="payment-info">
            <h4>Informasi Pembayaran</h4>
            <p><strong>Bank:</strong> Bank Sultra</p>
            <p><strong>No. Rekening:</strong>205.01.04.000531</p>
            <p><strong>Atas Nama:</strong> PT KREATIF TEKNOLOGI MAJU BERSAMA</p>
        </div>

        <div class="footer">
            <p>Terima kasih atas kepercayaan Anda!</p>
            <p style="margin-top:10px;">Jika ada pertanyaan mengenai invoice ini, silakan hubungi tim kami.</p>
        </div>
    </div>
</body>
</html>
