<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Penawaran {{ $quotation->quotation_number }}</title>
    @php
        // Dokumen dianggap resmi hanya setelah diverifikasi Direktur Utama
        $isDraft = empty($isVerified ?? false);
        $grouped = $quotation->items->groupBy(fn ($i) => $i->category ?: '');
        $hasCategories = $quotation->items->contains(fn ($i) => ! empty($i->category));
        $sectionLetters = range('A', 'Z');
        $afterDiscount = (float) $quotation->subtotal - (float) $quotation->discount;
        $fmt = fn ($n) => 'Rp ' . number_format((float) $n, 0, ',', '.');
    @endphp
    <style>
        @page {
            size: A4 portrait;
            margin: 16mm 18mm 20mm 18mm;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            color: #1f2937;
            font-size: 10.5px;
            line-height: 1.5;
            margin: 0;
        }

        /* ===== Kop Surat ===== */
        .letterhead { width: 100%; border-collapse: collapse; }
        .lh-logo-cell { width: 62px; vertical-align: middle; }
        .lh-brand-cell { vertical-align: middle; padding-left: 12px; }
        .lh-name {
            font-size: 16px; font-weight: bold; color: #0f172a;
            letter-spacing: 0.3px; text-transform: uppercase; margin: 0; line-height: 1.05;
        }
        .lh-tagline {
            font-size: 7px; letter-spacing: 2.5px; text-transform: uppercase;
            color: #2563eb; margin: 3px 0 0 0;
        }
        .lh-contact-cell {
            vertical-align: middle; text-align: right; font-size: 8px; color: #475569; line-height: 1.55;
        }
        .lh-contact-cell p { margin: 0; }
        .lh-contact-cell .lh-c-label { color: #94a3b8; font-weight: bold; }
        .lh-bar { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .lh-bar td { height: 4px; padding: 0; font-size: 0; line-height: 0; }
        .lh-bar-accent { width: 84px; background-color: #22d3ee; }
        .lh-bar-primary { background-color: #2563eb; }
        .lh-subrule { border-bottom: 0.75px solid #e2e8f0; margin-top: 3px; margin-bottom: 18px; }

        /* ===== Meta / Judul ===== */
        .doc-title {
            text-align: center; font-size: 14px; font-weight: bold; color: #0f172a;
            text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 2px 0;
        }
        .doc-number { text-align: center; font-size: 10px; color: #6b7280; margin: 0 0 16px 0; }
        .date-line { text-align: right; margin-bottom: 8px; }
        table.meta { border-collapse: collapse; margin-bottom: 4px; }
        table.meta td { vertical-align: top; padding: 1px 0; }
        .meta-label { width: 90px; }
        .meta-colon { width: 10px; }
        .recipient-block { margin: 10px 0 14px 0; }
        .intro { text-align: justify; margin-bottom: 14px; }

        /* ===== RAB ===== */
        .section-heading {
            font-size: 11px; font-weight: bold; color: #1e40af; text-transform: uppercase;
            letter-spacing: 0.5px; margin: 6px 0 6px 0;
        }
        .rab-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
        .rab-table thead th {
            background-color: #1e40af; color: #fff; font-size: 8.5px; text-transform: uppercase;
            letter-spacing: 0.5px; padding: 7px 8px; text-align: left; border: 0.5px solid #1e40af;
        }
        .rab-table tbody td {
            padding: 6px 8px; border: 0.5px solid #e5e7eb; font-size: 10px; vertical-align: top;
        }
        .rab-table tbody tr.alt td { background-color: #f8fafc; }
        .rab-cat td {
            background-color: #eef2ff; font-weight: bold; color: #1e3a8a; font-size: 10px; padding: 6px 8px;
        }
        .rab-subtotal td {
            font-weight: bold; background-color: #f1f5f9; font-size: 10px; padding: 6px 8px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .col-no { width: 5%; }
        .col-unit { width: 10%; }
        .col-qty { width: 9%; }
        .col-price { width: 18%; }
        .col-total { width: 20%; }

        /* ===== Totals ===== */
        .totals-wrap { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .totals-table { width: 100%; border-collapse: collapse; }
        .totals-table td { padding: 5px 10px; font-size: 10.5px; }
        .totals-table .label { color: #6b7280; text-align: right; }
        .totals-table .value { text-align: right; font-weight: bold; width: 130px; }
        .grand-total td {
            background-color: #1e40af; color: #fff; font-size: 12px; font-weight: bold; padding: 9px 10px;
        }
        .terbilang {
            margin-top: 8px; font-size: 9.5px; font-style: italic; color: #374151;
            background-color: #f8fafc; border-left: 3px solid #1e40af; padding: 7px 10px;
        }

        /* ===== Terms & signature ===== */
        .terms-title {
            font-size: 10.5px; font-weight: bold; color: #0f172a; margin: 18px 0 4px 0;
            text-transform: uppercase; letter-spacing: 0.5px;
        }
        .terms-body { text-align: justify; white-space: pre-line; font-size: 10px; }
        .notes-box { margin-top: 12px; font-size: 9.5px; color: #6b7280; }
        .signature-table { width: 100%; border-collapse: collapse; margin-top: 26px; page-break-inside: avoid; }
        .signature-cell { width: 45%; text-align: center; vertical-align: top; }
        .signature-space { height: 70px; }
        .signature-name { font-weight: bold; text-decoration: underline; margin: 0; }

        /* ===== Watermark ===== */
        .wm-draft {
            position: fixed; top: 34%; left: 0; width: 100%; text-align: center;
            transform: rotate(-45deg); transform-origin: center center; z-index: -1;
        }
        .wm-draft .wm-word { font-size: 150pt; font-weight: bold; letter-spacing: 12px; color: #dc2626; opacity: 0.08; margin: 0; }
        .wm-draft .wm-sub { font-size: 18pt; letter-spacing: 8px; color: #dc2626; opacity: 0.1; margin: 4px 0 0 0; text-transform: uppercase; }
        .wm-final {
            position: fixed; top: -15%; left: -20%; width: 140%; height: 130%;
            transform: rotate(-30deg); transform-origin: center center; opacity: 0.045; z-index: -1;
        }
        .wm-final .wm-line { font-size: 30pt; font-weight: bold; letter-spacing: 10px; color: #1e3a8a; white-space: nowrap; line-height: 2.6; text-align: center; margin: 0; }

        /* ===== Footer ===== */
        .doc-footer {
            position: fixed; left: 0; right: 0; bottom: -12mm; text-align: center;
            font-size: 7pt; color: #6b7280; padding-top: 3px; border-top: 0.5px solid #d1d5db;
        }
        .doc-footer .code { font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 1px; color: #1e40af; }
        .doc-footer.footer-draft { color: #dc2626; border-top-color: #fca5a5; font-weight: bold; }
    </style>
</head>
<body>

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

    {{-- ===== Footer ===== --}}
    @if($isDraft)
        <div class="doc-footer footer-draft">
            DOKUMEN DRAFT &mdash; belum disahkan dan tidak berlaku sebagai penawaran resmi.
        </div>
    @else
        <div class="doc-footer">
            @if(!empty($verifierName))
                Diverifikasi &amp; disahkan oleh <strong>{{ $verifierName }}</strong> (Direktur Utama){{ !empty($verifiedAt) ? ' pada '.$verifiedAt : '' }}.
                <br>
            @endif
            Dokumen ini dihasilkan oleh sistem informasi {{ $settings->company_name ?? 'CTECH' }}. Keabsahan mensyaratkan tanda tangan pejabat berwenang dan cap resmi perusahaan.
            <br>
            Kode Dokumen: <span class="code">{{ $documentCode ?? '-' }}</span> &nbsp;&bull;&nbsp; untuk pengecekan keaslian arsip @if(!empty($printedAt)) &nbsp;&bull;&nbsp; Dicetak: {{ $printedAt }} @endif
        </div>
    @endif

    {{-- ===== Kop Surat ===== --}}
    <table class="letterhead">
        <tr>
            @if(!empty($logo))
                <td class="lh-logo-cell"><img src="{{ $logo }}" style="width: 56px;" alt="Logo"></td>
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
    <table class="lh-bar"><tr><td class="lh-bar-accent"></td><td class="lh-bar-primary"></td></tr></table>
    <div class="lh-subrule"></div>

    {{-- ===== Tanggal ===== --}}
    <div class="date-line">
        Kendari, {{ \Carbon\Carbon::parse($quotation->quotation_date ?? $quotation->created_at)->locale('id')->translatedFormat('d F Y') }}
    </div>

    {{-- ===== Nomor / Perihal / Penerima ===== --}}
    <table class="meta">
        <tr>
            <td class="meta-label">Nomor</td>
            <td class="meta-colon">:</td>
            <td>{{ $quotation->quotation_number }}</td>
        </tr>
        <tr>
            <td class="meta-label">Perihal</td>
            <td class="meta-colon">:</td>
            <td><strong>{{ $quotation->subject }}</strong></td>
        </tr>
        @if($quotation->valid_until)
        <tr>
            <td class="meta-label">Masa Berlaku</td>
            <td class="meta-colon">:</td>
            <td>s.d. {{ \Carbon\Carbon::parse($quotation->valid_until)->locale('id')->translatedFormat('d F Y') }}</td>
        </tr>
        @endif
    </table>

    <div class="recipient-block">
        Kepada Yth.<br>
        <strong>{{ $quotation->client_name }}</strong>@if($quotation->client_pic)<br>u.p. {{ $quotation->client_pic }}@endif<br>
        @if($quotation->client_address){{ $quotation->client_address }}@else di Tempat @endif
    </div>

    {{-- ===== Pengantar ===== --}}
    @if($quotation->intro)
        <div class="intro">{!! nl2br(e($quotation->intro)) !!}</div>
    @endif

    {{-- ===== RAB ===== --}}
    <div class="section-heading">Rencana Anggaran Biaya (RAB)</div>
    <table class="rab-table">
        <thead>
            <tr>
                <th class="col-no text-center">No</th>
                <th>Uraian Pekerjaan</th>
                <th class="col-unit text-center">Satuan</th>
                <th class="col-qty text-center">Volume</th>
                <th class="col-price text-right">Harga Satuan</th>
                <th class="col-total text-right">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @if($hasCategories)
                @foreach($grouped as $category => $items)
                    <tr class="rab-cat">
                        <td colspan="6">{{ $sectionLetters[$loop->index] ?? '•' }}. {{ $category !== '' ? $category : 'Lain-lain' }}</td>
                    </tr>
                    @php $catTotal = 0; @endphp
                    @foreach($items as $item)
                        @php $catTotal += (float) $item->total; @endphp
                        <tr class="{{ $loop->even ? 'alt' : '' }}">
                            <td class="text-center">{{ $loop->iteration }}</td>
                            <td>{{ $item->description }}</td>
                            <td class="text-center">{{ $item->unit ?: '-' }}</td>
                            <td class="text-center">{{ rtrim(rtrim(number_format((float) $item->quantity, 2, ',', '.'), '0'), ',') }}</td>
                            <td class="text-right">{{ $fmt($item->price) }}</td>
                            <td class="text-right">{{ $fmt($item->total) }}</td>
                        </tr>
                    @endforeach
                    <tr class="rab-subtotal">
                        <td colspan="5" class="text-right">Subtotal {{ $sectionLetters[$loop->index] ?? '' }}</td>
                        <td class="text-right">{{ $fmt($catTotal) }}</td>
                    </tr>
                @endforeach
            @else
                @foreach($quotation->items as $item)
                    <tr class="{{ $loop->even ? 'alt' : '' }}">
                        <td class="text-center">{{ $loop->iteration }}</td>
                        <td>{{ $item->description }}</td>
                        <td class="text-center">{{ $item->unit ?: '-' }}</td>
                        <td class="text-center">{{ rtrim(rtrim(number_format((float) $item->quantity, 2, ',', '.'), '0'), ',') }}</td>
                        <td class="text-right">{{ $fmt($item->price) }}</td>
                        <td class="text-right">{{ $fmt($item->total) }}</td>
                    </tr>
                @endforeach
            @endif
        </tbody>
    </table>

    {{-- ===== Totals ===== --}}
    <table class="totals-wrap">
        <tr>
            <td style="width: 50%; vertical-align: top;"></td>
            <td style="width: 50%; vertical-align: top;">
                <table class="totals-table">
                    <tr>
                        <td class="label">Subtotal</td>
                        <td class="value">{{ $fmt($quotation->subtotal) }}</td>
                    </tr>
                    @if((float) $quotation->discount > 0)
                    <tr>
                        <td class="label">Diskon</td>
                        <td class="value">- {{ $fmt($quotation->discount) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Dasar Pengenaan Pajak</td>
                        <td class="value">{{ $fmt($afterDiscount) }}</td>
                    </tr>
                    @endif
                    @if((float) $quotation->tax > 0)
                    <tr>
                        <td class="label">PPN ({{ rtrim(rtrim(number_format((float) $quotation->tax_rate, 2, ',', '.'), '0'), ',') }}%)</td>
                        <td class="value">{{ $fmt($quotation->tax) }}</td>
                    </tr>
                    @endif
                    <tr class="grand-total">
                        <td>TOTAL</td>
                        <td class="text-right">{{ $fmt($quotation->total) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <div class="terbilang"><strong>Terbilang:</strong> {{ $quotation->terbilang }}</div>

    {{-- ===== Syarat & Ketentuan ===== --}}
    @if($quotation->terms)
        <div class="terms-title">Syarat &amp; Ketentuan</div>
        <div class="terms-body">{{ $quotation->terms }}</div>
    @endif

    @if($quotation->notes)
        <div class="notes-box"><strong>Catatan:</strong> {{ $quotation->notes }}</div>
    @endif

    {{-- ===== Tanda tangan ===== --}}
    <table class="signature-table">
        <tr>
            <td style="width: 55%;"></td>
            <td class="signature-cell">
                <p style="margin: 0 0 2px 0;">Hormat kami,</p>
                <p style="margin: 0;"><strong>{{ $settings->company_name ?? '' }}</strong></p>
                <div class="signature-space"></div>
                <p class="signature-name">{{ $settings->leader_name ?? ($quotation->creator->name ?? '') }}</p>
                <p style="margin: 2px 0 0 0;">Direktur Utama</p>
            </td>
        </tr>
    </table>

</body>
</html>
