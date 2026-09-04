import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, CheckCircle, Eye, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LetterDocumentPreview, { type CompanySettings } from '@/components/letter-document-preview';

export default function LetterShow({
    letter,
    settings,
    verification_code,
    can_verify,
}: {
    letter: any;
    settings?: CompanySettings | null;
    verification_code?: string | null;
    can_verify?: boolean;
}) {
    const isVerified = !!letter.verified_at;

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Final': return 'default';
            default: return 'outline';
        }
    };

    const verify = () => router.put(`/letters/${letter.id}/verify`, {}, { preserveScroll: true });
    const unverify = () => router.put(`/letters/${letter.id}/unverify`, {}, { preserveScroll: true });

    return (
        <>
            <Head title={letter.reference_number} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/letters">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold tracking-tight">{letter.reference_number}</h2>
                                <Badge variant={statusBadgeColor(letter.status)}>
                                    {letter.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1">
                                {letter.type}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {letter.content && (
                            isVerified ? (
                                can_verify && (
                                    <Button variant="outline" onClick={unverify} className="text-amber-600">
                                        <ShieldX className="mr-2 h-4 w-4" /> Batalkan Verifikasi
                                    </Button>
                                )
                            ) : (
                                can_verify ? (
                                    <Button onClick={verify} className="bg-green-600 hover:bg-green-700">
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Verifikasi Dokumen
                                    </Button>
                                ) : (
                                    <span className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                        <Clock className="h-4 w-4" /> Menunggu verifikasi Direktur Utama
                                    </span>
                                )
                            )
                        )}
                        {letter.content && (
                            <>
                                <Button variant="outline" asChild>
                                    <a href={`/letters/${letter.id}/preview`} target="_blank" rel="noopener noreferrer">
                                        <Eye className="mr-2 h-4 w-4" /> Preview PDF
                                    </a>
                                </Button>
                                <Button asChild>
                                    <a href={`/letters/${letter.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" /> Download PDF
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="min-h-[500px]">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle>Document Preview</CardTitle>
                                    </div>
                                    {letter.content && (
                                        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${isVerified ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'}`}>
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            {isVerified ? 'Terverifikasi — Watermark CTECH' : 'Draft — Watermark'}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="bg-muted/30 p-4">
                                {letter.content ? (
                                    <LetterDocumentPreview
                                        data={letter}
                                        settings={settings}
                                        creatorName={letter.creator?.name}
                                        verificationCode={verification_code}
                                    />
                                ) : (
                                    <p className="p-4 text-sm text-muted-foreground italic">
                                        Surat ini hanya reservasi nomor — tidak memiliki isi surat untuk ditampilkan.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reference No.</p>
                                    <p className="font-medium">{letter.reference_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                                    <p className="font-medium">{letter.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                                    <p className="font-medium">{new Date(letter.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created By</p>
                                    <p className="font-medium">{letter.creator?.name}</p>
                                </div>
                                {isVerified ? (
                                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Terverifikasi &amp; Sah</p>
                                            <p className="text-xs opacity-90">
                                                oleh {letter.verifier?.name || 'Direktur Utama'}
                                                {letter.verified_at ? ` · ${new Date(letter.verified_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    letter.content && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                            <Clock className="h-5 w-5" />
                                            <span className="font-medium">Belum diverifikasi</span>
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

LetterShow.layout = {
    breadcrumbs: [
        {
            title: 'Letters',
            href: '/letters',
        },
        {
            title: 'Document Viewer',
            href: '#',
        },
    ],
};
