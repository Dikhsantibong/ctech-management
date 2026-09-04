import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VerifyResult {
    found: boolean;
    reference_number?: string;
    type?: string;
    subject?: string;
    recipient?: string;
    letter_date?: string | null;
    status?: string;
    issuer?: string | null;
    creator?: string | null;
    code?: string;
}

export default function LetterVerify({ code, result }: { code?: string; result?: VerifyResult | null }) {
    const { data, setData, post, processing } = useForm({ code: code || '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/letters/verify', { preserveScroll: true, preserveState: true });
    };

    const isFinal = result?.found && result.status === 'Final';
    const isDraft = result?.found && result.status !== 'Final';

    return (
        <>
            <Head title="Verifikasi Dokumen" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/letters">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Verifikasi Dokumen</h2>
                        <p className="text-muted-foreground">Cek keaslian surat berdasarkan Kode Dokumen yang tercetak di footer.</p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-2xl space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Pengecekan Keaslian Arsip</CardTitle>
                            </div>
                            <CardDescription>
                                Masukkan Kode Dokumen (mis. <span className="font-mono">1A2B-3C4D-5E6F</span>) untuk mencocokkan dengan arsip surat resmi perusahaan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="code">Kode Dokumen</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="XXXX-XXXX-XXXX"
                                        className="font-mono uppercase"
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" disabled={processing || !data.code.trim()}>
                                    <Search className="mr-2 h-4 w-4" /> Verifikasi
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Hasil */}
                    {result && (
                        result.found ? (
                            <Card className={isFinal ? 'border-green-300 dark:border-green-900' : 'border-amber-300 dark:border-amber-900'}>
                                <CardContent className="space-y-4 pt-6">
                                    {isFinal ? (
                                        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                                            <CheckCircle2 className="h-6 w-6 shrink-0" />
                                            <div>
                                                <p className="font-semibold">Dokumen ditemukan &amp; berstatus Final</p>
                                                <p className="text-sm opacity-90">Kode cocok dengan arsip resmi perusahaan.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                            <AlertTriangle className="h-6 w-6 shrink-0" />
                                            <div>
                                                <p className="font-semibold">Dokumen ditemukan, namun masih Draft</p>
                                                <p className="text-sm opacity-90">Belum disahkan dan tidak berlaku sebagai dokumen resmi.</p>
                                            </div>
                                        </div>
                                    )}

                                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                                        <div>
                                            <dt className="text-muted-foreground">Nomor Surat</dt>
                                            <dd className="font-medium">{result.reference_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Status</dt>
                                            <dd><Badge variant={isFinal ? 'default' : 'outline'}>{result.status}</Badge></dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Jenis</dt>
                                            <dd className="font-medium">{result.type}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Tanggal Surat</dt>
                                            <dd className="font-medium">{result.letter_date ? new Date(result.letter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-muted-foreground">Perihal</dt>
                                            <dd className="font-medium">{result.subject}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Penerima</dt>
                                            <dd className="font-medium">{result.recipient}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Penerbit</dt>
                                            <dd className="font-medium">{result.issuer || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Dibuat oleh</dt>
                                            <dd className="font-medium">{result.creator || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Kode Dokumen</dt>
                                            <dd className="font-mono font-medium">{result.code}</dd>
                                        </div>
                                    </dl>

                                    <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                                        Catatan: pengecekan ini mengonfirmasi keaslian arsip internal. Keabsahan hukum dokumen tetap mensyaratkan tanda tangan pejabat berwenang dan cap resmi perusahaan.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-destructive/40">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
                                        <XCircle className="h-6 w-6 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Kode Dokumen tidak ditemukan</p>
                                            <p className="text-sm opacity-90">Pastikan kode diketik sesuai yang tercetak pada dokumen. Jika tetap tidak cocok, dokumen tidak berasal dari sistem ini.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

LetterVerify.layout = {
    breadcrumbs: [
        { title: 'Letters', href: '/letters' },
        { title: 'Verifikasi Dokumen', href: '#' },
    ],
};
