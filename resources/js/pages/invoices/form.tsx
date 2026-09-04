import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Pencil, Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface InvoiceItem {
    id: number | null;
    description: string;
    quantity: number;
    price: number;
}

interface ClientOption {
    name: string;
    pic?: string | null;
}

const emptyItem = (): InvoiceItem => ({ id: null, description: '', quantity: 1, price: 0 });

export default function InvoiceForm({ invoice, clients, settings }: { invoice: any | null; clients: ClientOption[]; settings?: any }) {
    const isEdit = !!invoice;
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [pdfLoading, setPdfLoading] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        client_name: invoice?.client_name || '',
        due_date: invoice?.due_date ? invoice.due_date.split('T')[0] : new Date().toISOString().split('T')[0],
        use_tax: invoice ? parseFloat(invoice.tax) > 0 : true,
        tax_rate: invoice && invoice.subtotal > 0 ? Math.round((invoice.tax / invoice.subtotal) * 100) : 11,
        items: (invoice?.items?.length
            ? invoice.items.map((it: any) => ({ id: it.id, description: it.description, quantity: Number(it.quantity), price: Number(it.price) }))
            : [emptyItem()]) as InvoiceItem[],
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

    const subtotal = data.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    const tax = data.use_tax ? subtotal * ((Number(data.tax_rate) || 0) / 100) : 0;
    const total = subtotal + tax;

    const addItem = () => setData('items', [...data.items, emptyItem()]);
    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
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
            put(`/invoices/${invoice.id}`);
        } else {
            post('/invoices');
        }
    };

    const openPdfPreview = async () => {
        if (!data.items.some((it) => it.description.trim())) {
            alert('Isi minimal satu baris item sebelum melihat pratinjau PDF.');
            return;
        }
        setPdfLoading(true);
        try {
            const xsrf = decodeURIComponent(document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');
            const response = await fetch('/invoices/preview-draft', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrf,
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ...data, invoice_number: invoice?.invoice_number }),
            });
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok || !contentType.includes('pdf')) {
                let message = 'Gagal membuat pratinjau PDF. Pastikan data sudah terisi.';
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
            <Head title={isEdit ? 'Edit Invoice' : 'Buat Invoice'} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href="/invoices"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Invoice' : 'Buat Invoice'}</h2>
                            <p className="text-muted-foreground">{isEdit ? invoice.invoice_number : 'Buat invoice baru dengan rincian item.'}</p>
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
                                    <CardTitle>Data Klien & Invoice</CardTitle>
                                    <CardDescription>Informasi tujuan dan tanggal jatuh tempo.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Nama Klien / Perusahaan</Label>
                                        <Input list="client-list" value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} required />
                                        <datalist id="client-list">{clients.map((c) => <option key={c.name} value={c.name} />)}</datalist>
                                        {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal Jatuh Tempo</Label>
                                        <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} required />
                                        {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                                    </div>
                                    <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
                                        <div className="space-y-0.5">
                                            <Label>Gunakan PPN</Label>
                                            <p className="text-xs text-muted-foreground">Dihitung dari subtotal.</p>
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                    <div>
                                        <CardTitle>Rincian Item</CardTitle>
                                        <CardDescription>Tambahkan item-item yang akan ditagih.</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Tambah Item</Button>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="hidden gap-2 px-2 text-xs font-medium text-muted-foreground sm:flex">
                                        <span className="flex-1">Deskripsi</span>
                                        <span className="w-[15%]">Jumlah</span>
                                        <span className="w-[20%]">Harga Satuan</span>
                                        <span className="w-[20%] text-right">Total</span>
                                        <span className="w-8" />
                                    </div>
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-2 rounded-md border bg-muted/20 p-2 sm:flex-row sm:items-center">
                                            <Input className="sm:flex-1" placeholder="Deskripsi item" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} required />
                                            <Input className="sm:w-[15%]" type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} required />
                                            <Input className="sm:w-[20%]" type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} required />
                                            <span className="hidden sm:inline-block sm:w-[20%] text-right text-sm font-medium">{formatCurrency((item.quantity || 0) * (item.price || 0))}</span>
                                            <div className="flex items-center justify-between gap-1 sm:w-8">
                                                <span className="text-xs text-muted-foreground sm:hidden">{formatCurrency((item.quantity || 0) * (item.price || 0))}</span>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(index)} disabled={data.items.length === 1}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                                        {data.use_tax && <div className="flex justify-between text-sm"><span className="text-muted-foreground">PPN ({data.tax_rate || 0}%)</span><span className="font-medium">{formatCurrency(tax)}</span></div>}
                                        <div className="flex justify-between border-t pt-2 text-base"><span className="font-bold">Grand Total</span><span className="font-bold text-primary">{formatCurrency(total)}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
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
                                <div className="max-h-[70vh] overflow-auto rounded-lg border bg-white dark:bg-slate-950 p-8">
                                    {/* Document-like preview */}
                                    <div className="mx-auto max-w-2xl space-y-6">
                                        <div className="text-center space-y-1">
                                            <h3 className="text-xl font-bold">{settings?.company_name || 'CTECH'}</h3>
                                            {settings?.address && <p className="text-xs text-muted-foreground">{settings.address}</p>}
                                            {(settings?.phone || settings?.email) && <p className="text-xs text-muted-foreground">{[settings?.phone, settings?.email].filter(Boolean).join(' | ')}</p>}
                                        </div>
                                        <hr />
                                        <div className="flex justify-between text-sm">
                                            <div>
                                                <p className="font-semibold">Kepada:</p>
                                                <p>{data.client_name || '-'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">Invoice: {invoice?.invoice_number || 'DRAFT'}</p>
                                                <p className="text-muted-foreground">Jatuh Tempo: {data.due_date ? new Date(data.due_date).toLocaleDateString('id-ID') : '-'}</p>
                                            </div>
                                        </div>
                                        <table className="w-full text-sm border">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="p-2 text-left">No</th>
                                                    <th className="p-2 text-left">Deskripsi</th>
                                                    <th className="p-2 text-center">Qty</th>
                                                    <th className="p-2 text-right">Harga</th>
                                                    <th className="p-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.items.map((item, i) => (
                                                    <tr key={i} className="border-b">
                                                        <td className="p-2">{i + 1}</td>
                                                        <td className="p-2">{item.description || '-'}</td>
                                                        <td className="p-2 text-center">{item.quantity}</td>
                                                        <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                                        <td className="p-2 text-right font-medium">{formatCurrency((item.quantity || 0) * (item.price || 0))}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-b bg-muted/20">
                                                    <td colSpan={4} className="p-2 text-right font-medium">Subtotal</td>
                                                    <td className="p-2 text-right font-medium">{formatCurrency(subtotal)}</td>
                                                </tr>
                                                {data.use_tax && (
                                                    <tr className="border-b bg-muted/20">
                                                        <td colSpan={4} className="p-2 text-right font-medium">PPN ({data.tax_rate}%)</td>
                                                        <td className="p-2 text-right font-medium">{formatCurrency(tax)}</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-muted/50">
                                                    <td colSpan={4} className="p-2 text-right font-bold">Grand Total</td>
                                                    <td className="p-2 text-right font-bold text-lg">{formatCurrency(total)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="text-right text-sm mt-8">
                                            <p>Hormat kami,</p>
                                            <p className="font-bold">{settings?.company_name || 'CTECH'}</p>
                                            <div className="h-16" />
                                            <p className="font-bold underline">{settings?.leader_name || '-'}</p>
                                            <p>Direktur Utama</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button type="button" variant="outline" asChild><Link href="/invoices">Batal</Link></Button>
                        <Button type="button" variant="secondary" onClick={openPdfPreview} disabled={pdfLoading}>
                            {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Pratinjau PDF
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Simpan Perubahan' : 'Buat Invoice'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

InvoiceForm.layout = {
    breadcrumbs: [
        { title: 'Invoices', href: '/invoices' },
        { title: 'Form', href: '#' },
    ],
};
