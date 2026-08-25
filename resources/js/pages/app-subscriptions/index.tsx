import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format, differenceInDays, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export default function AppSubscriptionsIndex({ subscriptions }: { subscriptions: any[] }) {
    // Dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    // Form state
    const [selectedSub, setSelectedSub] = useState<any>(null);
    const [formData, setFormData] = useState({
        client_name: '',
        app_name: '',
        billing_amount: '',
        start_date: '',
        deadline: '',
        is_invoiced: false,
        is_active: true
    });
    
    const [isProcessing, setIsProcessing] = useState(false);

    const resetForm = () => {
        setFormData({
            client_name: '',
            app_name: '',
            billing_amount: '',
            start_date: '',
            deadline: '',
            is_invoiced: false,
            is_active: true
        });
        setSelectedSub(null);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        router.post('/app-subscriptions', formData, {
            onSuccess: () => {
                setIsCreateOpen(false);
                resetForm();
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleEdit = (sub: any) => {
        setSelectedSub(sub);
        setFormData({
            client_name: sub.client_name,
            app_name: sub.app_name,
            billing_amount: sub.billing_amount,
            start_date: sub.start_date,
            deadline: sub.deadline,
            is_invoiced: sub.is_invoiced,
            is_active: sub.is_active
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        router.put(`/app-subscriptions/${selectedSub?.id}`, formData, {
            onSuccess: () => {
                setIsEditOpen(false);
                resetForm();
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleDelete = () => {
        setIsProcessing(true);
        router.delete(`/app-subscriptions/${selectedSub?.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                resetForm();
            },
            onFinish: () => setIsProcessing(false)
        });
    };

    const getStatusBadge = (sub: any) => {
        if (!sub.is_active) {
            return <Badge variant="secondary">Tidak Aktif</Badge>;
        }
        
        const daysLeft = differenceInDays(new Date(sub.deadline), new Date());
        if (daysLeft < 0) {
            return <Badge variant="destructive">Expired</Badge>;
        } else if (daysLeft <= 7) {
            return <Badge variant="destructive" className="bg-orange-500">Mendekati Deadline ({daysLeft} Hari)</Badge>;
        }
        
        return <Badge variant="default" className="bg-emerald-500">Aktif ({daysLeft} Hari)</Badge>;
    };

    const expiringSubscriptions = subscriptions.filter(sub => {
        if (!sub.is_active) return false;
        const daysLeft = differenceInDays(new Date(sub.deadline), new Date());
        return daysLeft <= 7;
    });

    const autoCalculateDeadline = (startDateStr: string, siklusBulan: number) => {
        if (!startDateStr) return '';
        const start = new Date(startDateStr);
        let nextDeadline = new Date(start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (siklusBulan <= 0) siklusBulan = 1;

        while (nextDeadline <= today) {
            nextDeadline = addMonths(nextDeadline, siklusBulan);
        }
        return format(nextDeadline, 'yyyy-MM-dd');
    };

    return (
        <>
            <Head title="Langganan Aplikasi" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Langganan Aplikasi</h2>
                        <p className="text-muted-foreground mt-1">Kelola masa aktif dan tagihan aplikasi klien.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Langganan
                    </Button>
                </div>

                {expiringSubscriptions.length > 0 && (
                    <div className="rounded-lg border border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-orange-100 p-1 dark:bg-orange-900">
                                <span className="flex h-5 w-5 items-center justify-center text-orange-600 dark:text-orange-400">⚠️</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-800 dark:text-orange-300">Pengingat Tagihan & Perpanjangan</h3>
                                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                                    Terdapat {expiringSubscriptions.length} klien yang mendekati atau telah melewati masa tenggang pembayaran.
                                    Sistem akan secara otomatis membuat draft invoice pada H-3 deadline.
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-orange-700/90 dark:text-orange-400/90 list-disc pl-5">
                                    {expiringSubscriptions.map(sub => (
                                        <li key={sub.id}>
                                            <strong>{sub.client_name} ({sub.app_name})</strong> - Jatuh tempo pada {format(new Date(sub.deadline), 'dd MMM yyyy', { locale: id })} 
                                            {sub.is_invoiced ? ' (Invoice sudah dikirim)' : ' (Menunggu Generate Invoice)'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-lg border bg-card text-card-foreground">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Klien & Aplikasi</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tagihan</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Periode</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status Invoiced</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status Masa Aktif</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                Belum ada data langganan.
                                            </td>
                                        </tr>
                                    ) : (
                                        subscriptions.map((sub) => (
                                            <tr key={sub.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    <p className="font-medium">{sub.client_name}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.app_name}</p>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className="font-medium">{formatRupiah(sub.billing_amount)}</span>
                                                </td>
                                                <td className="p-4 align-middle text-muted-foreground">
                                                    <div className="text-xs space-y-1">
                                                        <p><span>Mulai:</span> {format(new Date(sub.start_date), 'dd MMM yyyy', { locale: id })}</p>
                                                        <p><span>Tempo:</span> <span className="font-medium text-foreground">{format(new Date(sub.deadline), 'dd MMM yyyy', { locale: id })}</span></p>
                                                        <p className="text-emerald-600 dark:text-emerald-500 font-medium">Berjalan: {differenceInDays(new Date(), new Date(sub.start_date))} Hari</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {sub.is_invoiced ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                            <CheckCircle2 className="h-4 w-4" /> Ter-invoice
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-medium">
                                                            <XCircle className="h-4 w-4" /> Belum
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {getStatusBadge(sub)}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleEdit(sub)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => {
                                                                setSelectedSub(sub);
                                                                setIsDeleteOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create */}
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                if(!open) resetForm();
                setIsCreateOpen(open);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Langganan Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="client_name">Nama Klien</Label>
                            <Input 
                                id="client_name" 
                                value={formData.client_name}
                                onChange={e => setFormData({...formData, client_name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="app_name">Nama Aplikasi</Label>
                            <Input 
                                id="app_name" 
                                placeholder="Cth: Photobooth App"
                                value={formData.app_name}
                                onChange={e => setFormData({...formData, app_name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="billing_amount">Nominal Tagihan (Rp)</Label>
                            <Input 
                                id="billing_amount" 
                                type="text" 
                                value={formData.billing_amount ? new Intl.NumberFormat('id-ID').format(Number(formData.billing_amount)) : ''}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({...formData, billing_amount: val});
                                }}
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md border">
                            <div className="grid gap-2">
                                <Label htmlFor="lama_berjalan" className="text-muted-foreground text-xs font-semibold uppercase">Lama Berjalan (Bulan)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="lama_berjalan" 
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            const newStart = subMonths(new Date(), val);
                                            const startStr = format(newStart, 'yyyy-MM-dd');
                                            const siklusInput = document.getElementById('siklus') as HTMLInputElement;
                                            const siklus = siklusInput ? (parseInt(siklusInput.value) || 12) : 12;
                                            setFormData(prev => ({
                                                ...prev, 
                                                start_date: startStr,
                                                deadline: autoCalculateDeadline(startStr, siklus)
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="siklus" className="text-muted-foreground text-xs font-semibold uppercase">Siklus Tagihan (Bulan)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="siklus" 
                                        type="number" 
                                        placeholder="12"
                                        onChange={(e) => {
                                            const siklus = parseInt(e.target.value) || 12;
                                            if (formData.start_date) {
                                                setFormData(prev => ({
                                                    ...prev, 
                                                    deadline: autoCalculateDeadline(prev.start_date, siklus)
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Tgl Mulai Aktif</Label>
                                <Input 
                                    id="start_date" 
                                    type="date" 
                                    value={formData.start_date}
                                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deadline">Tgl Jatuh Tempo Berikutnya</Label>
                                <Input 
                                    id="deadline" 
                                    type="date" 
                                    value={formData.deadline}
                                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                                    required 
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isProcessing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                if(!open) resetForm();
                setIsEditOpen(open);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Langganan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_client_name">Nama Klien</Label>
                            <Input 
                                id="edit_client_name" 
                                value={formData.client_name}
                                onChange={e => setFormData({...formData, client_name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_app_name">Nama Aplikasi</Label>
                            <Input 
                                id="edit_app_name" 
                                value={formData.app_name}
                                onChange={e => setFormData({...formData, app_name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_billing_amount">Nominal Tagihan (Rp)</Label>
                            <Input 
                                id="edit_billing_amount" 
                                type="text" 
                                value={formData.billing_amount ? new Intl.NumberFormat('id-ID').format(Number(formData.billing_amount)) : ''}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({...formData, billing_amount: val});
                                }}
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md border">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_lama_berjalan" className="text-muted-foreground text-xs font-semibold uppercase">Lama Berjalan (Bulan)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="edit_lama_berjalan" 
                                        type="number"
                                        placeholder="Ubah Mundur (Opsional)"
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            const newStart = subMonths(new Date(), val);
                                            const startStr = format(newStart, 'yyyy-MM-dd');
                                            const siklusInput = document.getElementById('edit_siklus') as HTMLInputElement;
                                            const siklus = siklusInput ? (parseInt(siklusInput.value) || 12) : 12;
                                            setFormData(prev => ({
                                                ...prev, 
                                                start_date: startStr,
                                                deadline: autoCalculateDeadline(startStr, siklus)
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_siklus" className="text-muted-foreground text-xs font-semibold uppercase">Siklus Tagihan (Bulan)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="edit_siklus" 
                                        type="number" 
                                        placeholder="Hitung Kedepan (Opsional)"
                                        onChange={(e) => {
                                            const siklus = parseInt(e.target.value) || 12;
                                            if (formData.start_date) {
                                                setFormData(prev => ({
                                                    ...prev, 
                                                    deadline: autoCalculateDeadline(prev.start_date, siklus)
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_start_date">Tgl Mulai Aktif</Label>
                                <Input 
                                    id="edit_start_date" 
                                    type="date" 
                                    value={formData.start_date}
                                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_deadline">Tgl Jatuh Tempo Berikutnya</Label>
                                <Input 
                                    id="edit_deadline" 
                                    type="date" 
                                    value={formData.deadline}
                                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_invoiced}
                                    onChange={e => setFormData({...formData, is_invoiced: e.target.checked})}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm font-medium">Invoice Sudah Digenerate</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_active}
                                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm font-medium">Status Langganan Aktif</span>
                            </label>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); }}>Batal</Button>
                            <Button type="submit" disabled={isProcessing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Delete */}
            <Dialog open={isDeleteOpen} onOpenChange={(open) => {
                if(!open) resetForm();
                setIsDeleteOpen(open);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Langganan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data langganan <strong>{selectedSub?.app_name}</strong> untuk klien <strong>{selectedSub?.client_name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => { setIsDeleteOpen(false); resetForm(); }}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AppSubscriptionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'App Subscriptions',
            href: '/app-subscriptions',
        },
    ],
};
