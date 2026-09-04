import { Fragment } from 'react';

interface RabItemInput {
    category?: string;
    description?: string;
    unit?: string;
    quantity: number;
    price: number;
}

export interface QuotationPreviewData {
    quotation_number?: string;
    client_name?: string;
    client_pic?: string;
    client_address?: string;
    quotation_date?: string;
    valid_until?: string;
    subject?: string;
    intro?: string;
    terms?: string;
    notes?: string;
    use_tax?: boolean;
    tax_rate?: number;
    discount?: number;
    status?: string;
    items: RabItemInput[];
}

export interface CompanySettings {
    company_name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    leader_name?: string;
}

function formatCurrency(amount: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(amount || 0));
}

function formatIndoDate(value?: string) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatQty(n: number) {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(n || 0);
}

function terbilang(value: number): string {
    const n = Math.floor(Math.abs(value || 0));
    const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    const conv = (x: number): string => {
        if (x < 12) return ' ' + satuan[x];
        if (x < 20) return conv(x - 10) + ' belas';
        if (x < 100) return conv(Math.floor(x / 10)) + ' puluh' + conv(x % 10);
        if (x < 200) return ' seratus' + conv(x - 100);
        if (x < 1000) return conv(Math.floor(x / 100)) + ' ratus' + conv(x % 100);
        if (x < 2000) return ' seribu' + conv(x - 1000);
        if (x < 1000000) return conv(Math.floor(x / 1000)) + ' ribu' + conv(x % 1000);
        if (x < 1000000000) return conv(Math.floor(x / 1000000)) + ' juta' + conv(x % 1000000);
        if (x < 1000000000000) return conv(Math.floor(x / 1000000000)) + ' milyar' + conv(x % 1000000000);
        return conv(Math.floor(x / 1000000000000)) + ' trilyun' + conv(x % 1000000000000);
    };
    if (n === 0) return 'Nol Rupiah';
    const words = conv(n).trim().replace(/\s+/g, ' ');
    return words.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Rupiah';
}

