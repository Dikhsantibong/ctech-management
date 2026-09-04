import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, FileText, Trash2, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function InvoicesIndex({ invoices }: { invoices: any[] }) {
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const { delete: destroy, processing } = useForm({});

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

    const openDelete = (inv: any) => {
        setSelected(inv);
        setDeleteOpen(true);
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/invoices/${selected?.id}`, { onSuccess: () => setDeleteOpen(false) });
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Sent': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title="Invoices" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
                        <p className="text-muted-foreground">Kelola tagihan dan buat invoice PDF otomatis.</p>
                    </div>
                    <Button asChild>
                        <Link href="/invoices/create">
                            <Plus className="mr-2 h-4 w-4" /> Buat Invoice
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nomor Invoice</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Klien</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jatuh Tempo</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            <Link href={`/invoices/${inv.id}`} className="flex items-center gap-2 hover:underline">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {inv.invoice_number}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle">{inv.client_name}</td>
                                        <td className="p-4 align-middle"><Badge variant={statusBadgeColor(inv.status)}>{inv.status}</Badge></td>
                                        <td className="p-4 align-middle text-muted-foreground">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="p-4 text-right align-middle font-medium">{formatCurrency(Number(inv.total))}</td>
                                        <td className="p-4 text-right align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/invoices/${inv.id}`}><Eye className="mr-2 h-4 w-4" /> Lihat Detail</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/invoices/${inv.id}/edit`}><Edit2 className="mr-2 h-4 w-4" /> Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/invoices/${inv.id}/pdf`} target="_blank" rel="noopener noreferrer"><Eye className="mr-2 h-4 w-4" /> Preview PDF</a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/invoices/${inv.id}/kwitansi`} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" /> Cetak Kwitansi</a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openDelete(inv)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Belum ada invoice.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Invoice</DialogTitle>
                        <DialogDescription>
                            Yakin menghapus <span className="font-semibold">{selected?.invoice_number}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDelete}>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Batal</Button>
                            <Button type="submit" variant="destructive" disabled={processing}>Hapus</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [{ title: 'Invoices', href: '/invoices' }],
};
