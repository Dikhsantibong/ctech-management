import { Head, useForm } from '@inertiajs/react';
import { FileCheck2, FileWarning, ShieldAlert, ShieldCheck, ShieldX, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerifiedDocument {
    label: string;
    number: string;
    subject: string | null;
    counterpart_label: string;
    counterpart: string | null;
    date: string | null;
    amount: number | null;
    issuer: string | null;
    signer_name: string;
    signer_title: string;
    signed_at: string;
    revoked_at: string | null;
    pdf_hash: string;
}

const formatDate = (value: string | null, withTime = false) =>
    value
        ? new Date(value).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
          })
        : '-';

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

/**
 * Halaman publik dari QR code dokumen bertanda tangan elektronik CTECH:
 * menampilkan status keabsahan dan memungkinkan pencocokan file PDF (SHA-256).
 */
export default function DocumentVerification({ token, document, match }: { token: string; document: VerifiedDocument | null; match: boolean | null }) {
    const { setData, post, processing, errors, data } = useForm<{ file: File | null }>({ file: null });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/verifikasi-dokumen/${token}`, { forceFormData: true, preserveScroll: true });
    };

    const revoked = !!document?.revoked_at;

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 text-[#101828] sm:py-16">
            <Head title="Verifikasi Dokumen" />
            <div className="mx-auto max-w-xl space-y-6">
                <div className="flex items-center gap-3">
                    <img src="/logo/logo-web.png" alt="" className="size-10 rounded-md border border-[#E4E7EC]" />
                    <div>
                        <p className="text-[15px] font-semibold">Verifikasi Dokumen</p>
                        <p className="text-[13px] text-[#667085]">{document?.issuer ?? 'CTECH'}</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
                    {!document ? (
                        <StatusHeader tone="neutral" icon={ShieldAlert} title="Dokumen tidak ditemukan">
                            Kode verifikasi tidak terdaftar. Pastikan QR atau tautan berasal dari dokumen resmi.
                        </StatusHeader>
                    ) : revoked ? (
                        <StatusHeader tone="danger" icon={ShieldX} title="Tanda tangan telah dicabut">
                            Dokumen ini tidak berlaku lagi sejak {formatDate(document.revoked_at, true)}.
                        </StatusHeader>
                    ) : (
                        <StatusHeader tone="success" icon={ShieldCheck} title="Dokumen sah">
                            Ditandatangani secara elektronik oleh {document.signer_name} ({document.signer_title}).
                        </StatusHeader>
                    )}

                    {document && (
                        <dl className="divide-y divide-[#E4E7EC] text-sm">
                            <Row label="Jenis dokumen" value={document.label} />
                            <Row label="Nomor" value={document.number} mono />
                            {document.subject && <Row label="Perihal" value={document.subject} />}
                            {document.counterpart && <Row label={document.counterpart_label} value={document.counterpart} />}
                            <Row label="Tanggal dokumen" value={formatDate(document.date)} />
                            {document.amount !== null && <Row label="Nilai" value={formatRupiah(document.amount)} />}
                            <Row label="Penandatangan" value={`${document.signer_name} — ${document.signer_title}`} />
                            <Row label="Waktu tanda tangan" value={formatDate(document.signed_at, true)} />
                            <Row label="Sidik digital (SHA-256)" value={document.pdf_hash} mono />
                        </dl>
                    )}
                </div>

                {document && (
                    <form onSubmit={submit} className="space-y-4 rounded-lg border border-[#E4E7EC] bg-white p-5">
                        <div>
                            <p className="text-[15px] font-semibold">Cocokkan file PDF</p>
                            <p className="text-[13px] text-[#667085]">
                                Unggah PDF yang Anda terima untuk memastikan isinya sama persis dengan dokumen yang ditandatangani.
                            </p>
                        </div>

                        {match !== null && (
                            <div className={`flex items-start gap-2 rounded-md p-3 text-sm ${match ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-[#FEF3F2] text-[#B42318]'}`}>
                                {match ? <FileCheck2 className="mt-0.5 size-4 shrink-0" /> : <FileWarning className="mt-0.5 size-4 shrink-0" />}
                                <span>
                                    {match
                                        ? 'File cocok dengan dokumen resmi yang ditandatangani.'
                                        : 'File tidak cocok. Dokumen mungkin telah diubah atau bukan versi resmi.'}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-[#475467] file:mr-3 file:h-9 file:rounded-md file:border file:border-[#D0D5DD] file:bg-white file:px-3 file:text-sm file:font-medium file:text-[#344054]"
                            />
                            <Button type="submit" disabled={processing || !data.file} className="shrink-0">
                                <Upload /> Periksa
                            </Button>
                        </div>
                        {errors.file && <p className="text-[13px] text-[#B42318]">{errors.file}</p>}
                        <p className="text-xs text-[#667085]">File hanya dihitung sidik digitalnya dan tidak disimpan.</p>
                    </form>
                )}

                <p className="text-center text-xs text-[#667085]">
                    Tanda tangan elektronik internal sesuai UU ITE & PP 71/2019 (TTE tidak tersertifikasi).
                </p>
            </div>
        </div>
    );
}

function StatusHeader({ tone, icon: Icon, title, children }: { tone: 'success' | 'danger' | 'neutral'; icon: typeof ShieldCheck; title: string; children: React.ReactNode }) {
    const tones = {
        success: 'bg-[#ECFDF3] text-[#027A48]',
        danger: 'bg-[#FEF3F2] text-[#B42318]',
        neutral: 'bg-[#F2F4F7] text-[#344054]',
    };

    return (
        <div className={`flex items-start gap-3 p-5 ${tones[tone]}`}>
            <Icon className="mt-0.5 size-5 shrink-0" />
            <div>
                <p className="text-[15px] font-semibold">{title}</p>
                <p className="text-sm opacity-90">{children}</p>
            </div>
        </div>
    );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
            <dt className="text-[13px] text-[#667085]">{label}</dt>
            <dd className={`break-all ${mono ? 'font-mono text-[13px]' : ''}`}>{value}</dd>
        </div>
    );
}
