import { Link, router } from '@inertiajs/react';
import { Copy, ExternalLink, PenLine, Printer, ShieldCheck, ShieldX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type SignableDocumentType = 'letter' | 'quotation' | 'kwitansi';

export interface DocumentSignatureInfo {
    signer_name: string;
    signer_title: string;
    signed_at: string;
    pdf_hash: string;
    verification_url: string;
}

interface DocumentSignaturePanelProps {
    documentType: SignableDocumentType;
    documentId: number;
    /** Nama dokumen untuk teks, mis. "surat", "penawaran", "kwitansi". */
    documentLabel: string;
    signature: DocumentSignatureInfo | null;
    /** Hanya Direktur Utama yang boleh menandatangani, mencabut, dan mencetak untuk TTD basah. */
    canSign: boolean;
    hasSignatureImage: boolean;
    /** Alasan dokumen belum bisa ditandatangani (mis. kwitansi belum Paid). */
    signBlocker?: string | null;
}

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Status & aksi tanda tangan elektronik dokumen (TTE internal + QR verifikasi),
 * plus cetak versi tanda tangan basah. Aksi hanya tampil untuk Direktur Utama.
 */
export function DocumentSignaturePanel({
    documentType,
    documentId,
    documentLabel,
    signature,
    canSign,
    hasSignatureImage,
    signBlocker,
}: DocumentSignaturePanelProps) {
    const [signOpen, setSignOpen] = useState(false);
    const [revokeOpen, setRevokeOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    const baseUrl = `/signatures/${documentType}/${documentId}`;

    const sign = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`${baseUrl}/sign`, { password }, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (errors) => setError(errors.password || errors.document || 'Gagal menandatangani dokumen.'),
            onSuccess: () => {
                setSignOpen(false);
                setPassword('');
                setError(null);
            },
        });
    };

    const revoke = () => {
        router.put(`${baseUrl}/revoke`, {}, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setRevokeOpen(false),
        });
    };

    const copyLink = async () => {
        if (!signature) {
            return;
        }

        await navigator.clipboard.writeText(signature.verification_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tanda Tangan</CardTitle>
                <CardDescription>
                    {signature
                        ? 'Dokumen terkunci. Cabut tanda tangan untuk mengubahnya.'
                        : 'Tanda tangan elektronik Direktur Utama dengan QR verifikasi.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {signature ? (
                    <div className="space-y-3 rounded-lg border border-transparent bg-success-soft p-3 text-success-soft-foreground">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium">Ditandatangani secara elektronik</p>
                                <p className="text-[13px] opacity-90">
                                    {signature.signer_name} ({signature.signer_title}) · {formatDateTime(signature.signed_at)}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1 text-xs">
                            <p className="font-medium">Sidik digital (SHA-256)</p>
                            <p className="break-all font-mono opacity-90">{signature.pdf_hash}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" asChild>
                                <a href={signature.verification_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink /> Halaman verifikasi
                                </a>
                            </Button>
                            <Button size="sm" variant="outline" onClick={copyLink}>
                                <Copy /> {copied ? 'Tersalin' : 'Salin link'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Belum ditandatangani. PDF yang diunduh masih tanpa tanda tangan{documentType === 'kwitansi' ? '' : ' dan berwatermark draft'}.
                    </p>
                )}

                {canSign && (
                    <div className="flex flex-col gap-2">
                        {!signature && (
                            <>
                                <Button onClick={() => setSignOpen(true)} disabled={!hasSignatureImage || !!signBlocker}>
                                    <PenLine /> Sahkan & Tandatangani
                                </Button>
                                {!hasSignatureImage && (
                                    <p className="text-[13px] text-warning-soft-foreground">
                                        Unggah gambar tanda tangan di{' '}
                                        <Link href="/settings" className="font-medium underline underline-offset-2">Pengaturan Perusahaan</Link>{' '}
                                        terlebih dahulu.
                                    </p>
                                )}
                                {hasSignatureImage && signBlocker && <p className="text-[13px] text-warning-soft-foreground">{signBlocker}</p>}
                            </>
                        )}
                        {signature && (
                            <Button variant="outline" onClick={() => setRevokeOpen(true)}>
                                <ShieldX /> Cabut Tanda Tangan
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <a href={`${baseUrl}/print-wet`} target="_blank" rel="noopener noreferrer">
                                <Printer /> Cetak untuk TTD Basah
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Versi cetak tanpa tanda tangan elektronik, cap, dan QR — untuk ditandatangani basah dan distempel.
                        </p>
                    </div>
                )}
            </CardContent>

            <Dialog open={signOpen} onOpenChange={(open) => {
 setSignOpen(open); setError(null); 
}}>
                <DialogContent>
                    <form onSubmit={sign} className="grid gap-5">
                        <DialogHeader>
                            <DialogTitle>Sahkan & tandatangani {documentLabel}</DialogTitle>
                            <DialogDescription>
                                Tanda tangan dan cap perusahaan akan dibubuhkan, PDF final dibekukan beserta sidik digitalnya, dan {documentLabel} tidak dapat diubah sampai tanda tangan dicabut.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="signature-password">Konfirmasi password Anda</Label>
                            <Input
                                id="signature-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={!!error}
                                autoFocus
                                required
                            />
                            {error && <p className="text-[13px] text-destructive">{error}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setSignOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing || !password}>
                                <PenLine /> Tandatangani
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cabut tanda tangan?</DialogTitle>
                        <DialogDescription>
                            Halaman verifikasi akan menampilkan status <strong>Dicabut</strong> untuk PDF yang sudah beredar, dan {documentLabel} kembali bisa diubah. Tindakan ini tercatat di Activity Log.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevokeOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={revoke} disabled={processing}>
                            <ShieldX /> Cabut Tanda Tangan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
