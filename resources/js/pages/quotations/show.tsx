import { Head, Link, router } from '@inertiajs/react';
import { Fragment } from 'react';
import { ArrowLeft, Download, Eye, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function QuotationShow({ quotation }: { quotation: any; settings?: any }) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

    const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-');

    const updateStatus = (status: string) => {
        router.put(`/quotations/${quotation.id}/status`, { status }, { preserveScroll: true });
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'Diterima': return 'default';
            case 'Terkirim': return 'secondary';
            case 'Ditolak': return 'destructive';
            default: return 'outline';
        }
    };

    const items: any[] = quotation.items || [];
    const hasCategories = items.some((it) => it.category);
    const afterDiscount = Number(quotation.subtotal) - Number(quotation.discount);

    // Group items by category preserving order
    const groups: { category: string; items: any[] }[] = [];
    for (const it of items) {
        const cat = it.category || '';
        let group = groups.find((g) => g.category === cat);
        if (!group) {
            group = { category: cat, items: [] };
            groups.push(group);
        }
        group.items.push(it);
    }
    const sectionLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <>
            <Head title={quotation.quotation_number} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/quotations"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold tracking-tight">{quotation.quotation_number}</h2>
                                <Badge variant={statusBadge(quotation.status)}>{quotation.status}</Badge>
                            </div>
                            <p className="text-muted-foreground">{quotation.subject}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-36">
                            <Select value={quotation.status} onValueChange={updateStatus}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Terkirim">Terkirim</SelectItem>
                                    <SelectItem value="Diterima">Diterima</SelectItem>
                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" asChild>
                            <a href={`/quotations/${quotation.id}/preview`} target="_blank" rel="noopener noreferrer"><Eye className="mr-2 h-4 w-4" /> Preview PDF</a>
                        </Button>
                        <Button asChild>
                            <a href={`/quotations/${quotation.id}/pdf`} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4" /> Download PDF</a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader className="border-b bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Rincian RAB</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                                                <th className="px-4 py-2 text-left">No</th>
                                                <th className="px-4 py-2 text-left">Uraian</th>
                                                <th className="px-4 py-2 text-center">Satuan</th>
                                                <th className="px-4 py-2 text-center">Volume</th>
                                                <th className="px-4 py-2 text-right">Harga Satuan</th>
                                                <th className="px-4 py-2 text-right">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hasCategories
                                                ? groups.map((group, gi) => {
                                                    const catTotal = group.items.reduce((s, it) => s + Number(it.total), 0);
                                                    return (
                                                        <Fragment key={gi}>
                                                            <tr className="bg-indigo-50 dark:bg-indigo-950/30">
                                                                <td colSpan={6} className="px-4 py-2 font-semibold text-indigo-800 dark:text-indigo-300">
                                                                    {sectionLetters[gi] || '•'}. {group.category || 'Lain-lain'}
                                                                </td>
                                                            </tr>
                                                            {group.items.map((it, ii) => (
                                                                <tr key={ii} className="border-b">
                                                                    <td className="px-4 py-2 text-center">{ii + 1}</td>
                                                                    <td className="px-4 py-2">{it.description}</td>
                                                                    <td className="px-4 py-2 text-center">{it.unit || '-'}</td>
                                                                    <td className="px-4 py-2 text-center">{Number(it.quantity)}</td>
                                                                    <td className="px-4 py-2 text-right">{formatCurrency(Number(it.price))}</td>
                                                                    <td className="px-4 py-2 text-right">{formatCurrency(Number(it.total))}</td>
                                                                </tr>
                                                            ))}
                                                            <tr className="border-b bg-muted/30 font-medium">
                                                                <td colSpan={5} className="px-4 py-2 text-right">Subtotal {sectionLetters[gi]}</td>
                                                                <td className="px-4 py-2 text-right">{formatCurrency(catTotal)}</td>
                                                            </tr>
                                                        </Fragment>
                                                    );
                                                })
                                                : items.map((it, i) => (
                                                    <tr key={i} className="border-b">
                                                        <td className="px-4 py-2 text-center">{i + 1}</td>
                                                        <td className="px-4 py-2">{it.description}</td>
                                                        <td className="px-4 py-2 text-center">{it.unit || '-'}</td>
                                                        <td className="px-4 py-2 text-center">{Number(it.quantity)}</td>
                                                        <td className="px-4 py-2 text-right">{formatCurrency(Number(it.price))}</td>
                                                        <td className="px-4 py-2 text-right">{formatCurrency(Number(it.total))}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end border-t p-4">
                                    <div className="w-full max-w-xs space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatCurrency(Number(quotation.subtotal))}</span></div>
                                        {Number(quotation.discount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Diskon</span><span className="font-medium">- {formatCurrency(Number(quotation.discount))}</span></div>}
                                        {Number(quotation.discount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">DPP</span><span className="font-medium">{formatCurrency(afterDiscount)}</span></div>}
                                        {Number(quotation.tax) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">PPN ({Number(quotation.tax_rate)}%)</span><span className="font-medium">{formatCurrency(Number(quotation.tax))}</span></div>}
                                        <div className="flex justify-between border-t pt-2 text-base"><span className="font-bold">Total</span><span className="font-bold text-primary">{formatCurrency(Number(quotation.total))}</span></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {quotation.terms && (
                            <Card>
                                <CardHeader><CardTitle className="text-base">Syarat &amp; Ketentuan</CardTitle></CardHeader>
                                <CardContent><p className="whitespace-pre-line text-sm text-muted-foreground">{quotation.terms}</p></CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Detail Penawaran</CardTitle></CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div><p className="text-muted-foreground">Klien</p><p className="font-medium">{quotation.client_name}</p></div>
                                {quotation.client_pic && <div><p className="text-muted-foreground">PIC</p><p className="font-medium">{quotation.client_pic}</p></div>}
                                {quotation.client_address && <div><p className="text-muted-foreground">Alamat</p><p className="font-medium">{quotation.client_address}</p></div>}
                                <div><p className="text-muted-foreground">Tanggal</p><p className="font-medium">{formatDate(quotation.quotation_date)}</p></div>
                                <div><p className="text-muted-foreground">Berlaku Sampai</p><p className="font-medium">{formatDate(quotation.valid_until)}</p></div>
                                <div><p className="text-muted-foreground">Dibuat oleh</p><p className="font-medium">{quotation.creator?.name || '-'}</p></div>
                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <p className="text-xs text-muted-foreground">Grand Total</p>
                                    <p className="text-lg font-bold text-primary">{formatCurrency(Number(quotation.total))}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

QuotationShow.layout = {
    breadcrumbs: [
        { title: 'Penawaran / RAB', href: '/quotations' },
        { title: 'Detail', href: '#' },
    ],
};
