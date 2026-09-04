import { ShieldCheck } from 'lucide-react';

// Kode jenis surat — harus sama dengan codeMap di LetterController agar nomor
// pratinjau tampil sama persis dengan nomor yang nanti tergenerate.
const TYPE_CODE_MAP: Record<string, string> = {
    'Surat Keputusan': 'SK',
    'Surat Tugas': 'ST',
    'Surat Keterangan': 'SKET',
    'Surat Penawaran': 'SPNW',
    'Surat Peringatan': 'SP',
    'Surat Undangan': 'SUND',
    'Surat Izin': 'SI',
    'Surat Keterangan Kerja': 'SKK',
    'Surat Pengantar': 'SPG',
    'Surat Pemberitahuan': 'SPMB',
    'Surat Rekomendasi': 'SREK',
    'Surat Permohonan': 'SPRM',
    'Surat Kontrak': 'SKTR',
    'Surat Pernyataan': 'SPER',
    'Berita Acara': 'BA',
    'Berita Acara Serah Terima Pekerjaan': 'BAST',
    'Berita Acara Pemeriksaan Pekerjaan': 'BAPP',
    'Berita Acara Kesepakatan': 'BAK',
    'Berita Acara Pembayaran': 'BAP',
    'Berita Acara Rapat': 'BAR',
    'Berita Acara Kejadian': 'BAKJ',
};

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const TITLE_TYPES = ['Surat Keputusan', 'Surat Tugas', 'Surat Keterangan', 'Surat Keterangan Kerja', 'Surat Peringatan', 'Surat Kontrak'];

