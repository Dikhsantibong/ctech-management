import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Pencil, Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LetterEditor from '@/components/letter-editor';
import LetterPageSettings from '@/components/letter-page-settings';
import LetterDocumentPreview, { type CompanySettings } from '@/components/letter-document-preview';
import { LETTER_TEMPLATES } from '@/lib/letter-templates';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_SETTINGS = {
    margin_top: 14,
    margin_right: 20,
    margin_bottom: 18,
    margin_left: 20,
    line_spacing: '1.5',
};

export default function LetterForm({ letter, settings }: { letter: any | null; settings?: CompanySettings | null }) {
    const isEdit = !!letter;
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [pdfLoading, setPdfLoading] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        type: letter?.type || 'Surat Keputusan',
        letter_date: letter?.letter_date ? letter.letter_date.split('T')[0] : new Date().toISOString().split('T')[0],
        sifat: letter?.sifat || 'Biasa',
        recipient: letter?.recipient || '',
        subject: letter?.subject || '',
        content: letter?.content || '',
        status: letter?.status || 'Draft',
        margin_top: letter?.margin_top ?? DEFAULT_PAGE_SETTINGS.margin_top,
        margin_right: letter?.margin_right ?? DEFAULT_PAGE_SETTINGS.margin_right,
        margin_bottom: letter?.margin_bottom ?? DEFAULT_PAGE_SETTINGS.margin_bottom,
        margin_left: letter?.margin_left ?? DEFAULT_PAGE_SETTINGS.margin_left,
        line_spacing: letter?.line_spacing ?? DEFAULT_PAGE_SETTINGS.line_spacing,
    });

    const handleTypeChange = (newType: string) => {
        setData('type', newType);
        if (!isEdit) {
            const template = LETTER_TEMPLATES[newType as keyof typeof LETTER_TEMPLATES];
            if (template) {
                setData('subject', template.subject);
                setData('content', template.content);
            }
        }
    };

    useEffect(() => {
        if (!isEdit && !data.subject && !data.content) {
            const template = LETTER_TEMPLATES[data.type as keyof typeof LETTER_TEMPLATES];
            if (template) {
                setData('subject', template.subject);
                setData('content', template.content);
            }
        }
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/letters/${letter.id}`);
        } else {
            post('/letters');
        }
    };

    // Pratinjau PDF asli (server-side) dengan watermark DRAFT sebelum surat disimpan.
    const openPdfPreview = async () => {
        if (!data.content?.trim()) {
            alert('Isi surat masih kosong. Lengkapi dulu sebelum melihat pratinjau PDF.');
            return;
        }
        setPdfLoading(true);
        try {
            const xsrf = decodeURIComponent(
                document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1] || '',
            );
            const response = await fetch('/letters/preview-draft', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrf,
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ...data, reference_number: letter?.reference_number }),
            });

            const contentType = response.headers.get('content-type') || '';

            // Bila bukan PDF (validasi gagal / sesi habis), tampilkan pesan yang jelas
            // alih-alih membuka blob HTML yang bikin "Failed to load PDF document".
            if (!response.ok || !contentType.includes('pdf')) {
                let message = 'Gagal membuat pratinjau PDF. Pastikan isi surat sudah terisi.';
                if (contentType.includes('json')) {
                    const body = await response.json();
                    message = body?.message || Object.values(body?.errors || {}).flat().join('\n') || message;
                } else if (response.status === 419) {
                    message = 'Sesi kedaluwarsa. Muat ulang halaman lalu coba lagi.';
                }
                alert(message);
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            window.open(url, '_blank', 'noopener,noreferrer');
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            console.error(error);
            alert('Gagal membuat pratinjau PDF. Periksa koneksi lalu coba lagi.');
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <>
            <Head title={isEdit ? "Edit Letter" : "Create Letter"} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/letters">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Letter" : "Create Official Letter"}</h2>
                        <p className="text-muted-foreground">
                            {isEdit ? "Update document details and content." : "Draft a new official document for the company."}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Metadata Surat</CardTitle>
                                    <CardDescription>Informasi dasar dokumen.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Jenis Surat</Label>
                                        <Select value={data.type} onValueChange={handleTypeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis surat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(LETTER_TEMPLATES).map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="letter_date">Tanggal Surat</Label>
                                        <Input id="letter_date" type="date" value={data.letter_date} onChange={e => setData('letter_date', e.target.value)} required />
                                        {errors.letter_date && <p className="text-sm text-destructive">{errors.letter_date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sifat">Sifat Surat</Label>
                                        <Select value={data.sifat} onValueChange={val => setData('sifat', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih sifat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Biasa">Biasa</SelectItem>
                                                <SelectItem value="Penting">Penting</SelectItem>
                                                <SelectItem value="Segera">Segera</SelectItem>
                                                <SelectItem value="Sangat Segera">Sangat Segera</SelectItem>
                                                <SelectItem value="Rahasia">Rahasia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.sifat && <p className="text-sm text-destructive">{errors.sifat}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient">Penerima</Label>
                                        <Input id="recipient" value={data.recipient} onChange={e => setData('recipient', e.target.value)} required />
                                        {errors.recipient && <p className="text-sm text-destructive">{errors.recipient}</p>}
                                    </div>
                                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                        Status pengesahan tidak diatur di sini. Surat menjadi <strong>resmi</strong> setelah <strong>diverifikasi oleh Direktur Utama</strong> dari halaman detail surat.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Page Settings</CardTitle>
                                    <CardDescription>Pengaturan layout PDF surat.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <LetterPageSettings data={data} setData={setData} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                    <div>
                                        <CardTitle>Isi Surat</CardTitle>
                                        <CardDescription>Kop surat, tanggal, penerima, dan tanda tangan otomatis ditambahkan pada PDF.</CardDescription>
                                    </div>
                                    <div className="flex shrink-0 items-center rounded-lg border bg-muted/40 p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setMode('edit')}
                                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'edit' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Pencil className="h-3.5 w-3.5" /> Editor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('preview')}
                                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'preview' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Pratinjau
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Perihal</Label>
                                        <Input id="subject" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                                    </div>
                                    {mode === 'edit' ? (
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <Label htmlFor="content">Dokumen</Label>
                                            <LetterEditor value={data.content} onChange={(value) => setData('content', value)} className="flex-1 min-h-[500px]" />
                                            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center justify-between">
                                                <Label>Pratinjau Dokumen</Label>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${data.status === 'Final' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'}`}>
                                                    {data.status === 'Final' ? 'Watermark CTECH' : 'Watermark DRAFT'}
                                                </span>
                                            </div>
                                            <div className="max-h-[600px] overflow-auto rounded-lg border bg-muted/30 p-4">
                                                <LetterDocumentPreview
                                                    data={data}
                                                    settings={settings}
                                                    creatorName={letter?.creator?.name}
                                                    verificationCode={data.status === 'Final' ? 'PRATINJAU' : undefined}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Ini pratinjau di layar. Klik <strong>Pratinjau PDF</strong> untuk melihat hasil cetak sebenarnya.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                <div className="flex flex-wrap items-center justify-end gap-3 p-6 pt-0 mt-auto">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/letters">Batal</Link>
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={openPdfPreview} disabled={pdfLoading}>
                                        {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                        Pratinjau PDF
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEdit ? 'Simpan Perubahan' : 'Buat Surat'}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

LetterForm.layout = {
    breadcrumbs: [
        { title: 'Letters', href: '/letters' },
        { title: 'Form', href: '#' },
    ],
};