const SECTION_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function QuotationDocumentPreview({
    data,
    settings,
    creatorName,
    className,
}: {
    data: QuotationPreviewData;
    settings?: CompanySettings | null;
    creatorName?: string;
    className?: string;
}) {
    const isFinal = !!data.status && data.status !== 'Draft';
    const companyName = settings?.company_name || 'PT KREATIF TEKNOLOGI MAJU BERSAMA';
    const signerName = settings?.leader_name || creatorName || '';
    const referenceNumber = data.quotation_number || 'XXX/PNW/CTECH';

    const items = data.items || [];
    const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    const discount = Math.min(Number(data.discount) || 0, subtotal);
    const afterDiscount = subtotal - discount;
    const tax = data.use_tax ? afterDiscount * ((Number(data.tax_rate) || 0) / 100) : 0;
    const total = afterDiscount + tax;

    const hasCategories = items.some((it) => it.category);
    const groups: { category: string; items: RabItemInput[] }[] = [];
    for (const it of items) {
        const cat = it.category || '';
        let g = groups.find((x) => x.category === cat);
        if (!g) {
            g = { category: cat, items: [] };
            groups.push(g);
        }
        g.items.push(it);
    }

    const rabHeader = (
        <thead>
            <tr className="bg-[#1e40af] text-[9px] uppercase text-white">
                <th className="border border-[#1e40af] px-2 py-1.5 text-center">No</th>
                <th className="border border-[#1e40af] px-2 py-1.5 text-left">Uraian Pekerjaan</th>
                <th className="border border-[#1e40af] px-2 py-1.5 text-center">Satuan</th>
                <th className="border border-[#1e40af] px-2 py-1.5 text-center">Volume</th>
                <th className="border border-[#1e40af] px-2 py-1.5 text-right">Harga Satuan</th>
                <th className="border border-[#1e40af] px-2 py-1.5 text-right">Jumlah</th>
            </tr>
        </thead>
    );

    const itemRow = (it: RabItemInput, no: number, key: string) => (
        <tr key={key}>
            <td className="border border-slate-200 px-2 py-1 text-center">{no}</td>
            <td className="border border-slate-200 px-2 py-1">{it.description || '—'}</td>
            <td className="border border-slate-200 px-2 py-1 text-center">{it.unit || '-'}</td>
            <td className="border border-slate-200 px-2 py-1 text-center">{formatQty(Number(it.quantity))}</td>
            <td className="border border-slate-200 px-2 py-1 text-right">{formatCurrency(Number(it.price))}</td>
            <td className="border border-slate-200 px-2 py-1 text-right">{formatCurrency((Number(it.quantity) || 0) * (Number(it.price) || 0))}</td>
        </tr>
    );

    return (
        <div className={className}>
            <div className="relative mx-auto w-full max-w-[794px] overflow-hidden rounded-md border bg-white px-[6%] py-[5%] text-[11px] leading-relaxed text-slate-800 shadow-sm">
                {/* Watermark */}
                {isFinal ? (
                    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden" style={{ opacity: 0.045 }}>
                        <div className="absolute left-1/2 top-1/2 whitespace-nowrap text-center font-bold text-[#1e3a8a]" style={{ transform: 'translate(-50%, -50%) rotate(-30deg)', width: '160%' }}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="text-[26px] tracking-[10px]" style={{ lineHeight: 2.4 }}>CTECH &bull; CTECH &bull; CTECH &bull; CTECH &bull; CTECH</div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col items-center justify-center">
                        <div className="text-center font-bold text-red-600" style={{ transform: 'rotate(-45deg)', opacity: 0.09 }}>
                            <div className="text-[88px] leading-none tracking-[12px]">DRAFT</div>
                            <div className="mt-2 text-[18px] uppercase tracking-[8px]">Belum Disahkan</div>
                        </div>
                    </div>
                )}

                <div className="relative z-10">
                    {/* Kop surat */}
                    <div className="flex items-center gap-3 pb-1">
                        <img src="/letter/main-logo.png" alt="Logo" className="h-14 w-14 shrink-0 object-contain" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                        <div className="min-w-0 flex-1">
                            <p className="m-0 truncate text-[16px] font-bold uppercase leading-tight tracking-wide text-slate-900">{companyName}</p>
                            <p className="m-0 mt-1 text-[7.5px] font-semibold uppercase tracking-[2.5px] text-blue-600">Technology &bull; Digital &bull; Creative Solutions</p>
                        </div>
                        <div className="shrink-0 text-right text-[8px] leading-relaxed text-slate-500">
                            {settings?.address && <p className="m-0 max-w-[180px] text-slate-600">{settings.address}</p>}
                            {settings?.phone && <p className="m-0"><span className="font-bold text-slate-400">T</span> {settings.phone}</p>}
                            {settings?.email && <p className="m-0"><span className="font-bold text-slate-400">E</span> {settings.email}</p>}
                            {settings?.website && <p className="m-0"><span className="font-bold text-slate-400">W</span> {settings.website}</p>}
                        </div>
                    </div>
                    <div className="mt-3 flex h-[4px] w-full overflow-hidden">
                        <div className="w-[70px] bg-cyan-400" />
                        <div className="flex-1 bg-blue-600" />
                    </div>
                    <div className="mb-4 mt-[3px] border-b border-slate-200" />

                    {/* Tanggal & meta */}
                    <div className="mb-2 text-right">Kendari, {formatIndoDate(data.quotation_date) || '—'}</div>
                    <table className="mb-1">
                        <tbody>
                            <tr><td className="w-[90px] align-top">Nomor</td><td className="w-3 align-top">:</td><td className="align-top">{referenceNumber}</td></tr>
                            <tr><td className="align-top">Perihal</td><td className="align-top">:</td><td className="align-top font-bold">{data.subject || '—'}</td></tr>
                            {data.valid_until && <tr><td className="align-top">Masa Berlaku</td><td className="align-top">:</td><td className="align-top">s.d. {formatIndoDate(data.valid_until)}</td></tr>}
                        </tbody>
                    </table>

                    {/* Penerima */}
                    <div className="my-3">
                        Kepada Yth.<br />
                        <span className="font-bold">{data.client_name || '—'}</span>
                        {data.client_pic && <><br />u.p. {data.client_pic}</>}
                        <br />
                        {data.client_address || 'di Tempat'}
                    </div>

                    {/* Intro */}
                    {data.intro && <div className="mb-3 whitespace-pre-line text-justify">{data.intro}</div>}

                    {/* RAB */}
                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1e40af]">Rencana Anggaran Biaya (RAB)</div>
                    <table className="w-full border-collapse text-[10px]">
                        {rabHeader}
                        <tbody>
                            {items.length === 0 && (
                                <tr><td colSpan={6} className="border border-slate-200 px-2 py-3 text-center italic text-slate-400">Belum ada item RAB.</td></tr>
                            )}
                            {hasCategories
                                ? groups.map((g, gi) => {
                                    const catTotal = g.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
                                    return (
                                        <Fragment key={`grp-${gi}`}>
                                            <tr>
                                                <td colSpan={6} className="border border-slate-200 bg-indigo-50 px-2 py-1.5 font-bold text-[#1e3a8a]">
                                                    {SECTION_LETTERS[gi] || '•'}. {g.category || 'Lain-lain'}
                                                </td>
                                            </tr>
                                            {g.items.map((it, ii) => itemRow(it, ii + 1, `it-${gi}-${ii}`))}
                                            <tr>
                                                <td colSpan={5} className="border border-slate-200 bg-slate-100 px-2 py-1 text-right font-bold">Subtotal {SECTION_LETTERS[gi]}</td>
                                                <td className="border border-slate-200 bg-slate-100 px-2 py-1 text-right font-bold">{formatCurrency(catTotal)}</td>
                                            </tr>
                                        </Fragment>
                                    );
                                })
                                : items.map((it, i) => itemRow(it, i + 1, `flat-${i}`))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="mt-3 flex justify-end">
                        <table className="w-[280px]">
                            <tbody>
                                <tr><td className="py-1 pr-3 text-right text-slate-500">Subtotal</td><td className="py-1 text-right font-semibold">{formatCurrency(subtotal)}</td></tr>
                                {discount > 0 && <tr><td className="py-1 pr-3 text-right text-slate-500">Diskon</td><td className="py-1 text-right font-semibold">- {formatCurrency(discount)}</td></tr>}
                                {discount > 0 && <tr><td className="py-1 pr-3 text-right text-slate-500">DPP</td><td className="py-1 text-right font-semibold">{formatCurrency(afterDiscount)}</td></tr>}
                                {data.use_tax && tax > 0 && <tr><td className="py-1 pr-3 text-right text-slate-500">PPN ({data.tax_rate || 0}%)</td><td className="py-1 text-right font-semibold">{formatCurrency(tax)}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-1 flex justify-end">
                        <div className="flex w-[280px] items-center justify-between rounded bg-[#1e40af] px-3 py-2 text-white">
                            <span className="font-bold">TOTAL</span>
                            <span className="font-bold">{formatCurrency(total)}</span>
                        </div>
                    </div>
                    <div className="mt-2 border-l-2 border-[#1e40af] bg-slate-50 px-3 py-2 text-[9.5px] italic text-slate-600">
                        <strong className="not-italic">Terbilang:</strong> {terbilang(total)}
                    </div>

                    {/* Terms */}
                    {data.terms && (
                        <>
                            <div className="mt-4 mb-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-900">Syarat &amp; Ketentuan</div>
                            <div className="whitespace-pre-line text-justify text-[10px]">{data.terms}</div>
                        </>
                    )}
                    {data.notes && <div className="mt-3 text-[9.5px] text-slate-500"><strong>Catatan:</strong> {data.notes}</div>}

                    {/* Tanda tangan */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-[45%] text-center">
                            <p className="m-0">Hormat kami,</p>
                            <p className="m-0 font-bold">{companyName}</p>
                            <div className="h-[64px]" />
                            <p className="m-0 font-bold underline">{signerName || '(..............................)'}</p>
                            <p className="m-0">Direktur Utama</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 border-t pt-2 text-center text-[9px]">
                        {isFinal ? (
                            <p className="m-0 text-slate-500">Dokumen ini dihasilkan oleh sistem informasi {companyName}. Keabsahan mensyaratkan tanda tangan pejabat berwenang dan cap resmi perusahaan.</p>
                        ) : (
                            <p className="m-0 font-semibold text-red-600">DOKUMEN DRAFT — belum disahkan dan tidak berlaku sebagai penawaran resmi.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
