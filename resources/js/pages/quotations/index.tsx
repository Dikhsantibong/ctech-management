import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreVertical, FileSpreadsheet, Trash2, Eye, Edit2 } from 'lucide-react';
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

export default function QuotationsIndex({ quotations }: { quotations: any[] }) {
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const { delete: destroy, processing } = useForm({});

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);

    const openDelete = (q: any) => {
        setSelected(q);
        setDeleteOpen(true);
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/quotations/${selected?.id}`, { onSuccess: () => setDeleteOpen(false) });
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'Diterima': return 'default';
            case 'Terkirim': return 'secondary';
            case 'Ditolak': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title="Penawaran / RAB" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Penawaran / RAB</h2>
                        <p className="text-muted-foreground">Buat dokumen penawaran lengkap dengan Rencana Anggaran Biaya.</p>
                    </div>
                    <Button asChild>
                        <Link href="/quotations/create">
                            <Plus className="mr-2 h-4 w-4" /> Buat Penawaran
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nomor</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Klien</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Perihal</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.map((q) => (
                                    <tr key={q.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            <Link href={`/quotations/${q.id}`} className="flex items-center gap-2 hover:underline">
                                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                                {q.quotation_number}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle">{q.client_name}</td>
                                        <td className="max-w-[220px] truncate p-4 align-middle text-muted-foreground">{q.subject}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{q.quotation_date ? new Date(q.quotation_date).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="p-4 align-middle"><Badge variant={statusBadge(q.status)}>{q.status}</Badge></td>
                                        <td className="p-4 text-right align-middle font-medium">{formatCurrency(Number(q.total))}</td>
                                        <td className="p-4 text-right align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/quotations/${q.id}`}><Eye className="mr-2 h-4 w-4" /> Lihat Detail</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/quotations/${q.id}/edit`}><Edit2 className="mr-2 h-4 w-4" /> Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/quotations/${q.id}/preview`} target="_blank" rel="noopener noreferrer"><Eye className="mr-2 h-4 w-4" /> Preview PDF</a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openDelete(q)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {quotations.length === 0 && (
                                    <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Belum ada penawaran.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Penawaran</DialogTitle>
                        <DialogDescription>
                            Yakin menghapus <span className="font-semibold">{selected?.quotation_number}</span>? Tindakan ini tidak dapat dibatalkan.
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

QuotationsIndex.layout = {
    breadcrumbs: [{ title: 'Penawaran / RAB', href: '/quotations' }],
};
