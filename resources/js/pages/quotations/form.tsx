import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Pencil, Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuotationDocumentPreview, { type CompanySettings } from '@/components/quotation-document-preview';

interface RabItem {
    id: number | null;
    category: string;
    description: string;
    unit: string;
    quantity: number;
    price: number;
}

interface ClientOption {
    name: string;
    pic?: string | null;
}

const DEFAULT_INTRO =
    'Dengan hormat,\n\nBersama surat ini kami sampaikan penawaran harga untuk kebutuhan pekerjaan sebagaimana terlampir pada Rencana Anggaran Biaya (RAB) berikut. Kami berkomitmen memberikan kualitas terbaik sesuai ruang lingkup yang disepakati.';

const DEFAULT_TERMS =
    '1. Harga di atas berlaku selama masa berlaku penawaran ini.\n2. Pembayaran: DP 50% saat penandatanganan kontrak, pelunasan 50% setelah serah terima pekerjaan.\n3. Harga belum termasuk biaya di luar ruang lingkup pekerjaan.\n4. Jangka waktu pengerjaan dihitung sejak DP diterima.';

const emptyItem = (): RabItem => ({ id: null, category: '', description: '', unit: '', quantity: 1, price: 0 });

export default function QuotationForm({ quotation, clients, settings }: { quotation: any | null; clients: ClientOption[]; settings?: CompanySettings | null }) {
    const isEdit = !!quotation;
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [pdfLoading, setPdfLoading] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        client_name: quotation?.client_name || '',
        client_pic: quotation?.client_pic || '',
        client_address: quotation?.client_address || '',
        quotation_date: quotation?.quotation_date ? quotation.quotation_date.split('T')[0] : new Date().toISOString().split('T')[0],
        valid_until: quotation?.valid_until ? quotation.valid_until.split('T')[0] : '',
        subject: quotation?.subject || '',
        intro: quotation?.intro ?? DEFAULT_INTRO,
        terms: quotation?.terms ?? DEFAULT_TERMS,
        notes: quotation?.notes || '',
        use_tax: quotation ? !!quotation.use_tax : false,
        tax_rate: quotation && Number(quotation.tax_rate) > 0 ? Number(quotation.tax_rate) : 11,
        discount: quotation ? Number(quotation.discount) || 0 : 0,
        items: (quotation?.items?.length
            ? quotation.items.map((it: any) => ({ id: it.id, category: it.category || '', description: it.description, unit: it.unit || '', quantity: Number(it.quantity), price: Number(it.price) }))
            : [emptyItem()]) as RabItem[],
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

    const subtotal = data.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    const discount = Math.min(Number(data.discount) || 0, subtotal);
    const afterDiscount = subtotal - discount;
    const tax = data.use_tax ? afterDiscount * ((Number(data.tax_rate) || 0) / 100) : 0;
    const total = afterDiscount + tax;

    const onClientPick = (value: string) => {
        setData('client_name', value);
        const match = clients.find((c) => c.name === value);
        if (match?.pic) setData('client_pic', match.pic);
    };

    const addItem = () => setData('items', [...data.items, emptyItem()]);
    const updateItem = (index: number, field: keyof RabItem, value: any) => {
        const next = [...data.items];
        next[index] = { ...next[index], [field]: value };
        setData('items', next);
    };
    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const next = [...data.items];
            next.splice(index, 1);
            setData('items', next);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/quotations/${quotation.id}`);
        } else {
            post('/quotations');
        }
    };

    const openPdfPreview = async () => {
        if (!data.items.some((it) => it.description.trim())) {
            alert('Isi minimal satu baris RAB sebelum melihat pratinjau PDF.');
            return;
        }
        setPdfLoading(true);
        try {
            const xsrf = decodeURIComponent(document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');
            const response = await fetch('/quotations/preview-draft', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrf,
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ...data, quotation_number: quotation?.quotation_number }),
            });
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok || !contentType.includes('pdf')) {
                let message = 'Gagal membuat pratinjau PDF. Pastikan data RAB sudah terisi.';
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
            <Head title={isEdit ? 'Edit Penawaran' : 'Buat Penawaran'} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href="/quotations"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Penawaran' : 'Buat Penawaran'}</h2>
                            <p className="text-muted-foreground">{isEdit ? quotation.quotation_number : 'Susun dokumen penawaran lengkap dengan RAB.'}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center rounded-lg border bg-muted/40 p-0.5">
                        <button type="button" onClick={() => setMode('edit')} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'edit' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Pencil className="h-3.5 w-3.5" /> Editor
                        </button>
                        <button type="button" onClick={() => setMode('preview')} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'preview' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Eye className="h-3.5 w-3.5" /> Pratinjau
                        </button>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {mode === 'edit' ? (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Klien &amp; Penawaran</CardTitle>
                                    <CardDescription>Informasi tujuan dan identitas dokumen penawaran.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Nama Klien / Perusahaan</Label>
                                        <Input list="client-list" value={data.client_name} onChange={(e) => onClientPick(e.target.value)} required />
                                        <datalist id="client-list">{clients.map((c) => <option key={c.name} value={c.name} />)}</datalist>
                                        {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kontak / PIC (opsional)</Label>
                                        <Input value={data.client_pic} onChange={(e) => setData('client_pic', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label>Alamat Klien (opsional)</Label>
                                        <Input value={data.client_address} onChange={(e) => setData('client_address', e.target.value)} placeholder="Ditampilkan pada blok tujuan surat" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label>Perihal Penawaran</Label>
                                        <Input value={data.subject} onChange={(e) => setData('subject', e.target.value)} placeholder="mis. Penawaran Pengembangan Platform Digital" required />
                                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal Penawaran</Label>
                                        <Input type="date" value={data.quotation_date} onChange={(e) => setData('quotation_date', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Berlaku Sampai (opsional)</Label>
                                        <Input type="date" value={data.valid_until} onChange={(e) => setData('valid_until', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label>Paragraf Pengantar</Label>
                                        <Textarea rows={3} value={data.intro} onChange={(e) => setData('intro', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                    <div>
                                        <CardTitle>Rincian RAB</CardTitle>
                                        <CardDescription>Isi <strong>Kategori</strong> yang sama untuk mengelompokkan pekerjaan menjadi satu seksi (subtotal per seksi otomatis).</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Tambah Baris</Button>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="hidden gap-2 px-2 text-xs font-medium text-muted-foreground sm:flex">
                                        <span className="w-[22%]">Kategori</span>
                                        <span className="flex-1">Uraian Pekerjaan</span>
                                        <span className="w-[12%]">Satuan</span>
                                        <span className="w-[12%]">Volume</span>
                                        <span className="w-[18%]">Harga Satuan</span>
                                        <span className="w-8" />
                                    </div>
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-2 rounded-md border bg-muted/20 p-2 sm:flex-row sm:items-center">
                                            <Input className="sm:w-[22%]" placeholder="Kategori" value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} />
                                            <Input className="sm:flex-1" placeholder="Uraian pekerjaan" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} required />
                                            <Input className="sm:w-[12%]" placeholder="paket" value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} />
                                            <Input className="sm:w-[12%]" type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} required />
                                            <Input className="sm:w-[18%]" type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} required />
                                            <div className="flex items-center justify-between gap-1 sm:w-8">
                                                <span className="text-xs text-muted-foreground sm:hidden">{formatCurrency((item.quantity || 0) * (item.price || 0))}</span>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(index)} disabled={data.items.length === 1}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader><CardTitle>Diskon &amp; Pajak</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Diskon (Rp, opsional)</Label>
                                            <Input type="number" min="0" value={data.discount} onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)} />
                                        </div>
                                        <div className="flex items-center justify-between rounded-md border p-3">
                                            <div className="space-y-0.5">
                                                <Label>Gunakan PPN</Label>
                                                <p className="text-xs text-muted-foreground">Dihitung setelah diskon.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {data.use_tax && (
                                                    <div className="flex items-center gap-1">
                                                        <Input type="number" min="0" max="100" className="w-20 text-right" value={data.tax_rate} onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)} />
                                                        <span className="text-sm text-muted-foreground">%</span>
                                                    </div>
                                                )}
                                                <Switch checked={data.use_tax} onCheckedChange={(c) => setData('use_tax', c)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                                            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Diskon</span><span className="font-medium">- {formatCurrency(discount)}</span></div>}
                                            {data.use_tax && <div className="flex justify-between text-sm"><span className="text-muted-foreground">PPN ({data.tax_rate || 0}%)</span><span className="font-medium">{formatCurrency(tax)}</span></div>}
                                            <div className="flex justify-between border-t pt-2 text-base"><span className="font-bold">Grand Total</span><span className="font-bold text-primary">{formatCurrency(total)}</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Syarat &amp; Catatan</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Syarat &amp; Ketentuan</Label>
                                            <Textarea rows={5} value={data.terms} onChange={(e) => setData('terms', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Catatan (opsional)</Label>
                                            <Textarea rows={2} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Pratinjau Dokumen</CardTitle>
                                    <CardDescription>Tampilan di layar. Klik <strong>Pratinjau PDF</strong> untuk hasil cetak sebenarnya.</CardDescription>
                                </div>
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">Watermark DRAFT</span>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[70vh] overflow-auto rounded-lg border bg-muted/30 p-4">
                                    <QuotationDocumentPreview
                                        data={{ ...data, status: 'Draft', quotation_number: quotation?.quotation_number }}
                                        settings={settings}
                                        creatorName={quotation?.creator?.name}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button type="button" variant="outline" asChild><Link href="/quotations">Batal</Link></Button>
                        <Button type="button" variant="secondary" onClick={openPdfPreview} disabled={pdfLoading}>
                            {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Pratinjau PDF
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Simpan Perubahan' : 'Buat Penawaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

QuotationForm.layout = {
    breadcrumbs: [
        { title: 'Penawaran / RAB', href: '/quotations' },
        { title: 'Form', href: '#' },
    ],
};