function formatIndoDate(value?: string) {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function previewReference(type: string, letterDate?: string) {
    const code = TYPE_CODE_MAP[type] ?? 'SRT';
    const date = letterDate ? new Date(letterDate) : new Date();
    const roman = ROMAN_MONTHS[Number.isNaN(date.getTime()) ? new Date().getMonth() : date.getMonth()];
    const year = Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
    return `XXX/${code}/CTECH/${roman}/${year}`;
}

export interface LetterPreviewData {
    type: string;
    letter_date?: string;
    sifat?: string;
    recipient?: string;
    subject?: string;
    content?: string;
    status?: string;
    reference_number?: string;
}

export interface CompanySettings {
    company_name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    leader_name?: string;
}

export default function LetterDocumentPreview({
    data,
    settings,
    creatorName,
    verificationCode,
    className,
}: {
    data: LetterPreviewData;
    settings?: CompanySettings | null;
    creatorName?: string;
    verificationCode?: string | null;
    className?: string;
}) {
    const isFinal = data.status === 'Final';
    const referenceNumber = data.reference_number || previewReference(data.type, data.letter_date);
    const companyName = settings?.company_name || 'PT KREATIF TEKNOLOGI MAJU BERSAMA';
    const signerName = settings?.leader_name || creatorName || '';
    const contentHasHtml = data.content ? /<\w+[^>]*>/.test(data.content) : false;

    return (
        <div className={`letter-preview-frame ${className || ''}`}>
            <div className="relative mx-auto w-full max-w-[794px] overflow-hidden rounded-md border bg-white px-[7%] py-[6%] font-serif text-[13px] leading-relaxed text-black shadow-sm">
                {/* ===== Watermark ===== */}
                {isFinal ? (
                    <>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
                            style={{ opacity: 0.05 }}
                        >
                            <div
                                className="absolute left-1/2 top-1/2 whitespace-nowrap text-center font-bold text-[#1e3a8a]"
                                style={{ transform: 'translate(-50%, -50%) rotate(-30deg)', width: '160%' }}
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="text-[26px] tracking-[10px]" style={{ lineHeight: 2.4 }}>
                                        CTECH &bull; CTECH &bull; CTECH &bull; CTECH &bull; CTECH
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col items-center justify-center"
                    >
                        <div
                            className="text-center font-bold text-red-600"
                            style={{ transform: 'rotate(-45deg)', opacity: 0.1 }}
                        >
                            <div className="text-[90px] leading-none tracking-[12px]">DRAFT</div>
                            <div className="mt-2 text-[20px] uppercase tracking-[8px]">Belum Disahkan</div>
                        </div>
                    </div>
                )}

                {/* ===== Konten dokumen ===== */}
                <div className="relative z-10">
                    {/* Kop surat */}
                    <div className="flex items-center gap-4 pb-2">
                        <img src="/letter/main-logo.png" alt="Logo" className="h-16 w-16 object-contain" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                        <div className="flex-1 pr-16 text-center">
                            <p className="m-0 text-[17px] font-bold uppercase tracking-wide text-[#1e3a8a]">{companyName}</p>
                            {settings?.address && <p className="m-0 mt-1 text-[10px] text-gray-700">{settings.address}</p>}
                            <p className="m-0 text-[10px] text-gray-700">
                                {settings?.phone && <span>Telp: {settings.phone} </span>}
                                {settings?.email && <span>&bull; Email: {settings.email} </span>}
                                {settings?.website && <span>&bull; {settings.website}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="border-b-[3px] border-[#1e3a8a]" />
                    <div className="mb-4 mt-0.5 border-b border-[#1e3a8a]" />

                    {/* Tanggal */}
                    <div className="mb-1.5 text-right">Kendari, {formatIndoDate(data.letter_date) || '—'}</div>

                    {/* Meta */}
                    <table className="border-collapse">
                        <tbody>
                            <tr>
                                <td className="w-[70px] align-top">Nomor</td>
                                <td className="w-3 align-top">:</td>
                                <td className="align-top">{referenceNumber}</td>
                            </tr>
                            <tr>
                                <td className="align-top">Sifat</td>
                                <td className="align-top">:</td>
                                <td className="align-top">{data.sifat || 'Biasa'}</td>
                            </tr>
                            <tr>
                                <td className="align-top">Perihal</td>
                                <td className="align-top">:</td>
                                <td className="align-top font-bold">{data.subject || '—'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Penerima */}
                    <div className="my-4">
                        Kepada Yth.
                        <br />
                        <span className="font-bold">{data.recipient || '—'}</span>
                        <br />
                        di Tempat
                    </div>

                    {/* Judul */}
                    {TITLE_TYPES.includes(data.type) && (
                        <div className="my-4 text-center">
                            <div className="text-[15px] font-bold uppercase tracking-wide underline">{data.type}</div>
                            <div className="mt-0.5 text-[13px]">Nomor: {referenceNumber}</div>
                        </div>
                    )}

                    {/* Isi surat */}
                    {data.content ? (
                        contentHasHtml ? (
                            <div
                                className="letter-preview-content text-justify [&_li]:mb-1 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2 [&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-6"
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
                        ) : (
                            <div className="whitespace-pre-wrap text-justify">{data.content}</div>
                        )
                    ) : (
                        <p className="italic text-gray-400">Isi surat akan tampil di sini…</p>
                    )}

                    {/* Tanda tangan + stempel */}
                    <div className="mt-8 flex items-end justify-between">
                        <div className="relative h-[130px] w-[45%]">
                            {isFinal && (
                                <div
                                    className="flex h-[118px] w-[118px] items-center justify-center rounded-full border-[2.5px] border-[#1e3a8a] text-center text-[#1e3a8a]"
                                    style={{ transform: 'rotate(-14deg)', opacity: 0.9 }}
                                >
                                    <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full border border-[#1e3a8a]">
                                        <div className="text-[7px] font-bold uppercase tracking-wide">Dokumen Resmi</div>
                                        <div className="my-0.5 text-[13px] font-bold tracking-widest">CTECH</div>
                                        <div className="font-mono text-[6px]">{verificationCode || ''}</div>
                                        <div className="mt-0.5 text-[6px] uppercase tracking-wide">Terverifikasi</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-[45%] text-center">
                            <p className="m-0">Hormat kami,</p>
                            <p className="m-0 font-bold">{companyName}</p>
                            <div className="h-[70px]" />
                            <p className="m-0 font-bold underline">{signerName || '(..............................)'}</p>
                            <p className="m-0">Direktur Utama</p>
                        </div>
                    </div>

                    {/* Footer verifikasi */}
                    <div className="mt-8 border-t pt-2 text-center text-[9px]">
                        {isFinal ? (
                            <p className="m-0 text-gray-500">
                                Dokumen ini diterbitkan secara elektronik oleh {companyName} dan sah tanpa tanda tangan basah.{' '}
                                Kode Verifikasi:{' '}
                                <span className="font-mono font-bold tracking-wide text-[#1e3a8a]">{verificationCode || '—'}</span>
                            </p>
                        ) : (
                            <p className="m-0 flex items-center justify-center gap-1 font-semibold text-red-600">
                                <ShieldCheck className="h-3 w-3" />
                                DOKUMEN DRAFT — belum disahkan dan tidak berlaku sebagai dokumen resmi.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
